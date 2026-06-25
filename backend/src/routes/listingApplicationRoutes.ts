import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth';
import {
  applyToListing,
  getMyApplications,
  getListingApplications,
  reviewApplication,
  withdrawApplication
} from '../controllers/listingApplicationController';

const router = Router();

// Freelancer applications list
router.get('/my', verifyToken, requireRole(['FREELANCER']), getMyApplications);

// Listing specific applications (Client reads, Freelancer creates)
router.get('/listing/:id', verifyToken, requireRole(['CLIENT']), getListingApplications);
router.post('/listing/:id', verifyToken, requireRole(['FREELANCER']), applyToListing);

// Client reviews proposal
router.put('/:id/review', verifyToken, requireRole(['CLIENT']), reviewApplication);

// Freelancer withdraws proposal
router.delete('/:id/withdraw', verifyToken, requireRole(['FREELANCER']), withdrawApplication);

export default router;
