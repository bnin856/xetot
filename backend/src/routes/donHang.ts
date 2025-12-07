import express from 'express';
import {
  createDonHang,
  getDonHangByUser,
  getDonHangById,
  getAllDonHang,
  updateTrangThaiDonHang,
  uploadBienLai,
  nguoiBanXacNhanGiaoXe,
  khachXacNhanNhanXe,
} from '../controllers/donHangController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';

const router = express.Router();

router.post('/', authenticate, createDonHang);
router.get('/my-orders', authenticate, getDonHangByUser);
router.get('/all', authenticate, requireAdmin, getAllDonHang);
router.get('/:id', authenticate, getDonHangById);
router.put('/:id/trang-thai', authenticate, requireAdmin, updateTrangThaiDonHang);

// Chuyển khoản online - Escrow
router.post('/:id/upload-bien-lai', authenticate, uploadSingle, uploadBienLai);
router.post('/:id/nguoi-ban-xac-nhan', authenticate, nguoiBanXacNhanGiaoXe);
router.post('/:id/khach-xac-nhan', authenticate, khachXacNhanNhanXe);

export default router;

