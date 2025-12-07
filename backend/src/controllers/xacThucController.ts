import { Response, NextFunction } from 'express';
import XacThuc from '../models/XacThuc';
import User from '../models/User';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Upload xác thực
export const uploadXacThuc = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { loaiGiayTo } = req.body;
    const userId = req.user?.id;

    // Kiểm tra đã xác thực chưa
    const existingXacThuc = await XacThuc.findOne({
      idNguoiDung: userId,
      trangThai: { $in: ['choXuLy', 'daDuyet'] },
    });

    if (existingXacThuc) {
      if (existingXacThuc.trangThai === 'daDuyet') {
        next(createError('Tài khoản đã được xác thực', 400));
        return;
      }
      next(createError('Bạn đã gửi yêu cầu xác thực, đang chờ xử lý', 400));
      return;
    }

    // Get uploaded files
    const files = req.files as Express.Multer.File[];
    if (!files || files.length < 2) {
      next(createError('Vui lòng upload đầy đủ mặt trước và mặt sau', 400));
      return;
    }

    const hinhAnhMatTruoc = files[0]?.path;
    const hinhAnhMatSau = files[1]?.path;
    const hinhAnhGiayToXe = files.slice(2).map((f) => f.path);

    const xacThuc = await XacThuc.create({
      idNguoiDung: userId,
      loaiGiayTo,
      hinhAnhMatTruoc,
      hinhAnhMatSau,
      hinhAnhGiayToXe,
      trangThai: 'choXuLy',
    });

    res.status(201).json({
      success: true,
      message: 'Gửi yêu cầu xác thực thành công. Chờ admin duyệt.',
      data: { xacThuc },
    });
  } catch (error) {
    next(error);
  }
};

// Lấy trạng thái xác thực của tôi
export const getMyXacThuc = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const xacThuc = await XacThuc.findOne({ idNguoiDung: userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: { xacThuc },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Lấy danh sách chờ duyệt
export const getAllPending = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { trangThai } = req.query;

    const query: any = {};
    if (trangThai) {
      query.trangThai = trangThai;
    } else {
      query.trangThai = 'choXuLy';
    }

    const xacThucs = await XacThuc.find(query)
      .populate('idNguoiDung', 'ten email sdt')
      .populate('nguoiXuLy', 'ten')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { xacThucs },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Duyệt xác thực
export const approveXacThuc = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const adminId = req.user?.id;

    const xacThuc = await XacThuc.findById(id);
    if (!xacThuc) {
      next(createError('Không tìm thấy yêu cầu xác thực', 404));
      return;
    }

    if (xacThuc.trangThai !== 'choXuLy') {
      next(createError('Yêu cầu xác thực đã được xử lý', 400));
      return;
    }

    // Cập nhật xác thực
    xacThuc.trangThai = 'daDuyet';
    xacThuc.ngayXuLy = new Date();
    xacThuc.nguoiXuLy = adminId as any;
    await xacThuc.save();

    // Cập nhật user
    const user = await User.findById(xacThuc.idNguoiDung);
    if (user) {
      user.xacThuc = {
        daXacThuc: true,
        ngayXacThuc: new Date(),
        loaiXacThuc: [xacThuc.loaiGiayTo],
      };
      
      if (xacThuc.hinhAnhGiayToXe.length > 0) {
        user.xacThuc.loaiXacThuc.push('giayToXe');
      }
      
      await user.save();
    }

    await xacThuc.populate('idNguoiDung', 'ten email');

    res.json({
      success: true,
      message: 'Đã duyệt xác thực',
      data: { xacThuc },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Từ chối xác thực
export const rejectXacThuc = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { lyDoTuChoi } = req.body;
    const adminId = req.user?.id;

    if (!lyDoTuChoi) {
      next(createError('Vui lòng nhập lý do từ chối', 400));
      return;
    }

    const xacThuc = await XacThuc.findById(id);
    if (!xacThuc) {
      next(createError('Không tìm thấy yêu cầu xác thực', 404));
      return;
    }

    if (xacThuc.trangThai !== 'choXuLy') {
      next(createError('Yêu cầu xác thực đã được xử lý', 400));
      return;
    }

    xacThuc.trangThai = 'tuChoi';
    xacThuc.lyDoTuChoi = lyDoTuChoi;
    xacThuc.ngayXuLy = new Date();
    xacThuc.nguoiXuLy = adminId as any;
    await xacThuc.save();

    await xacThuc.populate('idNguoiDung', 'ten email');

    res.json({
      success: true,
      message: 'Đã từ chối xác thực',
      data: { xacThuc },
    });
  } catch (error) {
    next(error);
  }
};

