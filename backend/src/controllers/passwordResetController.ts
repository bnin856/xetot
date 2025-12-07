import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import PasswordReset from '../models/PasswordReset';
import { createError } from '../middleware/errorHandler';
import { sendPasswordResetEmail } from '../services/emailService';
import { sendPasswordResetSMS } from '../services/smsService';

// Generate 6-digit code
const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request password reset
export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { identifier, method } = req.body; // identifier có thể là email hoặc sdt

    if (!identifier || !method) {
      next(createError('Vui lòng nhập email/số điện thoại và chọn phương thức', 400));
      return;
    }

    if (!['email', 'sms'].includes(method)) {
      next(createError('Phương thức không hợp lệ', 400));
      return;
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { sdt: identifier }],
    });

    if (!user) {
      next(createError('Không tìm thấy tài khoản', 404));
      return;
    }

    // Check method matches user data
    if (method === 'email' && user.email !== identifier) {
      next(createError('Email không khớp với tài khoản', 400));
      return;
    }

    if (method === 'sms' && user.sdt !== identifier) {
      next(createError('Số điện thoại không khớp với tài khoản', 400));
      return;
    }

    // Delete old reset codes
    await PasswordReset.deleteMany({ userId: user._id });

    // Generate new code
    const code = generateCode();

    // Save reset code
    await PasswordReset.create({
      userId: user._id,
      code,
      method,
    });

    // Send code via email or SMS
    if (method === 'email') {
      await sendPasswordResetEmail(user.email, code, user.ten);
    } else {
      await sendPasswordResetSMS(user.sdt, code, user.ten);
    }

    res.json({
      success: true,
      message: method === 'email' 
        ? 'Mã xác thực đã được gửi đến email của bạn' 
        : 'Mã xác thực đã được gửi đến số điện thoại của bạn',
      data: {
        method,
        // Ẩn một phần thông tin
        sentTo: method === 'email' 
          ? user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
          : user.sdt.replace(/(\d{3})(\d{4})(\d{3})/, '$1****$3'),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify reset code
export const verifyResetCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { identifier, code, method } = req.body;

    if (!identifier || !code || !method) {
      next(createError('Thiếu thông tin xác thực', 400));
      return;
    }

    // Find user
    const user = await User.findOne({
      $or: [{ email: identifier }, { sdt: identifier }],
    });

    if (!user) {
      next(createError('Không tìm thấy tài khoản', 404));
      return;
    }

    // Find reset code
    const resetRecord = await PasswordReset.findOne({
      userId: user._id,
      code,
      method,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      next(createError('Mã xác thực không hợp lệ hoặc đã hết hạn', 400));
      return;
    }

    res.json({
      success: true,
      message: 'Mã xác thực hợp lệ',
      data: {
        resetId: resetRecord._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { identifier, code, newPassword } = req.body;

    if (!identifier || !code || !newPassword) {
      next(createError('Thiếu thông tin', 400));
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      next(createError('Mật khẩu phải có ít nhất 8 ký tự', 400));
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      next(createError('Mật khẩu phải có ít nhất 1 chữ hoa', 400));
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      next(createError('Mật khẩu phải có ít nhất 1 chữ thường', 400));
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      next(createError('Mật khẩu phải có ít nhất 1 số', 400));
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      next(createError('Mật khẩu phải có ít nhất 1 ký tự đặc biệt', 400));
      return;
    }

    // Find user
    const user = await User.findOne({
      $or: [{ email: identifier }, { sdt: identifier }],
    });

    if (!user) {
      next(createError('Không tìm thấy tài khoản', 404));
      return;
    }

    // Find and verify reset code
    const resetRecord = await PasswordReset.findOne({
      userId: user._id,
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      next(createError('Mã xác thực không hợp lệ hoặc đã hết hạn', 400));
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Mark reset code as used
    resetRecord.isUsed = true;
    await resetRecord.save();

    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công',
    });
  } catch (error) {
    next(error);
  }
};

