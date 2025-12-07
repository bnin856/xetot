import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import ThongBao from '../models/ThongBao';
import { createError } from '../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/my-notifications', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const thongBao = await ThongBao.find({
      $or: [
        { idNguoiNhan: req.user!.id },
        { idNguoiNhan: null }, // System notifications
      ],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { thongBao },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const thongBao = await ThongBao.create(req.body);
    res.status(201).json({
      success: true,
      data: { thongBao },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

