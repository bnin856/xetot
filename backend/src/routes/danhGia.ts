import express from 'express';
import { authenticate } from '../middleware/auth';
import DanhGia from '../models/DanhGia';
import { createError } from '../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { idXe, diem, noiDung } = req.body;

    const danhGia = await DanhGia.create({
      idKhachHang: req.user!.id,
      idXe,
      diem,
      noiDung,
    });

    res.status(201).json({
      success: true,
      data: { danhGia },
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

router.get('/xe/:idXe', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const danhGia = await DanhGia.find({ idXe: req.params.idXe })
      .populate('idKhachHang', 'ten')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { danhGia },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

