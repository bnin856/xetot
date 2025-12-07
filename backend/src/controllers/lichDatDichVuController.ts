import { Response, NextFunction } from 'express';
import LichDatDichVu from '../models/LichDatDichVu';
import DichVu from '../models/DichVu';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Đặt lịch dịch vụ
export const datLich = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { idDichVu, ngayDat, gioDat, diaDiem, soDienThoai, ghiChu } = req.body;

    if (!userId) {
      next(createError('Vui lòng đăng nhập', 401));
      return;
    }

    // Kiểm tra dịch vụ tồn tại
    const dichVu = await DichVu.findById(idDichVu);
    if (!dichVu) {
      next(createError('Không tìm thấy dịch vụ', 404));
      return;
    }

    if (!dichVu.idNguoiCungCap) {
      next(createError('Dịch vụ chưa có người cung cấp', 400));
      return;
    }

    // Kiểm tra ngày phải trong tương lai
    const selectedDate = new Date(ngayDat);
    if (selectedDate < new Date()) {
      next(createError('Ngày đặt lịch phải trong tương lai', 400));
      return;
    }

    // Tạo lịch đặt
    const lichDat = await LichDatDichVu.create({
      idDichVu,
      idKhachHang: userId,
      idNguoiCungCap: dichVu.idNguoiCungCap,
      ngayDat: selectedDate,
      gioDat,
      diaDiem,
      soDienThoai,
      ghiChu,
      trangThai: 'choDuyet',
    });

    await lichDat.populate('idDichVu', 'tenDichVu');
    await lichDat.populate('idKhachHang', 'ten email sdt');
    await lichDat.populate('idNguoiCungCap', 'ten email sdt');

    res.status(201).json({
      success: true,
      message: 'Đặt lịch dịch vụ thành công! Chờ người cung cấp xác nhận.',
      data: { lichDat },
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

// Lấy lịch đặt của user (khách hàng hoặc người cung cấp)
export const getMySchedules = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { role } = req.query; // 'khachHang' hoặc 'nguoiCungCap'

    if (!userId) {
      next(createError('Vui lòng đăng nhập', 401));
      return;
    }

    let query: any = {};
    if (role === 'nguoiCungCap') {
      query = { idNguoiCungCap: userId };
    } else {
      query = { idKhachHang: userId };
    }

    const lichDat = await LichDatDichVu.find(query)
      .populate('idDichVu', 'tenDichVu loaiDichVu giaThamKhao hinhAnh')
      .populate('idKhachHang', 'ten email sdt')
      .populate('idNguoiCungCap', 'ten email sdt')
      .sort({ ngayDat: -1, createdAt: -1 });

    res.json({
      success: true,
      data: { lichDat },
    });
  } catch (error) {
    next(error);
  }
};

// Duyệt lịch (người cung cấp)
export const approve = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const lichDat = await LichDatDichVu.findById(id).populate('idNguoiCungCap');
    if (!lichDat) {
      next(createError('Không tìm thấy lịch đặt', 404));
      return;
    }

    if ((lichDat.idNguoiCungCap as any)._id.toString() !== userId) {
      next(createError('Bạn không có quyền duyệt lịch này', 403));
      return;
    }

    if (lichDat.trangThai !== 'choDuyet') {
      next(createError('Lịch đặt không ở trạng thái chờ duyệt', 400));
      return;
    }

    lichDat.trangThai = 'daDuyet';
    await lichDat.save();

    res.json({
      success: true,
      message: 'Đã duyệt lịch đặt dịch vụ',
      data: { lichDat },
    });
  } catch (error) {
    next(error);
  }
};

// Hủy lịch
export const cancel = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { lyDoHuy } = req.body;

    const lichDat = await LichDatDichVu.findById(id)
      .populate('idKhachHang')
      .populate('idNguoiCungCap');

    if (!lichDat) {
      next(createError('Không tìm thấy lịch đặt', 404));
      return;
    }

    const isKhachHang = (lichDat.idKhachHang as any)._id.toString() === userId;
    const isNguoiCungCap = (lichDat.idNguoiCungCap as any)._id.toString() === userId;

    if (!isKhachHang && !isNguoiCungCap) {
      next(createError('Bạn không có quyền hủy lịch này', 403));
      return;
    }

    if (lichDat.trangThai === 'daHuy' || lichDat.trangThai === 'daHoanThanh') {
      next(createError('Không thể hủy lịch đã hủy hoặc đã hoàn thành', 400));
      return;
    }

    lichDat.trangThai = 'daHuy';
    if (lyDoHuy) {
      lichDat.lyDoHuy = lyDoHuy;
    }
    await lichDat.save();

    res.json({
      success: true,
      message: 'Đã hủy lịch đặt dịch vụ',
      data: { lichDat },
    });
  } catch (error) {
    next(error);
  }
};

// Đánh dấu hoàn thành (người cung cấp)
export const complete = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const lichDat = await LichDatDichVu.findById(id).populate('idNguoiCungCap');
    if (!lichDat) {
      next(createError('Không tìm thấy lịch đặt', 404));
      return;
    }

    if ((lichDat.idNguoiCungCap as any)._id.toString() !== userId) {
      next(createError('Bạn không có quyền đánh dấu hoàn thành', 403));
      return;
    }

    if (lichDat.trangThai !== 'daDuyet') {
      next(createError('Chỉ có thể đánh dấu hoàn thành lịch đã được duyệt', 400));
      return;
    }

    lichDat.trangThai = 'daHoanThanh';
    await lichDat.save();

    res.json({
      success: true,
      message: 'Đã đánh dấu hoàn thành',
      data: { lichDat },
    });
  } catch (error) {
    next(error);
  }
};

