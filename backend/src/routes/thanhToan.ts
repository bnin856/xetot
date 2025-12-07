import express from 'express';
import { authenticate } from '../middleware/auth';
import ThanhToan from '../models/ThanhToan';
import DonHang from '../models/DonHang';
import { createError } from '../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { idDonHang, phuongThuc, maGiaoDich } = req.body;

    const donHang = await DonHang.findById(idDonHang);
    if (!donHang) {
      next(createError('Không tìm thấy đơn hàng', 404));
      return;
    }

    if (donHang.idKhachHang.toString() !== req.user!.id) {
      next(createError('Không có quyền truy cập', 403));
      return;
    }

    const thanhToan = await ThanhToan.create({
      idDonHang,
      soTien: donHang.tongTien,
      phuongThuc,
      maGiaoDich,
    });

    res.status(201).json({
      success: true,
      data: { thanhToan },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/my-payments', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const donHang = await DonHang.find({ idKhachHang: req.user!.id });
    const donHangIds = donHang.map(dh => dh._id);

    const thanhToan = await ThanhToan.find({ idDonHang: { $in: donHangIds } })
      .populate('idDonHang')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { thanhToan },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

