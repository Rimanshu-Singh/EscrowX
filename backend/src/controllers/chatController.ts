import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Message } from '../models/Message';
import { Conversation } from '../models/Conversation';
import { User } from '../models/User';

// Get all conversations for the user
export async function getConversations(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate('participants', 'name walletAddress role avatar trustScore badge')
      .populate('listing', 'title type role price budget coverImage')
      .sort({ lastMessageAt: -1 });

    return res.json(conversations);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Start or retrieve a conversation
export async function getOrCreateConversation(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const { participantId, listingId } = req.body;

    if (!participantId) {
      return res.status(400).json({ error: 'Participant ID is required' });
    }

    // Check if conversation already exists between these users for the given listing
    let query: any = {
      participants: { $all: [userId, participantId] }
    };
    if (listingId) {
      query.listing = listingId;
    }

    let conversation = await Conversation.findOne(query);

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [userId, participantId],
        listing: listingId || undefined,
        lastMessage: '',
        lastMessageAt: new Date()
      });
      await conversation.save();
    }

    // Populate and return
    const populatedConv = await Conversation.findById(conversation._id)
      .populate('participants', 'name walletAddress role avatar trustScore badge')
      .populate('listing', 'title type role price budget coverImage');

    return res.status(201).json(populatedConv);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Get messages in a specific conversation
export async function getMessagesByConversation(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { conversationId, recipient: userId, readAt: { $exists: false } },
      { readAt: new Date() }
    );

    return res.json(messages);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Legacy API: Get lists of all users we have conversed with (Active chat contacts)
export async function getChatContacts(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;

    const sentTo = await Message.distinct('recipient', { sender: userId });
    const receivedFrom = await Message.distinct('sender', { recipient: userId });

    const contactIds = Array.from(new Set([...sentTo.map(id => id.toString()), ...receivedFrom.map(id => id.toString())]));
    
    const contacts = await User.find({ _id: { $in: contactIds } })
      .select('name walletAddress role avatar trustScore badge');

    return res.json(contacts);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Legacy API: Get message history with a specific counterparty
export async function getMessages(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const { counterpartyId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: counterpartyId },
        { sender: counterpartyId, recipient: userId }
      ]
    }).sort({ createdAt: 1 });

    // Mark received messages as read
    await Message.updateMany(
      { sender: counterpartyId, recipient: userId, readAt: { $exists: false } },
      { readAt: new Date() }
    );

    return res.json(messages);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Upload file/attachment API handler
export async function sendAttachment(req: AuthRequest, res: Response) {
  try {
    const senderId = req.user?.userId;
    const { recipientId, content, attachmentType, conversationId } = req.body;
    const file = req.file;

    if (!recipientId || !file) {
      return res.status(400).json({ error: 'Recipient and file attachment are required' });
    }

    const attachmentUrl = `/uploads/${file.filename}`;

    // Get or create conversation if conversationId is not provided
    let actualConvId = conversationId;
    if (!actualConvId) {
      let conv = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] }
      });
      if (!conv) {
        conv = new Conversation({
          participants: [senderId, recipientId],
          lastMessage: content || 'Sent an attachment',
          lastMessageAt: new Date()
        });
        await conv.save();
      } else {
        conv.lastMessage = content || 'Sent an attachment';
        conv.lastMessageAt = new Date();
        await conv.save();
      }
      actualConvId = conv._id;
    } else {
      await Conversation.findByIdAndUpdate(actualConvId, {
        lastMessage: content || 'Sent an attachment',
        lastMessageAt: new Date()
      });
    }

    const message = new Message({
      conversationId: actualConvId,
      sender: senderId,
      recipient: recipientId,
      content: content || `Sent an attachment`,
      attachmentUrl,
      attachmentType: attachmentType || 'file',
    });
    await message.save();

    return res.status(201).json(message);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
