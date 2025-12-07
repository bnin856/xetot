import { Response, NextFunction } from 'express';
import DonThueXe from '../models/DonThueXe';
import XeChoThue from '../models/XeChoThue';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { traTienNguoiChoThue } from './walletController';

// Get all rental orders (Admin only)
export const getAllDonThueXe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const donThueXe = await DonThueXe.find()
      .populate('idKhachHang', 'ten email sdt')
      .populate('idXeChoThue', 'tenXe hangXe hinhAnh giaThueNgay giaThueThang')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donThueXe.length,
      data: donThueXe,
    });
  } catch (error) {
    next(error);
  }
};

// Get rental order by ID
export const getDonThueXeById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const donThueXe = await DonThueXe.findById(req.params.id)
      .populate('idKhachHang', 'ten email sdt diaChi')
      .populate('idXeChoThue', 'tenXe hangXe hinhAnh giaThueNgay giaThueThang');

    if (!donThueXe) {
      next(createError('Không tìm thấy đơn thuê xe', 404));
      return;
    }

    res.json({
      success: true,
      data: donThueXe,
    });
  } catch (error) {
    next(error);
  }
};

// Get rental orders by user ID
export const getDonThueXeByUserId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      next(createError('Vui lòng đăng nhập', 401));
      return;
    }

    const donThueXe = await DonThueXe.find({ idKhachHang: userId })
      .populate('idXeChoThue', 'tenXe hangXe hinhAnh giaThueNgay giaThueThang')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donThueXe.length,
      data: donThueXe,
    });
  } catch (error) {
    next(error);
  }
};

// Create rental order
export const createDonThueXe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      next(createError('Vui lòng đăng nhập', 401));
      return;
    }
    const {
      idXeChoThue,
      ngayBatDau,
      ngayKetThuc,
      tongTien,
      diaChiGiaoNhan,
      ghiChu,
    } = req.body;

    // Validate
    if (!idXeChoThue || !ngayBatDau || !ngayKetThuc || !tongTien || !diaChiGiaoNhan) {
      next(createError('Vui lòng nhập đầy đủ thông tin', 400));
      return;
    }

    // Check if car exists and available
    const xe = await XeChoThue.findById(idXeChoThue);
    if (!xe) {
      next(createError('Không tìm thấy xe', 404));
      return;
    }

    if (xe.trangThai !== 'sanSang') {
      next(createError('Xe không khả dụng để thuê', 400));
      return;
    }

    // Validate dates
    const batDau = new Date(ngayBatDau);
    const ketThuc = new Date(ngayKetThuc);
    const now = new Date();

    if (batDau < now) {
      next(createError('Ngày bắt đầu phải từ hôm nay trở đi', 400));
      return;
    }

    if (ketThuc <= batDau) {
      next(createError('Ngày kết thúc phải sau ngày bắt đầu', 400));
      return;
    }

    // Tính phí: phí thuê + 5% phí sàn
    const PHI_SAN = 0.05; // 5% phí sàn
    const phiSan = tongTien * PHI_SAN;
    const tongTienThanhToan = tongTien + phiSan;

    // Kiểm tra và lấy ví khách hàng
    let walletKhachHang = await Wallet.findOne({ idNguoiDung: userId });
    if (!walletKhachHang) {
      walletKhachHang = await Wallet.create({
        idNguoiDung: userId,
        soDu: 0,
        soDuKhaDung: 0,
        soDuDangGiu: 0,
        trangThai: 'hoatDong',
        loaiVi: 'nguoiMua',
      });
    }

    // Kiểm tra số dư
    if (walletKhachHang.soDuKhaDung < tongTienThanhToan) {
      next(createError(`Số dư ví không đủ. Bạn cần ${tongTienThanhToan.toLocaleString()}₫ (${tongTien.toLocaleString()}₫ phí thuê + ${phiSan.toLocaleString()}₫ phí sàn). Số dư hiện tại: ${walletKhachHang.soDuKhaDung.toLocaleString()}₫`, 400));
      return;
    }

    // Trừ tiền từ ví khách hàng
    const soDuTruoc = walletKhachHang.soDu;
    walletKhachHang.soDu -= tongTienThanhToan;
    walletKhachHang.soDuKhaDung -= tongTienThanhToan;
    await walletKhachHang.save();

    // Tạo transaction trừ tiền
    await Transaction.create({
      idNguoiDung: userId,
      idVi: walletKhachHang._id,
      loaiGiaoDich: 'thanhToanThueXe',
      soTien: tongTienThanhToan,
      soDuTruoc,
      soDuSau: walletKhachHang.soDu,
      trangThai: 'thanhCong',
      moTa: `Thanh toán thuê xe: ${tongTien.toLocaleString()}₫ + ${phiSan.toLocaleString()}₫ phí sàn`,
    });

    // Tạo đơn thuê xe
    const donThueXe = await DonThueXe.create({
      idKhachHang: userId,
      idXeChoThue,
      ngayBatDau,
      ngayKetThuc,
      tongTien,
      phiSan,
      idViKhachHang: walletKhachHang._id,
      diaChiGiaoNhan,
      ghiChu,
      trangThai: 'daXacNhan', // Đã thanh toán nên trạng thái là daXacNhan
    });

    // Trả tiền cho người cho thuê (95% - trừ 5% phí sàn)
    if (xe.idChuXe) {
      const result = await traTienNguoiChoThue(
        xe.idChuXe.toString(),
        tongTien,
        donThueXe._id.toString()
      );
      if (!result.success) {
        console.error('Lỗi khi trả tiền cho người cho thuê:', result.message);
      }
    }

    // Update car status - chỉ update nếu chưa có đơn nào đang thuê
    const donDangThue = await DonThueXe.findOne({
      idXeChoThue: xe._id,
      trangThai: { $in: ['daXacNhan', 'dangThue'] },
      _id: { $ne: donThueXe._id },
    });

    if (!donDangThue) {
      xe.trangThai = 'dangThue';
      await xe.save();
    }

    const populatedDonThueXe = await DonThueXe.findById(donThueXe._id)
      .populate('idKhachHang', 'ten email sdt')
      .populate('idXeChoThue', 'tenXe hangXe hinhAnh');

    res.status(201).json({
      success: true,
      message: 'Đặt thuê xe thành công',
      data: populatedDonThueXe,
    });
  } catch (error) {
    next(error);
  }
};

// Update rental order status
export const updateTrangThaiDonThueXe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { trangThai } = req.body;

    const validStates = ['choXacNhan', 'daXacNhan', 'dangThue', 'daHoanThanh', 'daHuy'];
    if (!validStates.includes(trangThai)) {
      next(createError('Trạng thái không hợp lệ', 400));
      return;
    }

    const donThueXe = await DonThueXe.findById(id);
    if (!donThueXe) {
      next(createError('Không tìm thấy đơn thuê xe', 404));
      return;
    }

    donThueXe.trangThai = trangThai;
    await donThueXe.save();

    // Update car status if order is completed or cancelled
    if (trangThai === 'daHoanThanh' || trangThai === 'daHuy') {
      await XeChoThue.findByIdAndUpdate(donThueXe.idXeChoThue, {
        trangThai: 'sanSang',
      });
    }

    const updated = await DonThueXe.findById(id)
      .populate('idKhachHang', 'ten email sdt')
      .populate('idXeChoThue', 'tenXe hangXe hinhAnh');

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel rental order
export const huyDonThueXe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const donThueXe = await DonThueXe.findById(id);
    if (!donThueXe) {
      next(createError('Không tìm thấy đơn thuê xe', 404));
      return;
    }

    if (!userId) {
      next(createError('Vui lòng đăng nhập', 401));
      return;
    }

    // Check if user owns this order
    if (donThueXe.idKhachHang.toString() !== userId) {
      next(createError('Bạn không có quyền hủy đơn này', 403));
      return;
    }

    // Can only cancel if status is 'choXacNhan' or 'daXacNhan'
    if (!['choXacNhan', 'daXacNhan'].includes(donThueXe.trangThai)) {
      next(createError('Không thể hủy đơn thuê xe ở trạng thái này', 400));
      return;
    }

    donThueXe.trangThai = 'daHuy';
    await donThueXe.save();

    // Update car status back to available
    await XeChoThue.findByIdAndUpdate(donThueXe.idXeChoThue, {
      trangThai: 'sanSang',
    });

    res.json({
      success: true,
      message: 'Hủy đơn thuê xe thành công',
    });
  } catch (error) {
    next(error);
  }
};

// Delete rental order (Admin only)
export const deleteDonThueXe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const donThueXe = await DonThueXe.findByIdAndDelete(req.params.id);

    if (!donThueXe) {
      next(createError('Không tìm thấy đơn thuê xe', 404));
      return;
    }

    res.json({
      success: true,
      message: 'Xóa đơn thuê xe thành công',
    });
  } catch (error) {
    next(error);
  }
};

