import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import {
  getProfileDetails,
  updateProfileDetails,
  getPublicProfileByUsername
} from '../controllers/profileController';

const router = Router();

// Logged-in user settings endpoints
router.get('/me', verifyToken, getProfileDetails);
router.put('/me', verifyToken, updateProfileDetails);

// Public profile endpoint
router.get('/user/:username', getPublicProfileByUsername);

export default router;
