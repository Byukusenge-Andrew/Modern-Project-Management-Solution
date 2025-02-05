import express from 'express';
import { protect } from '../middleware/auth';
import {
  sendMessage,
  getTeamMessages,
  markMessagesAsRead,
  getUnreadCount,
} from '../controllers/chatController';

const router = express.Router();
router.use(protect);
router.post('/teams/:teamId/messages', sendMessage);
router.get('/teams/:teamId/messages', getTeamMessages);
router.post('/teams/:teamId/messages/read', markMessagesAsRead);
router.get('/teams/:teamId/messages/unread', getUnreadCount);

export default router; 