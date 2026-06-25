import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth';
import {
  applyToProject,
  getReceivedProposals,
  getSentProposals,
  acceptProposal,
  rejectProposal,
  withdrawProposal
} from '../controllers/proposalController';

const router = Router();

// Freelancer submitting application to Project
router.post('/apply/:id', verifyToken, requireRole(['FREELANCER']), applyToProject);

// Retrieve proposals lists
router.get('/received', verifyToken, requireRole(['CLIENT']), getReceivedProposals);
router.get('/sent', verifyToken, requireRole(['FREELANCER']), getSentProposals);

// Client review actions
router.put('/:id/accept', verifyToken, requireRole(['CLIENT']), acceptProposal);
router.put('/:id/reject', verifyToken, requireRole(['CLIENT']), rejectProposal);

// Freelancer withdraw action
router.delete('/:id/withdraw', verifyToken, requireRole(['FREELANCER']), withdrawProposal);

export default router;
