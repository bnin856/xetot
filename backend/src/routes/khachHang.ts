import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import User from '../models/User';
import { createError } from '../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10', search } = req.query;
    const query: any = { vaiTro: 'customer' };
    
    if (search) {
      query.$or = [
        { ten: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [khachHang, total] = await Promise.all([
      User.find(query).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        khachHang,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      next(createError('Không tìm thấy khách hàng', 404));
      return;
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
});

export default router;

