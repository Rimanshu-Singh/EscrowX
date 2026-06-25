import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { EscrowUpdate } from '../models/EscrowUpdate';
import { Escrow } from '../models/Escrow';
import { User } from '../models/User';
import { emitToUser } from '../sockets/chatSocket';
import { hasContactInfo } from '../utils/contactBlocker';

// Freelancer posts progress update on active escrow
export async function postEscrowUpdate(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params; // Escrow ID
    const { title, description, attachments } = req.body;
    const freelancerId = req.user?.userId;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Security/Anti-communication sharing check
    if (hasContactInfo(title) || hasContactInfo(description)) {
      return res.status(400).json({
        error: 'External communication is not allowed. Please remove email addresses, phone numbers, or messaging links (WhatsApp, Telegram, Discord) to protect platform integrity.'
      });
    }

    const escrow = await Escrow.findById(id).populate('job');
    if (!escrow) {
      return res.status(404).json({ error: 'Escrow not found' });
    }

    // Verify freelancer is assigned
    if (escrow.freelancer.toString() !== freelancerId) {
      return res.status(403).json({ error: 'Access denied. You are not the assigned freelancer.' });
    }

    // Calculate update number
    const updateCount = await EscrowUpdate.countDocuments({ escrow: id });
    const updateNumber = updateCount + 1;

    const escrowUpdate = new EscrowUpdate({
      escrow: id,
      author: freelancerId,
      updateNumber,
      title,
      description,
      attachments: attachments || [],
      status: 'pending'
    });
    await escrowUpdate.save();

    // If update is marked as a final submission or client review is needed
    // we can transition escrow state to 'IN_PROGRESS' or 'UNDER_REVIEW' if needed
    if (escrow.status === 'FUNDED') {
      escrow.status = 'IN_PROGRESS';
      await escrow.save();
    }

    // Notify client
    const clientUser = await User.findById(escrow.client);
    if (clientUser) {
      emitToUser(clientUser.walletAddress, 'notification', {
        title: `Progress Update #${updateNumber} posted`,
        message: `Freelancer posted update: "${title}" for review.`,
        link: `/freelancer/escrow/${escrow._id}`
      });
    }

    return res.status(201).json(escrowUpdate);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Fetch all updates for an escrow
export async function getEscrowUpdates(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params; // Escrow ID
    const userId = req.user?.userId;

    const escrow = await Escrow.findById(id);
    if (!escrow) {
      return res.status(404).json({ error: 'Escrow not found' });
    }

    // Verify user is client, freelancer, or arbitrator
    if (
      escrow.client.toString() !== userId &&
      escrow.freelancer.toString() !== userId &&
      escrow.arbitrator.toString() !== userId
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates = await EscrowUpdate.find({ escrow: id })
      .populate('author', 'name walletAddress')
      .sort({ updateNumber: 1 });

    return res.json(updates);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Client reviews progress update
export async function reviewEscrowUpdate(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params; // Update ID
    const { action, notes } = req.body; // action: 'approve' | 'revise'
    const clientId = req.user?.userId;

    if (!['approve', 'revise'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be approve or revise' });
    }

    const update = await EscrowUpdate.findById(id).populate('escrow');
    if (!update) {
      return res.status(404).json({ error: 'Progress update not found' });
    }

    const escrow = await Escrow.findById(update.escrow).populate('job');
    if (!escrow) {
      return res.status(404).json({ error: 'Associated escrow not found' });
    }

    // Verify client is owner of the escrow
    if (escrow.client.toString() !== clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (action === 'approve') {
      update.status = 'approved';
    } else {
      update.status = 'revision_requested';
      update.revisionNotes = notes || 'Changes requested by client';
    }
    await update.save();

    // Notify freelancer
    const freelancerUser = await User.findById(escrow.freelancer);
    if (freelancerUser) {
      emitToUser(freelancerUser.walletAddress, 'notification', {
        title: action === 'approve' ? 'Update Approved! 🌟' : 'Revision Requested ⚠️',
        message: action === 'approve'
          ? `Client approved update #${update.updateNumber}: "${update.title}".`
          : `Client requested changes on update #${update.updateNumber}: "${update.title}".`,
        link: `/freelancer/escrow/${escrow._id}`
      });
    }

    return res.json(update);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
