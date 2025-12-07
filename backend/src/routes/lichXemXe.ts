import express from 'express';
import {
  datLichXemXe,
  getMySchedules,
  approveLich,
  cancelLich,
  completeLich,
} from '../controllers/lichXemXeController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Đặt lịch xem xe
router.post('/', authenticate, datLichXemXe);

// Lấy danh sách lịch xem xe
router.get('/my-schedules', authenticate, getMySchedules);

// Duyệt lịch (người bán)
router.put('/:id/approve', authenticate, approveLich);

// Hủy lịch
router.put('/:id/cancel', authenticate, cancelLich);

// Hoàn thành (người bán)
router.put('/:id/complete', authenticate, completeLich);

export default router;

