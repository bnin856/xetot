import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import Xe from '../models/Xe';
import DonHang from '../models/DonHang';
import ThanhToan from '../models/ThanhToan';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/tong-quan', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [tongXe, tongDonHang, tongKhachHang, tongDoanhThu] = await Promise.all([
      Xe.countDocuments(),
      DonHang.countDocuments(),
      User.countDocuments({ vaiTro: 'customer' }),
      ThanhToan.aggregate([
        { $match: { trangThai: 'daThanhToan' } },
        { $group: { _id: null, total: { $sum: '$soTien' } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        tongXe,
        tongDonHang,
        tongKhachHang,
        tongDoanhThu: tongDoanhThu[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

