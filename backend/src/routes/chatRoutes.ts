import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken } from '../middleware/auth';
import {
  getChatContacts,
  getMessages,
  sendAttachment,
  getConversations,
  getOrCreateConversation,
  getMessagesByConversation
} from '../controllers/chatController';

const router = Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/contacts', verifyToken, getChatContacts);
router.get('/messages/:counterpartyId', verifyToken, getMessages);
router.post('/attachment', verifyToken, upload.single('file'), sendAttachment);

// Conversation thread endpoints
router.get('/conversations', verifyToken, getConversations);
router.post('/conversations', verifyToken, getOrCreateConversation);
router.get('/conversations/:conversationId/messages', verifyToken, getMessagesByConversation);

export default router;
