import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ListingApplication } from '../models/ListingApplication';
import { Listing } from '../models/Listing';
import { User } from '../models/User';
import { emitToUser } from '../sockets/chatSocket';
import { hasContactInfo } from '../utils/contactBlocker';

// Freelancer applies to a client project listing
export async function applyToListing(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params; // listing ID
    const { coverLetter, portfolioUrl, expectedDeliveryTime, bidAmount, previousExperience } = req.body;
    const freelancerId = req.user?.userId;

    if (!coverLetter || !expectedDeliveryTime || !bidAmount) {
      return res.status(400).json({ error: 'Cover letter, expected delivery time, and bid amount are required' });
    }

    // Security/Anti-communication sharing check
    if (hasContactInfo(coverLetter) || hasContactInfo(portfolioUrl) || hasContactInfo(previousExperience)) {
      return res.status(400).json({
        error: 'External communication is not allowed. Please remove email addresses, phone numbers, or messaging links (WhatsApp, Telegram, Discord) to protect platform integrity.'
      });
    }

    // Check if listing exists and is of type PROJECT
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: 'Project listing not found' });
    }

    if (listing.type !== 'PROJECT') {
      return res.status(400).json({ error: 'You can only submit applications to project listings' });
    }

    // Check if freelancer already applied
    const existingApp = await ListingApplication.findOne({ listing: id, freelancer: freelancerId });
    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied to this project listing' });
    }

    const application = new ListingApplication({
      listing: id,
      freelancer: freelancerId,
      coverLetter,
      portfolioUrl,
      expectedDeliveryTime,
      bidAmount,
      previousExperience,
      status: 'PENDING'
    });
    await application.save();

    // Notify listing creator (Client)
    const clientUser = await User.findById(listing.createdBy);
    if (clientUser) {
      emitToUser(clientUser.walletAddress, 'notification', {
        title: 'New Application Received',
        message: `A freelancer has applied to your project "${listing.title}" with a bid of ${bidAmount} XLM.`,
        link: `/listing/${listing._id}`
      });
    }

    return res.status(201).json(application);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Freelancer retrieves all their own applications
export async function getMyApplications(req: AuthRequest, res: Response) {
  try {
    const freelancerId = req.user?.userId;
    const applications = await ListingApplication.find({ freelancer: freelancerId })
      .populate({
        path: 'listing',
        populate: { path: 'createdBy', select: 'name walletAddress trustScore badge' }
      })
      .sort({ createdAt: -1 });

    return res.json(applications);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Client retrieves all applications for a specific listing they own
export async function getListingApplications(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params; // listing ID
    const clientId = req.user?.userId;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Verify requesting user is the listing owner
    if (listing.createdBy.toString() !== clientId) {
      return res.status(403).json({ error: 'Access denied. You do not own this listing.' });
    }

    const applications = await ListingApplication.find({ listing: id })
      .populate('freelancer', 'name walletAddress trustScore badge avatar')
      .sort({ createdAt: -1 });

    return res.json(applications);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Client reviews (accepts/rejects) an application
export async function reviewApplication(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params; // application ID
    const { status } = req.body; // 'ACCEPTED' | 'REJECTED'
    const clientId = req.user?.userId;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid application status update. Must be ACCEPTED or REJECTED' });
    }

    const application = await ListingApplication.findById(id).populate('listing');
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const listing = await Listing.findById(application.listing);
    if (!listing) {
      return res.status(404).json({ error: 'Associated project listing not found' });
    }

    // Verify client is owner of the listing
    if (listing.createdBy.toString() !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    application.status = status;
    await application.save();

    // If accepted, update other pending applications for this listing to REJECTED
    if (status === 'ACCEPTED') {
      await ListingApplication.updateMany(
        { listing: listing._id, _id: { $ne: application._id }, status: 'PENDING' },
        { status: 'REJECTED' }
      );
      
      // Update listing status if needed
      listing.status = 'completed'; // or keep active
      await listing.save();
    }

    // Notify freelancer
    const freelancerUser = await User.findById(application.freelancer);
    if (freelancerUser) {
      emitToUser(freelancerUser.walletAddress, 'notification', {
        title: status === 'ACCEPTED' ? 'Application Accepted! 🎉' : 'Application Rejected',
        message: status === 'ACCEPTED' 
          ? `Your application for "${listing.title}" has been accepted! The client will fund the escrow shortly.`
          : `Your application for "${listing.title}" has been rejected.`,
        link: status === 'ACCEPTED' ? `/freelancer/applications` : `/marketplace`
      });
    }

    return res.json(application);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Freelancer withdraws pending application
export async function withdrawApplication(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params; // application ID
    const freelancerId = req.user?.userId;

    const application = await ListingApplication.findById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.freelancer.toString() !== freelancerId) {
      return res.status(403).json({ error: 'Access denied. You do not own this application.' });
    }

    if (application.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only pending applications can be withdrawn' });
    }

    await ListingApplication.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Application withdrawn successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
