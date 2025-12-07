import express from 'express';
import {
  getAllDichVu,
  getDichVuById,
  createDichVu,
  updateDichVu,
  deleteDichVu,
} from '../controllers/dichVuController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { uploadMultiple } from '../middleware/upload';

const router = express.Router();

router.get('/', getAllDichVu);
router.get('/:id', getDichVuById);
router.post('/', authenticate, uploadMultiple, createDichVu);
router.put('/:id', authenticate, uploadMultiple, updateDichVu);
router.delete('/:id', authenticate, deleteDichVu);

export default router;

