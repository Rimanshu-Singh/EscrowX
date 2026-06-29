import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { StatCard } from './shared/StatCard';
import { EscrowTable } from './shared/EscrowTable';
import { ActivityFeed } from './shared/ActivityFeed';
import { MessagesPreview } from './shared/MessagesPreview';
import { QuickActions } from './shared/QuickActions';
import { Shield, Clock, CheckCircle, Coins } from 'lucide-react';
import { escrowService, chatService, deliveryService } from '../../services/api';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [escrows, setEscrows] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const clientName = user?.name || 'Client';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const myEscrows = await escrowService.getMyEscrows();
        setEscrows(myEscrows || []);

        const myDeliveries = await deliveryService.getDeliveries();
        setDeliveries(myDeliveries || []);

        const myConversations = await chatService.getConversations();
        setConversations(myConversations || []);
      } catch (err) {
        console.error("Error loading client dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    totalEscrows: escrows.length,
    activeEscrows: deliveries.filter(d => d.status === 'working').length,
    completedJobs: escrows.filter(e => e.status === 'COMPLETED').length,
    totalXlmSpent: escrows.filter(e => e.status === 'COMPLETED').reduce((sum, e) => sum + e.amount, 0),
  };

  const clientEscrows = escrows.slice(0, 5).map((e: any) => ({
    id: e._id,
    clientName: clientName,
    clientAvatar: user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    freelancerName: e.freelancer?.username || e.freelancer?.name || 'Freelancer',
    freelancerAvatar: e.freelancer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${e.freelancer?.username || 'Free'}`,
    jobTitle: e.job?.title || 'Milestone Task',
    amountLocked: e.amount,
    deadline: e.deadline,
    status: e.status,
    createdAt: e.createdAt || e.updatedAt,
  }));

  const activities = escrows
    .flatMap((e: any) => (e.timeline || []).map((evt: any) => {
      let title = '';
      if (evt.status === 'CREATED') title = 'Escrow Created';
      else if (evt.status === 'FUNDED') title = 'Escrow Funded';
      else if (evt.status === 'IN_PROGRESS') title = 'Milestone Started';
      else if (evt.status === 'DELIVERED') title = 'Deliverable Received';
      else if (evt.status === 'COMPLETED') title = 'Payment Released';
      else if (evt.status === 'REFUNDED') title = 'Refund Processed';
      else title = evt.status;

      return {
        id: e._id + '-' + evt.status + '-' + new Date(evt.timestamp).getTime(),
        type: evt.status as any,
        message: `${title} for "${e.job?.title || 'Contract'}"`,
        timestamp: evt.timestamp,
      };
    }))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const messages = conversations.map((c: any) => {
    const otherUser = c.participants?.find((p: any) => p._id !== user?.id);
    return {
      id: c._id,
      from: otherUser?.username || otherUser?.name || 'User',
      avatar: otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.username || 'user'}`,
      preview: c.lastMessage?.content || 'No messages yet',
      timestamp: c.lastMessage?.createdAt || c.updatedAt,
      unread: c.lastMessage && c.lastMessage.sender !== user?.id && !c.lastMessage.read
    };
  }).slice(0, 3);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* SECTION 1 - TOP STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Escrows Created"
          value={stats.totalEscrows}
          icon={Shield}
          color="purple"
          trend=""
          isLoading={loading}
        />
        <StatCard
          title="Active Escrows"
          value={stats.activeEscrows}
          icon={Clock}
          color="amber"
          trend=""
          isLoading={loading}
        />
        <StatCard
          title="Completed Jobs"
          value={stats.completedJobs}
          icon={CheckCircle}
          color="green"
          trend=""
          isLoading={loading}
        />
        <StatCard
          title="Total XLM Spent"
          value={`${stats.totalXlmSpent.toLocaleString()} XLM`}
          icon={Coins}
          color="blue"
          trend=""
          isLoading={loading}
        />
      </div>

      {/* SECTION 2 - MY ACTIVE ESCROWS */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#0F1117] dark:text-white">My Active Escrows</h3>
          <span className="text-xs text-slate-400 font-mono">
            {clientEscrows.length} total escrows
          </span>
        </div>
        <EscrowTable escrows={clientEscrows} isLoading={loading} />
      </div>

      {/* SECTION 3 - TWO COLUMN ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-6">
          <ActivityFeed activities={activities} isLoading={loading} />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <QuickActions role="CLIENT" />
          <MessagesPreview messages={messages} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
