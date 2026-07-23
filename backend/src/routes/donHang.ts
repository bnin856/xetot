import express from 'express';
import {
  createDonHang,
  getDonHangByUser,
  getDonHangById,
  getAllDonHang,
  getDonHangNguoiBan,
  nguoiBanXacNhanDonHang,
  nguoiBanTuChoiDonHang,
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
router.get('/nguoi-ban', authenticate, getDonHangNguoiBan);
router.get('/all', authenticate, requireAdmin, getAllDonHang);
router.get('/:id', authenticate, getDonHangById);
router.put('/:id/trang-thai', authenticate, requireAdmin, updateTrangThaiDonHang);

// Người bán xác nhận / từ chối đơn hàng mới
router.post('/:id/xac-nhan-don-hang', authenticate, nguoiBanXacNhanDonHang);
router.post('/:id/tu-choi-don-hang', authenticate, nguoiBanTuChoiDonHang);

// Chuyển khoản online - Escrow
router.post('/:id/upload-bien-lai', authenticate, uploadSingle, uploadBienLai);
router.post('/:id/nguoi-ban-xac-nhan', authenticate, nguoiBanXacNhanGiaoXe);
router.post('/:id/khach-xac-nhan', authenticate, khachXacNhanNhanXe);

export default router;

