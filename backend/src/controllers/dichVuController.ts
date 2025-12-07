import { Request, Response, NextFunction } from 'express';
import DichVu from '../models/DichVu';
import User from '../models/User';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getAllDichVu = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      search,
      loaiDichVu,
      trangThai,
    } = req.query;

    const query: any = {};

    if (search) {
      query.$text = { $search: search as string };
    }

    if (loaiDichVu) query.loaiDichVu = loaiDichVu;
    if (trangThai) query.trangThai = trangThai;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [dichVu, total] = await Promise.all([
      DichVu.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      DichVu.countDocuments(query),
    ]);

    const dichVuData = dichVu.map((item: any) => {
      const obj = item.toObject();
      return {
        ...obj,
        id: obj._id?.toString() || '',
      };
    });

    res.json({
      success: true,
      data: {
        dichVu: dichVuData,
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

export const getDichVuById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dichVu: any = await DichVu.findById(req.params.id);

    if (!dichVu) {
      next(createError('Không tìm thấy dịch vụ', 404));
      return;
    }

    const dichVuObj = dichVu.toObject();
    const dichVuData = {
      ...dichVuObj,
      id: dichVuObj._id?.toString() || '',
    };

    res.json({
      success: true,
      data: { dichVu: dichVuData },
    });
  } catch (error) {
    next(error);
  }
};

export const createDichVu = async (
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
      next(createError('Bạn cần xác thực tài khoản (KYC) trước khi đăng ký dịch vụ. Vui lòng vào trang xác thực để hoàn tất.', 403));
      return;
    }

    const hinhAnh = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.path)
      : [];

    const dichVu: any = await DichVu.create({
      ...req.body,
      hinhAnh,
      idNguoiCungCap: userId,
    });

    const dichVuObj = dichVu.toObject();
    const dichVuData = {
      ...dichVuObj,
      id: dichVuObj._id?.toString() || '',
    };

    res.status(201).json({
      success: true,
      data: { dichVu: dichVuData },
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

export const updateDichVu = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let updateData: any = { ...req.body };

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      updateData.hinhAnh = (req.files as Express.Multer.File[]).map((file) => file.path);
    }

    const dichVu: any = await DichVu.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!dichVu) {
      next(createError('Không tìm thấy dịch vụ', 404));
      return;
    }

    const dichVuObj = dichVu.toObject();
    const dichVuData = {
      ...dichVuObj,
      id: dichVuObj._id?.toString() || '',
    };

    res.json({
      success: true,
      data: { dichVu: dichVuData },
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

export const deleteDichVu = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dichVu = await DichVu.findByIdAndDelete(req.params.id);

    if (!dichVu) {
      next(createError('Không tìm thấy dịch vụ', 404));
      return;
    }

    res.json({
      success: true,
      message: 'Xóa dịch vụ thành công',
    });
  } catch (error) {
    next(error);
  }
};

