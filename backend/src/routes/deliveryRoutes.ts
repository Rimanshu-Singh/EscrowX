import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth';
import {
  initiateDelivery,
  getDelivery,
  submitDelivery,
  approveDelivery,
  rejectDelivery,
  addComment,
  getDeliveries
} from '../controllers/deliveryController';

const router = Router();

// Get all deliveries for current user
router.get('/', verifyToken, getDeliveries);

// Initiate delivery record (Internal / Contract Start)
router.post('/initiate', verifyToken, initiateDelivery);

// Get single delivery detail
router.get('/:id', verifyToken, getDelivery);

// Submit deliverables (Freelancer only)
router.post('/:id/submit', verifyToken, requireRole(['FREELANCER']), submitDelivery);

// Client review actions
router.put('/:id/approve', verifyToken, requireRole(['CLIENT']), approveDelivery);
router.put('/:id/reject', verifyToken, requireRole(['CLIENT']), rejectDelivery);

// Comment system
router.post('/:id/comments', verifyToken, addComment);

export default router;
