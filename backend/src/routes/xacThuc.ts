import express from 'express';
import {
  uploadXacThuc,
  getMyXacThuc,
  getAllPending,
  approveXacThuc,
  rejectXacThuc,
} from '../controllers/xacThucController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { uploadMultiple } from '../middleware/upload';

const router = express.Router();

// Upload xác thực
router.post('/', authenticate, uploadMultiple, uploadXacThuc);

// Lấy trạng thái xác thực của tôi
router.get('/my-status', authenticate, getMyXacThuc);

// Admin: Lấy danh sách chờ duyệt
router.get('/pending', authenticate, requireAdmin, getAllPending);

// Admin: Duyệt
router.put('/:id/approve', authenticate, requireAdmin, approveXacThuc);

// Admin: Từ chối
router.put('/:id/reject', authenticate, requireAdmin, rejectXacThuc);

export default router;

