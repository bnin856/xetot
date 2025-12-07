import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    vaiTro: 'admin' | 'customer';
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw createError('Không có token xác thực', 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as { id: string; vaiTro: 'admin' | 'customer' };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError('Token không hợp lệ', 401));
    } else {
      next(error);
    }
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    next(createError('Cần đăng nhập', 401));
    return;
  }

  if (req.user.vaiTro !== 'admin') {
    next(createError('Chỉ admin mới có quyền truy cập', 403));
    return;
  }

  next();
};

// Aliases for convenience
export const protect = authenticate;
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(createError('Cần đăng nhập', 401));
      return;
    }

    if (!roles.includes(req.user.vaiTro)) {
      next(createError('Bạn không có quyền truy cập', 403));
      return;
    }

    next();
  };
};

