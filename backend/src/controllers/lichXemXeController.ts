import { Response, NextFunction } from 'express';
import LichXemXe from '../models/LichXemXe';
import Xe from '../models/Xe';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Đặt lịch xem xe
export const datLichXemXe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { idXe, ngayXem, gioXem, diaDiem, ghiChu, soDienThoai } = req.body;
    const idNguoiDat = req.user?.id;

    // Kiểm tra xe
    const xe = await Xe.findById(idXe);
    if (!xe) {
      next(createError('Không tìm thấy xe', 404));
      return;
    }

    if (!xe.idChuXe) {
      next(createError('Xe chưa có chủ sở hữu', 400));
      return;
    }

    const idNguoiBan = xe.idChuXe.toString();

    // Không thể đặt lịch với chính mình
    if (idNguoiDat === idNguoiBan) {
      next(createError('Không thể đặt lịch xem xe của chính mình', 400));
      return;
    }

    // Kiểm tra ngày xem phải trong tương lai
    const ngayXemDate = new Date(ngayXem);
    if (ngayXemDate < new Date()) {
      next(createError('Ngày xem phải trong tương lai', 400));
      return;
    }

    // Tạo lịch xem xe
    const lichXemXe = await LichXemXe.create({
      idXe,
      idNguoiDat,
      idNguoiBan,
      ngayXem: ngayXemDate,
      gioXem,
      diaDiem,
      ghiChu,
      soDienThoai,
      trangThai: 'choDuyet',
    });

    await lichXemXe.populate('idXe', 'tenXe hinhAnh gia');
    await lichXemXe.populate('idNguoiDat', 'ten email sdt');
    await lichXemXe.populate('idNguoiBan', 'ten email sdt');

    res.status(201).json({
      success: true,
      message: 'Đặt lịch xem xe thành công. Chờ người bán xác nhận.',
      data: { lichXemXe },
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách lịch xem xe của tôi
export const getMySchedules = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { role } = req.query; // 'nguoiDat' | 'nguoiBan'

    let query: any = {};
    if (role === 'nguoiDat') {
      query.idNguoiDat = userId;
    } else if (role === 'nguoiBan') {
      query.idNguoiBan = userId;
    } else {
      query.$or = [{ idNguoiDat: userId }, { idNguoiBan: userId }];
    }

    const lichXemXe = await LichXemXe.find(query)
      .populate('idXe', 'tenXe hinhAnh gia')
      .populate('idNguoiDat', 'ten email sdt')
      .populate('idNguoiBan', 'ten email sdt')
      .sort({ ngayXem: -1 });

    res.json({
      success: true,
      data: { lichXemXe },
    });
  } catch (error) {
    next(error);
  }
};

// Người bán duyệt lịch xem xe
export const approveLich = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const lichXemXe = await LichXemXe.findById(id);
    if (!lichXemXe) {
      next(createError('Không tìm thấy lịch xem xe', 404));
      return;
    }

    // Chỉ người bán mới được duyệt
    if (lichXemXe.idNguoiBan.toString() !== userId) {
      next(createError('Bạn không có quyền duyệt lịch này', 403));
      return;
    }

    if (lichXemXe.trangThai !== 'choDuyet') {
      next(createError('Lịch xem xe không ở trạng thái chờ duyệt', 400));
      return;
    }

    lichXemXe.trangThai = 'daDuyet';
    await lichXemXe.save();

    await lichXemXe.populate('idXe', 'tenXe hinhAnh gia');
    await lichXemXe.populate('idNguoiDat', 'ten email sdt');

    res.json({
      success: true,
      message: 'Đã duyệt lịch xem xe',
      data: { lichXemXe },
    });
  } catch (error) {
    next(error);
  }
};

// Hủy lịch xem xe
export const cancelLich = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { lyDoHuy } = req.body;
    const userId = req.user?.id;

    const lichXemXe = await LichXemXe.findById(id);
    if (!lichXemXe) {
      next(createError('Không tìm thấy lịch xem xe', 404));
      return;
    }

    // Chỉ người đặt hoặc người bán mới được hủy
    if (
      lichXemXe.idNguoiDat.toString() !== userId &&
      lichXemXe.idNguoiBan.toString() !== userId
    ) {
      next(createError('Bạn không có quyền hủy lịch này', 403));
      return;
    }

    if (['daHuy', 'daHoanThanh'].includes(lichXemXe.trangThai)) {
      next(createError('Không thể hủy lịch xem xe ở trạng thái này', 400));
      return;
    }

    lichXemXe.trangThai = 'daHuy';
    lichXemXe.lyDoHuy = lyDoHuy;
    await lichXemXe.save();

    res.json({
      success: true,
      message: 'Đã hủy lịch xem xe',
      data: { lichXemXe },
    });
  } catch (error) {
    next(error);
  }
};

// Hoàn thành lịch xem xe
export const completeLich = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const lichXemXe = await LichXemXe.findById(id);
    if (!lichXemXe) {
      next(createError('Không tìm thấy lịch xem xe', 404));
      return;
    }

    // Chỉ người bán mới được đánh dấu hoàn thành
    if (lichXemXe.idNguoiBan.toString() !== userId) {
      next(createError('Chỉ người bán mới có thể đánh dấu hoàn thành', 403));
      return;
    }

    if (lichXemXe.trangThai !== 'daDuyet') {
      next(createError('Lịch xem xe phải ở trạng thái đã duyệt', 400));
      return;
    }

    lichXemXe.trangThai = 'daHoanThanh';
    await lichXemXe.save();

    res.json({
      success: true,
      message: 'Đã hoàn thành lịch xem xe',
      data: { lichXemXe },
    });
  } catch (error) {
    next(error);
  }
};

