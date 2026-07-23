import express from 'express';
import {
  getAllDonThueXe,
  getDonThueXeById,
  getDonThueXeByUserId,
  getDonThueXeNguoiChoThue,
  createDonThueXe,
  updateTrangThaiDonThueXe,
  huyDonThueXe,
  deleteDonThueXe,
} from '../controllers/donThueXeController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, createDonThueXe);
router.get('/user', authenticate, getDonThueXeByUserId);
router.get('/nguoi-cho-thue', authenticate, getDonThueXeNguoiChoThue);
router.get('/:id', authenticate, getDonThueXeById);
router.patch('/:id/trang-thai', authenticate, authorize('admin'), updateTrangThaiDonThueXe);
router.patch('/:id/huy', authenticate, huyDonThueXe);

// Admin only routes
router.get('/', authenticate, authorize('admin'), getAllDonThueXe);
router.delete('/:id', authenticate, authorize('admin'), deleteDonThueXe);

export default router;

