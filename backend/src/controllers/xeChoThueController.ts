import { Request, Response, NextFunction } from 'express';
import XeChoThue from '../models/XeChoThue';
import User from '../models/User';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getAllXeChoThue = async (
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
      loaiXe,
      soCho,
      trangThai,
    } = req.query;

    const query: any = {};

    if (search) {
      query.$text = { $search: search as string };
    }

    if (hangXe) query.hangXe = hangXe;
    if (loaiXe) query.loaiXe = loaiXe;
    if (soCho) query.soCho = parseInt(soCho as string);
    if (trangThai) query.trangThai = trangThai;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [xe, total] = await Promise.all([
      XeChoThue.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      XeChoThue.countDocuments(query),
    ]);

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

export const getXeChoThueById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const xe: any = await XeChoThue.findById(req.params.id);

    if (!xe) {
      next(createError('Không tìm thấy xe', 404));
      return;
    }

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

export const createXeChoThue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    // Kiểm tra xác thực KYC
    const user = await User.findById(userId);
    if (!user) {
      next(createError('Không tìm thấy người dùng', 404));
      return;
    }

    if (!user.xacThuc?.daXacThuc) {
      next(createError('Bạn cần xác thực tài khoản (KYC) trước khi đăng cho thuê xe. Vui lòng vào trang xác thực để hoàn tất.', 403));
      return;
    }

    const hinhAnh = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.path)
      : [];

    const xe: any = await XeChoThue.create({
      ...req.body,
      hinhAnh,
      idChuXe: userId,
    });

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

export const updateXeChoThue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let updateData: any = { ...req.body };

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      updateData.hinhAnh = (req.files as Express.Multer.File[]).map((file) => file.path);
    }

    const xe: any = await XeChoThue.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!xe) {
      next(createError('Không tìm thấy xe', 404));
      return;
    }

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

export const deleteXeChoThue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const xe = await XeChoThue.findByIdAndDelete(req.params.id);

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

