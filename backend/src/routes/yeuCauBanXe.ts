import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import YeuCauBanXe from '../models/YeuCauBanXe';
import Xe from '../models/Xe';
import { createError } from '../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const yeuCau = await YeuCauBanXe.create({
      ...req.body,
      idKhachHang: req.user!.id,
    });

    res.status(201).json({
      success: true,
      data: { yeuCau },
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

router.get('/my-requests', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const yeuCau = await YeuCauBanXe.find({ idKhachHang: req.user!.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: { yeuCau },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/all', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const yeuCau = await YeuCauBanXe.find()
      .populate('idKhachHang', 'ten email sdt')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: { yeuCau },
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/duyet', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const yeuCau = await YeuCauBanXe.findById(req.params.id);
    if (!yeuCau) {
      next(createError('Không tìm thấy yêu cầu', 404));
      return;
    }

    yeuCau.trangThai = 'daDuyet';
    await yeuCau.save();

    // Create Xe from request
    const xe = await Xe.create({
      tenXe: yeuCau.tenXe,
      hangXe: yeuCau.hangXe,
      namSanXuat: yeuCau.namSanXuat,
      soKm: yeuCau.soKm,
      mauSac: yeuCau.mauSac,
      gia: yeuCau.giaYeuCau,
      soCho: 5, // Default
      loaiXe: 'sedan', // Default
      trangThai: 'dangBan',
      moTa: yeuCau.moTa || '',
      hinhAnh: [],
      idChuXe: yeuCau.idKhachHang,
      hoaHong: yeuCau.hoaHong,
    });

    res.json({
      success: true,
      data: { xe, yeuCau },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

