import { api } from './axiosClient';
import {
  ClientStats,
  FreelancerStats,
  AdminStats,
  Escrow,
  Activity,
  Message,
  Gig,
  Dispute,
  User,
} from '../types/dashboard.types';

export const fetchClientStats = async (): Promise<ClientStats> => {
  const escrowsRes = await api.get<any[]>('/escrows/my');
  const escrows = escrowsRes.data || [];
  return {
    totalEscrows: escrows.length,
    activeEscrows: escrows.filter(e => ['FUNDED', 'IN_PROGRESS', 'DELIVERED'].includes(e.status)).length,
    completedJobs: escrows.filter(e => e.status === 'COMPLETED').length,
    totalXlmSpent: escrows.filter(e => e.status === 'COMPLETED').reduce((s, e) => s + e.amount, 0),
  };
};

export const fetchFreelancerStats = async (): Promise<FreelancerStats> => {
  const escrowsRes = await api.get<any[]>('/escrows/my');
  const escrows = escrowsRes.data || [];
  return {
    activeOrders: escrows.filter(e => ['FUNDED', 'IN_PROGRESS', 'DELIVERED'].includes(e.status)).length,
    pendingDeliveries: escrows.filter(e => e.status === 'DELIVERED').length,
    completedOrders: escrows.filter(e => e.status === 'COMPLETED').length,
    totalXlmEarned: escrows.filter(e => e.status === 'COMPLETED').reduce((s, e) => s + e.amount, 0),
  };
};

export const fetchAdminStats = async (): Promise<AdminStats> => {
  try {
    const escrowsRes = await api.get<any[]>('/escrows/my');
    const escrows = escrowsRes.data || [];
    const disputesRes = await api.get<any[]>('/disputes');
    const disputes = disputesRes.data || [];
    return {
      totalPlatformEscrows: escrows.length,
      activeDisputes: disputes.filter(d => d.status !== 'resolved').length,
      totalXlmOnPlatform: escrows.reduce((sum, e) => sum + e.amount, 0),
      flaggedUsers: 0,
    };
  } catch {
    return {
      totalPlatformEscrows: 0,
      activeDisputes: 0,
      totalXlmOnPlatform: 0,
      flaggedUsers: 0,
    };
  }
};

export const fetchEscrows = async (): Promise<Escrow[]> => {
  const response = await api.get<any[]>('/escrows/my');
  return response.data.map((e: any) => ({
    id: e._id,
    jobTitle: e.job?.title || 'Contract Job',
    freelancerName: e.freelancer?.username || e.freelancer?.name || 'Freelancer',
    freelancerAvatar: e.freelancer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${e.freelancer?.username || 'free'}`,
    clientName: e.client?.username || e.client?.name || 'Client',
    clientAvatar: e.client?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    amountLocked: e.amount,
    deadline: e.deadline,
    status: e.status,
    createdAt: e.createdAt || e.updatedAt,
  }));
};

export const fetchActivities = async (): Promise<Activity[]> => {
  try {
    const escrowsRes = await api.get<any[]>('/escrows/my');
    return escrowsRes.data.flatMap((e: any) => (e.timeline || []).map((t: any) => ({
      id: `${e._id}-${t.status}-${new Date(t.timestamp).getTime()}`,
      message: `${t.note || t.status} for "${e.job?.title || 'Contract'}"`,
      type: t.status as any,
      timestamp: t.timestamp,
    }))).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch {
    return [];
  }
};

export const fetchMessages = async (): Promise<Message[]> => {
  try {
    const res = await api.get<any[]>('/chat/conversations');
    return res.data.map((c: any) => {
      const otherUser = c.participants?.find((p: any) => p._id !== localStorage.getItem('user_id'));
      return {
        id: c._id,
        from: otherUser?.username || otherUser?.name || 'User',
        avatar: otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.username || 'user'}`,
        preview: c.lastMessage?.content || 'No messages yet',
        timestamp: c.lastMessage?.createdAt || c.updatedAt,
        unread: !!(c.lastMessage && c.lastMessage.read === false && c.lastMessage.sender !== localStorage.getItem('user_id')),
      };
    });
  } catch {
    return [];
  }
};

export const fetchGigs = async (): Promise<Gig[]> => {
  try {
    const response = await api.get<any[]>('/listings/my');
    return response.data.map((l: any) => ({
      id: l._id,
      title: l.title,
      freelancerId: l.createdBy,
      viewsThisWeek: l.views || 0,
      ordersReceived: 0,
      rating: 4.8,
    }));
  } catch {
    return [];
  }
};

export const fetchDisputes = async (): Promise<Dispute[]> => {
  try {
    const response = await api.get<any[]>('/disputes');
    return response.data.map((d: any) => ({
      id: d._id || d.id,
      escrowId: d.escrow?._id || d.escrow?.id || d.escrow,
      jobTitle: d.escrow?.job?.title || 'Contract Job',
      amountLocked: d.escrow?.amount || 0,
      clientName: d.escrow?.client?.username || d.escrow?.client?.name || 'Client',
      freelancerName: d.escrow?.freelancer?.username || d.escrow?.freelancer?.name || 'Freelancer',
      status: d.status?.toUpperCase() === 'RESOLVED' ? 'RESOLVED' : 'OPEN',
      openedAt: d.createdAt || new Date().toISOString(),
      assignedToDAO: !!d.assignedToDAO
    }));
  } catch (error: any) {
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      // Fallback for CLIENT/FREELANCER: fetch their own escrows and map the disputed ones
      try {
        const escrowsRes = await api.get<any[]>('/escrows/my');
        const disputedEscrows = (escrowsRes.data || []).filter((e: any) => e.status === 'DISPUTED');
        return disputedEscrows.map((e: any) => ({
          id: e._id,
          escrowId: e._id,
          jobTitle: e.job?.title || 'Contract Job',
          amountLocked: e.amount,
          clientName: e.client?.username || e.client?.name || 'Client',
          freelancerName: e.freelancer?.username || e.freelancer?.name || 'Freelancer',
          status: 'OPEN',
          openedAt: e.updatedAt || new Date().toISOString(),
          assignedToDAO: false
        }));
      } catch {
        return [];
      }
    }
    throw error;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const escrowsRes = await api.get<any[]>('/escrows/my');
    const usersMap = new Map<string, User>();
    (escrowsRes.data || []).forEach((e: any) => {
      if (e.client) {
        usersMap.set(e.client._id, {
          id: e.client._id,
          name: e.client.username || 'Client',
          walletAddress: e.client.walletAddress || '',
          joinedAt: '2026-06-01',
          flagged: (e.client.trustScore || 100) < 30,
          role: 'CLIENT'
        });
      }
      if (e.freelancer) {
        usersMap.set(e.freelancer._id, {
          id: e.freelancer._id,
          name: e.freelancer.username || 'Freelancer',
          walletAddress: e.freelancer.walletAddress || '',
          joinedAt: '2026-06-01',
          flagged: (e.freelancer.trustScore || 100) < 30,
          role: 'FREELANCER'
        });
      }
    });
    return Array.from(usersMap.values());
  } catch {
    return [];
  }
};

export const assignDisputeToDAO = async (id: string): Promise<Dispute> => {
  const response = await api.put<any>(`/disputes/${id}/assign-dao`);
  return {
    id: response.data._id,
    escrowId: response.data.escrow?._id || response.data.escrow,
    jobTitle: response.data.escrow?.job?.title || 'Contract Job',
    clientName: response.data.escrow?.client?.username || 'Client',
    freelancerName: response.data.escrow?.freelancer?.username || 'Freelancer',
    amountLocked: response.data.escrow?.amount || 0,
    openedAt: response.data.createdAt,
    status: response.data.status || 'OPEN',
    assignedToDAO: true
  };
};
