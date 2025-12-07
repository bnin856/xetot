import { Request, Response, NextFunction } from 'express';
import Xe from '../models/Xe';
import User from '../models/User';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getAllXe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      search,
      hangXe,
      giaTu,
      giaDen,
      namSanXuat,
      soCho,
      trangThai,
    } = req.query;

    const query: any = {};

    if (search) {
      query.$text = { $search: search as string };
    }

    if (hangXe) query.hangXe = hangXe;
    if (namSanXuat) query.namSanXuat = parseInt(namSanXuat as string);
    if (soCho) query.soCho = parseInt(soCho as string);
    if (trangThai) query.trangThai = trangThai;

    if (giaTu || giaDen) {
      query.gia = {};
      if (giaTu) query.gia.$gte = parseInt(giaTu as string);
      if (giaDen) query.gia.$lte = parseInt(giaDen as string);
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [xe, total] = await Promise.all([
      Xe.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('idChuXe', 'ten email sdt'),
      Xe.countDocuments(query),
    ]);

    // Transform _id to id for frontend
    const xeData = xe.map((item: any) => {
      const obj = item.toObject();
      return {
        ...obj,
        id: obj._id?.toString() || '',
      };
    });

    res.json({
      success: true,
      data: {
        xe: xeData,
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

export const getXeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const xe: any = await Xe.findById(req.params.id).populate('idChuXe', 'ten email sdt');

    if (!xe) {
      next(createError('Không tìm thấy xe', 404));
      return;
    }

    // Transform _id to id for frontend
    const xeObj = xe.toObject();
    const xeData = {
      ...xeObj,
      id: xeObj._id?.toString() || '',
    };

    res.json({
      success: true,
      data: { xe: xeData },
    });
  } catch (error) {
    next(error);
  }
};

export const createXe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    // Kiểm tra xác thực KYC - Bắt buộc khi đăng xe lần đầu
    const user = await User.findById(userId);
    if (!user) {
      next(createError('Không tìm thấy người dùng', 404));
      return;
    }

    // Kiểm tra xem user đã xác thực chưa
    if (!user.xacThuc?.daXacThuc) {
      next(createError('Bạn cần xác thực tài khoản (KYC) trước khi đăng bán xe. Vui lòng vào trang xác thực để hoàn tất.', 403));
      return;
    }

    const hinhAnh = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.path)
      : [];

    const xe: any = await Xe.create({
      ...req.body,
      hinhAnh,
      idChuXe: userId, // Lưu ID chủ xe
    });

    // Transform _id to id for frontend
    const xeObj = xe.toObject();
    const xeData = {
      ...xeObj,
      id: xeObj._id?.toString() || '',
    };

    res.status(201).json({
      success: true,
      data: { xe: xeData },
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

export const updateXe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let updateData: any = { ...req.body };

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      updateData.hinhAnh = (req.files as Express.Multer.File[]).map((file) => file.path);
    }

    const xe: any = await Xe.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!xe) {
      next(createError('Không tìm thấy xe', 404));
      return;
    }

    // Transform _id to id for frontend
    const xeObj = xe.toObject();
    const xeData = {
      ...xeObj,
      id: xeObj._id?.toString() || '',
    };

    res.json({
      success: true,
      data: { xe: xeData },
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

export const deleteXe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const xe = await Xe.findByIdAndDelete(req.params.id);

    if (!xe) {
      next(createError('Không tìm thấy xe', 404));
      return;
    }

    res.json({
      success: true,
      message: 'Xóa xe thành công',
    });
  } catch (error) {
    next(error);
  }
};

