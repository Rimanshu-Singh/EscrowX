import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import {
  createListing,
  getListings,
  getMyListings,
  getListingDetails,
  updateListing,
  deleteListing,
} from '../controllers/listingController';

const router = Router();

// Get listings created by the logged-in user
router.get('/my', verifyToken, getMyListings);

// Get all listings with search, filter, and pagination
router.get('/', verifyToken, getListings);

// Get details of a single listing
router.get('/:id', verifyToken, getListingDetails);

// Create a new listing
router.post('/', verifyToken, createListing);

// Update a listing
router.put('/:id', verifyToken, updateListing);

// Delete a listing
router.delete('/:id', verifyToken, deleteListing);

export default router;
