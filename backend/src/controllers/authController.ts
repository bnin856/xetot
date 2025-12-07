import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { createError } from '../middleware/errorHandler';
import { authLimiter } from '../middleware/rateLimiter';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { ten, email, password, sdt, diaChi } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      next(createError('Email đã được sử dụng', 400));
      return;
    }

    // Create user
    const user = await User.create({
      ten,
      email,
      password,
      sdt,
      diaChi,
      vaiTro: 'customer',
    });

    // Generate token
    const token = generateToken(user._id.toString(), user.vaiTro);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          ten: user.ten,
          email: user.email,
          sdt: user.sdt,
          diaChi: user.diaChi,
          vaiTro: user.vaiTro,
        },
        token,
      },
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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      next(createError('Vui lòng nhập email và mật khẩu', 400));
      return;
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      next(createError('Email hoặc mật khẩu không đúng', 401));
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.vaiTro);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          ten: user.ten,
          email: user.email,
          sdt: user.sdt,
          diaChi: user.diaChi,
          vaiTro: user.vaiTro,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      next(createError('Không tìm thấy người dùng', 404));
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          ten: user.ten,
          email: user.email,
          sdt: user.sdt,
          diaChi: user.diaChi,
          vaiTro: user.vaiTro,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

