import express from 'express';
import {
  xacNhanThanhToanCoc,
  xacNhanGiaoDichThanhCong,
  baoCaoXeSaiMoTa,
  khachHangHuyVoLyDo,
  xuLyTranhChap,
} from '../controllers/escrowController';
import { protect, authorize } from '../middleware/auth';
import { uploadMultiple } from '../middleware/upload';

const router = express.Router();

// Customer routes
router.post('/:id/xac-nhan-thanh-cong', protect, xacNhanGiaoDichThanhCong);
router.post('/:id/bao-cao-xe-sai', protect, uploadMultiple, baoCaoXeSaiMoTa);
router.post('/:id/huy-vo-ly-do', protect, uploadMultiple, khachHangHuyVoLyDo);

// Admin routes
router.post('/:id/xac-nhan-coc', protect, authorize('admin'), xacNhanThanhToanCoc);
router.post('/:id/xu-ly-tranh-chap', protect, authorize('admin'), xuLyTranhChap);

export default router;

