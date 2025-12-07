import { Response, NextFunction } from 'express';
import DonHang from '../models/DonHang';
import Xe from '../models/Xe';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { giuTienEscrow, traTienNguoiBan } from './walletController';

export const createDonHang = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { 
      idXe, 
      tongTien, 
      phuongThucThanhToan, 
      diaChiGiao, 
      ghiChu, 
      chiPhi,
      tienCoc,
      trangThaiCoc,
      vayNganHang 
    } = req.body;

    // Check if xe exists
    const xe = await Xe.findById(idXe);
    if (!xe) {
      next(createError('Không tìm thấy xe', 404));
      return;
    }

    if (xe.trangThai !== 'dangBan') {
      next(createError('Xe không còn bán', 400));
      return;
    }

    let donHangData: any = {
      idKhachHang: req.user!.id,
      idXe,
      tongTien: tongTien || xe.gia,
      phuongThucThanhToan,
      diaChiGiao,
      ghiChu,
      chiPhi,
    };

    // Thêm thông tin cọc nếu có
    if (tienCoc) {
      donHangData.tienCoc = tienCoc;
      donHangData.trangThaiCoc = trangThaiCoc || 'chuaThanhToan';
    }

    // Thêm thông tin vay ngân hàng nếu có
    if (vayNganHang) {
      donHangData.vayNganHang = vayNganHang;
    }

    const donHang = await DonHang.create(donHangData);

    // Update xe status
    xe.trangThai = 'dangCho';
    await xe.save();

    res.status(201).json({
      success: true,
      data: { donHang },
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      next(createError(messages.join(', '), 400));
    } else {
      next(error);
    }
  }
};

export const getDonHangByUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const donHangList = await DonHang.find({ idKhachHang: req.user!.id })
      .populate('idXe')
      .sort({ createdAt: -1 });

    // Transform _id to id for frontend
    const donHang = donHangList.map((item: any) => {
      const obj = item.toObject();
      return {
        ...obj,
        id: obj._id?.toString() || '',
      };
    });

    res.json({
      success: true,
      data: { donHang },
    });
  } catch (error) {
    next(error);
  }
};

export const getDonHangById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const donHangDoc: any = await DonHang.findById(req.params.id)
      .populate('idKhachHang', 'ten email sdt')
      .populate('idXe');

    if (!donHangDoc) {
      next(createError('Không tìm thấy đơn hàng', 404));
      return;
    }

    // Check if user is authorized to view this order
    const idKhachHang = donHangDoc.idKhachHang?._id 
      ? donHangDoc.idKhachHang._id.toString() 
      : donHangDoc.idKhachHang.toString();
      
    if (req.user?.vaiTro !== 'admin' && idKhachHang !== req.user?.id) {
      next(createError('Bạn không có quyền xem đơn hàng này', 403));
      return;
    }

    // Transform _id to id for frontend
    const donHangObj = donHangDoc.toObject();
    const donHang = {
      ...donHangObj,
      id: donHangObj._id?.toString() || '',
    };

    res.json({
      success: true,
      data: { donHang },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDonHang = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1', limit = '10', trangThai } = req.query;

    const query: any = {};
    if (trangThai) query.trangThai = trangThai;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [donHangList, total] = await Promise.all([
      DonHang.find(query)
        .populate('idKhachHang', 'ten email sdt')
        .populate('idXe')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      DonHang.countDocuments(query),
    ]);

    // Transform _id to id for frontend
    const donHang = donHangList.map((item: any) => {
      const obj = item.toObject();
      return {
        ...obj,
        id: obj._id?.toString() || '',
      };
    });

    res.json({
      success: true,
      data: {
        donHang,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTrangThaiDonHang = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { trangThai } = req.body;

    const donHang = await DonHang.findById(req.params.id);
    if (!donHang) {
      next(createError('Không tìm thấy đơn hàng', 404));
      return;
    }

    donHang.trangThai = trangThai;
    await donHang.save();

    // If delivered, update xe status
    if (trangThai === 'daGiao') {
      const xe = await Xe.findById(donHang.idXe);
      if (xe) {
        xe.trangThai = 'daBan';
        await xe.save();
      }
    }

    res.json({
      success: true,
      data: { donHang },
    });
  } catch (error) {
    next(error);
  }
};

// Upload biên lai chuyển khoản
export const uploadBienLai = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const donHang = await DonHang.findById(id);
    if (!donHang) {
      next(createError('Không tìm thấy đơn hàng', 404));
      return;
    }

    // Kiểm tra quyền (chỉ khách hàng của đơn)
    if (donHang.idKhachHang.toString() !== userId) {
      next(createError('Không có quyền thực hiện', 403));
      return;
    }

    // Kiểm tra file upload
    if (!req.file) {
      next(createError('Vui lòng upload biên lai', 400));
      return;
    }

    // Lưu đường dẫn file
    donHang.bienLaiChuyenKhoan = req.file.path;
    donHang.trangThai = 'choXacNhanThanhToan';
    await donHang.save();

    // Giữ tiền vào ví escrow
    const result = await giuTienEscrow(userId!, donHang.tongTien, id);
    if (!result.success) {
      next(createError(result.message || 'Không thể giữ tiền escrow', 500));
      return;
    }

    donHang.idGiaoDichEscrow = result.idGiaoDich;
    await donHang.save();

    res.json({
      success: true,
      message: 'Upload biên lai thành công. Đang chờ người bán xác nhận.',
      data: { donHang },
    });
  } catch (error) {
    next(error);
  }
};

// Người bán xác nhận đã giao xe
export const nguoiBanXacNhanGiaoXe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const donHang: any = await DonHang.findById(id).populate('idXe');
    if (!donHang) {
      next(createError('Không tìm thấy đơn hàng', 404));
      return;
    }

    // Kiểm tra quyền (chỉ người bán)
    // TODO: Thêm logic kiểm tra idNguoiBan từ model Xe
    
    donHang.nguoiBanXacNhanGiaoXe = true;
    donHang.trangThai = 'dangGiao';
    await donHang.save();

    // Kiểm tra xem cả 2 đã xác nhận chưa
    await kiemTraVaTraTien(donHang);

    res.json({
      success: true,
      message: 'Xác nhận giao xe thành công',
      data: { donHang },
    });
  } catch (error) {
    next(error);
  }
};

// Khách hàng xác nhận đã nhận xe OK
export const khachXacNhanNhanXe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const donHang: any = await DonHang.findById(id).populate('idXe');
    if (!donHang) {
      next(createError('Không tìm thấy đơn hàng', 404));
      return;
    }

    // Kiểm tra quyền (chỉ khách hàng)
    if (donHang.idKhachHang.toString() !== userId) {
      next(createError('Không có quyền thực hiện', 403));
      return;
    }

    donHang.khachXacNhanNhanXe = true;
    await donHang.save();

    // Kiểm tra xem cả 2 đã xác nhận chưa
    await kiemTraVaTraTien(donHang);

    res.json({
      success: true,
      message: 'Xác nhận nhận xe thành công',
      data: { donHang },
    });
  } catch (error) {
    next(error);
  }
};

// Helper: Kiểm tra và trả tiền khi cả 2 bên xác nhận
const kiemTraVaTraTien = async (donHang: any) => {
  if (donHang.nguoiBanXacNhanGiaoXe && donHang.khachXacNhanNhanXe) {
    // Cả 2 đã xác nhận → Trả tiền cho người bán
    const xe: any = donHang.idXe;
    let idNguoiBan = xe.idNguoiBan || xe.idChuXe; // Lấy ID người bán/chủ xe

    if (idNguoiBan) {
      const result = await traTienNguoiBan(
        idNguoiBan.toString(),
        donHang.tongTien,
        donHang._id.toString()
      );

      if (result.success) {
        donHang.trangThai = 'daHoanThanh';
        await donHang.save();

        // Cập nhật trạng thái xe
        xe.trangThai = 'daBan';
        await xe.save();
      }
    }
  }
};

