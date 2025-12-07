import express from 'express';
import {
  datLich,
  getMySchedules,
  approve,
  cancel,
  complete,
} from '../controllers/lichDatDichVuController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Đặt lịch dịch vụ
router.post('/', authenticate, datLich);

// Lấy lịch đặt của user
router.get('/my-schedules', authenticate, getMySchedules);

// Duyệt lịch (người cung cấp)
router.patch('/:id/approve', authenticate, approve);

// Hủy lịch
router.patch('/:id/cancel', authenticate, cancel);

// Đánh dấu hoàn thành (người cung cấp)
router.patch('/:id/complete', authenticate, complete);

export default router;

