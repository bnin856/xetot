import express from 'express';
import {
  getAllXe,
  getXeById,
  createXe,
  updateXe,
  deleteXe,
} from '../controllers/xeController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { uploadMultiple } from '../middleware/upload';

const router = express.Router();

router.get('/', getAllXe);
router.get('/:id', getXeById);
router.post('/', authenticate, uploadMultiple, createXe);
router.put('/:id', authenticate, uploadMultiple, updateXe);
router.delete('/:id', authenticate, deleteXe);

export default router;

