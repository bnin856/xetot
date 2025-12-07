import express from 'express';
import {
  getAllXeChoThue,
  getXeChoThueById,
  createXeChoThue,
  updateXeChoThue,
  deleteXeChoThue,
} from '../controllers/xeChoThueController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { uploadMultiple } from '../middleware/upload';

const router = express.Router();

router.get('/', getAllXeChoThue);
router.get('/:id', getXeChoThueById);
router.post('/', authenticate, uploadMultiple, createXeChoThue);
router.put('/:id', authenticate, uploadMultiple, updateXeChoThue);
router.delete('/:id', authenticate, deleteXeChoThue);

export default router;

