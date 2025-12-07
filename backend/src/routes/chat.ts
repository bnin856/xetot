import express from 'express';
import {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
} from '../controllers/chatController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Tạo hoặc lấy conversation
router.post('/conversation', authenticate, getOrCreateConversation);

// Lấy danh sách conversations
router.get('/conversations', authenticate, getMyConversations);

// Lấy messages của một conversation
router.get('/conversation/:id/messages', authenticate, getMessages);

export default router;

