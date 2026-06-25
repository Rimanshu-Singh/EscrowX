import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth';
import {
  createHireRequest,
  getMyHireRequests,
  respondToHireRequest
} from '../controllers/hireRequestController';

const router = Router();

// Create hire request (Client hires freelancer)
router.post('/', verifyToken, requireRole(['CLIENT']), createHireRequest);

// Retrieve requests for active user
router.get('/my', verifyToken, getMyHireRequests);

// Accept or Reject hire request (Freelancer responds)
router.put('/:id/respond', verifyToken, requireRole(['FREELANCER']), respondToHireRequest);

export default router;
