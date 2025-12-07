import express from 'express';
import {
  getMyWallet,
  napTien,
  rutTien,
  getLichSuGiaoDich,
  xuLyRutTien,
} from '../controllers/walletController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Customer routes
router.get('/my-wallet', protect, getMyWallet);
router.post('/nap-tien', protect, napTien);
router.post('/rut-tien', protect, rutTien);
router.get('/lich-su', protect, getLichSuGiaoDich);

// Admin routes
router.put('/rut-tien/:id', protect, authorize('admin'), xuLyRutTien);

export default router;

