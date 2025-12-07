import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import KhuyenMai from '../models/KhuyenMai';
import { createError } from '../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const khuyenMai = await KhuyenMai.find({
      trangThai: 'dangHoatDong',
      ngayBatDau: { $lte: new Date() },
      ngayKetThuc: { $gte: new Date() },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { khuyenMai },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const khuyenMai = await KhuyenMai.create(req.body);
    res.status(201).json({
      success: true,
      data: { khuyenMai },
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

export default router;

