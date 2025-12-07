import express from 'express';
import {
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
} from '../controllers/passwordResetController';

const router = express.Router();

router.post('/request', requestPasswordReset);
router.post('/verify', verifyResetCode);
router.post('/reset', resetPassword);

export default router;

