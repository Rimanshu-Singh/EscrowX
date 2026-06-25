import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { HireRequest } from '../models/HireRequest';
import { Listing } from '../models/Listing';
import { User } from '../models/User';
import { Delivery } from '../models/Delivery';
import { emitToUser } from '../sockets/chatSocket';
import { hasContactInfo } from '../utils/contactBlocker';

// Client sends a hire request to a freelancer service listing
export async function createHireRequest(req: AuthRequest, res: Response) {
  try {
    const { listingId, projectTitle, projectDescription, requirements, deadline, budgetAmount } = req.body;
    const clientId = req.user?.userId;

    if (!listingId || !projectTitle || !projectDescription || !requirements || !deadline || !budgetAmount) {
      return res.status(400).json({ error: 'Missing required fields for hire request' });
    }

    // Security/Anti-communication sharing check
    if (hasContactInfo(projectTitle) || hasContactInfo(projectDescription) || hasContactInfo(requirements)) {
      return res.status(400).json({
        error: 'External communication is not allowed. Please remove email addresses, phone numbers, or messaging links (WhatsApp, Telegram, Discord) to protect platform integrity.'
      });
    }

    // Fetch listing and verify type is SERVICE
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Service listing not found' });
    }

    if (listing.type !== 'SERVICE') {
      return res.status(400).json({ error: 'You can only send hire requests to service listings' });
    }

    const freelancerId = listing.createdBy;

    // Check if client is trying to hire themselves
    if (freelancerId.toString() === clientId) {
      return res.status(400).json({ error: 'You cannot hire yourself' });
    }

    const hireRequest = new HireRequest({
      listing: listingId,
      client: clientId,
      freelancer: freelancerId,
      projectTitle,
      projectDescription,
      requirements,
      deadline: new Date(deadline),
      budgetAmount,
      status: 'PENDING'
    });
    await hireRequest.save();

    // Notify Freelancer
    const freelancerUser = await User.findById(freelancerId);
    if (freelancerUser) {
      emitToUser(freelancerUser.walletAddress, 'notification', {
        title: 'New Hire Request received 💼',
        message: `A client wants to hire you for "${projectTitle}" for ${budgetAmount} XLM.`,
        link: `/freelancer/hire-requests`
      });
    }

    return res.status(201).json(hireRequest);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Get user's sent or received hire requests
export async function getMyHireRequests(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    // Freelancer gets requests sent to them; Client gets requests they sent
    const query = role === 'FREELANCER' ? { freelancer: userId } : { client: userId };

    const requests = await HireRequest.find(query)
      .populate('listing', 'title coverImage price deliveryDays')
      .populate('client', 'name walletAddress trustScore badge avatar')
      .populate('freelancer', 'name walletAddress trustScore badge avatar')
      .sort({ createdAt: -1 });

    return res.json(requests);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Freelancer responds (accepts/rejects) to a hire request
export async function respondToHireRequest(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params; // Request ID
    const { status } = req.body; // 'ACCEPTED' | 'REJECTED'
    const freelancerId = req.user?.userId;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid response status. Must be ACCEPTED or REJECTED' });
    }

    const hireRequest = await HireRequest.findById(id).populate('listing');
    if (!hireRequest) {
      return res.status(404).json({ error: 'Hire request not found' });
    }

    // Verify freelancer owner is responding
    if (hireRequest.freelancer.toString() !== freelancerId) {
      return res.status(403).json({ error: 'Access denied. You are not the freelancer assigned to this request.' });
    }

    hireRequest.status = status;
    await hireRequest.save();

    if (status === 'ACCEPTED') {
      let delivery = await Delivery.findOne({ projectId: hireRequest.listing });
      if (!delivery) {
        let deliveryId = '';
        let isUnique = false;
        while (!isUnique) {
          deliveryId = 'dlv_' + Math.floor(10000 + Math.random() * 90000);
          const existing = await Delivery.findOne({ deliveryId });
          if (!existing) {
            isUnique = true;
          }
        }

        delivery = new Delivery({
          deliveryId,
          projectId: hireRequest.listing,
          freelancerId: hireRequest.freelancer,
          clientId: hireRequest.client,
          status: 'working',
          budget: hireRequest.budgetAmount || 0,
          deadline: hireRequest.deadline,
          notes: '',
          demoLink: '',
          files: [],
          previewFiles: [],
          versions: [],
          comments: []
        });
        await delivery.save();
      }
    }

    // Notify client
    const clientUser = await User.findById(hireRequest.client);
    if (clientUser) {
      emitToUser(clientUser.walletAddress, 'notification', {
        title: status === 'ACCEPTED' ? 'Hire Request Accepted! 🎉' : 'Hire Request Declined',
        message: status === 'ACCEPTED'
          ? `Freelancer accepted your request for "${hireRequest.projectTitle}". Proceed to escrow setup and funding.`
          : `Freelancer declined your request for "${hireRequest.projectTitle}".`,
        link: status === 'ACCEPTED' ? `/client/dashboard` : `/marketplace`
      });
    }

    return res.json(hireRequest);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
