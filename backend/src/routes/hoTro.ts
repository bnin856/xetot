import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import HoTro from '../models/HoTro';
import { createError } from '../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const hoTro = await HoTro.create({
      ...req.body,
      idKhachHang: req.user!.id,
    });

    res.status(201).json({
      success: true,
      data: { hoTro },
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      next(createError(messages.join(', '), 400));
    } else {
      next(error);
    }
  }
});

router.get('/my-support', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const hoTro = await HoTro.find({ idKhachHang: req.user!.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: { hoTro },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/all', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hoTro = await HoTro.find().populate('idKhachHang', 'ten email').sort({ createdAt: -1 });
    res.json({
      success: true,
      data: { hoTro },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

