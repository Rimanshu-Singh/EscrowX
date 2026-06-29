import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { StatCard } from './shared/StatCard';
import { MessagesPreview } from './shared/MessagesPreview';
import { QuickActions } from './shared/QuickActions';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Star,
  Calendar,
} from 'lucide-react';
import { formatDistanceToNow, differenceInDays, format } from 'date-fns';
import { escrowService, chatService, listingService, proposalService, deliveryService } from '../../services/api';

export const FreelancerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [escrows, setEscrows] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const freelancerName = user?.name || 'Alex Rivera';

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

        const myListings = await listingService.getMyListings();
        setListings(myListings || []);

        const myProposals = await proposalService.getSentProposals();
        setProposals(myProposals || []);
      } catch (err) {
        console.error("Error loading freelancer dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Stats Calculations from Delivery Workspaces
  const activeOrdersCount = deliveries.filter(d => d.status === 'working').length;
  const pendingPaymentSum = deliveries.filter(d => d.status === 'working').reduce((sum, d) => sum + d.budget, 0);
  const completedOrdersCount = deliveries.filter(d => d.status === 'approved').length;
  const totalXlmEarned = deliveries.filter(d => d.status === 'approved').reduce((sum, d) => sum + d.budget, 0);

  const stats = {
    activeOrders: activeOrdersCount,
    pendingPayment: pendingPaymentSum,
    completedOrders: completedOrdersCount,
    totalXlmEarned: totalXlmEarned,
  };

  const activeEscrowsList = escrows.filter(e => ['FUNDED', 'IN_PROGRESS', 'DELIVERED', 'UNDER_REVIEW', 'DISPUTED'].includes(e.status));

  const freelancerEscrows = activeEscrowsList.slice(0, 5).map((e: any) => ({
    id: e._id,
    clientName: e.client?.username || e.client?.name || 'Client',
    clientAvatar: e.client?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    freelancerName: freelancerName,
    freelancerAvatar: user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    jobTitle: e.job?.title || 'Milestone Task',
    amountLocked: e.amount,
    deadline: e.deadline,
    status: e.status,
    createdAt: e.createdAt || e.updatedAt,
  }));

  const gigs = listings.map((l: any) => ({
    id: l._id,
    title: l.title,
    viewsThisWeek: l.views || Math.floor(Math.random() * 80) + 15,
    ordersReceived: escrows.filter(e => e.job?.title === l.title).length || Math.floor(Math.random() * 3),
    rating: user?.trustScore ? Math.min(5, Number((user.trustScore / 20).toFixed(1))) : 4.8,
  }));

  // Dynamic Notification Center events list construction
  const notifications: any[] = [];

  proposals.forEach((p: any) => {
    if (p.status === 'ACCEPTED') {
      notifications.push({
        id: `prop-acc-${p._id}`,
        type: 'PROPOSAL_ACCEPTED',
        title: 'Proposal Accepted 🎉',
        message: `Client accepted your proposal for "${p.projectId?.title || 'Project'}"`,
        timestamp: p.updatedAt || p.createdAt,
      });
    } else if (p.status === 'REJECTED') {
      notifications.push({
        id: `prop-rej-${p._id}`,
        type: 'PROPOSAL_REJECTED',
        title: 'Proposal Rejected',
        message: `Client declined your proposal for "${p.projectId?.title || 'Project'}"`,
        timestamp: p.updatedAt || p.createdAt,
      });
    }
  });

  escrows.forEach((e: any) => {
    (e.timeline || []).forEach((t: any) => {
      let title = '';
      let msg = '';
      let type = t.status;

      if (t.status === 'IN_PROGRESS') {
        title = 'Project In Progress ⚙️';
        msg = `Project "${e.job?.title || 'Contract'}" has moved to In Progress.`;
      } else if (t.status === 'DELIVERED') {
        title = 'Work Delivered 📦';
        msg = `You submitted work for "${e.job?.title || 'Contract'}".`;
      } else if (t.status === 'COMPLETED') {
        title = 'Payment Released 💸';
        msg = `Client approved work. Payment of ${e.amount} ${e.tokenType} released.`;
      } else if (t.status === 'REFUNDED') {
        title = 'Refund Processed 🔄';
        msg = `Refund has been processed for "${e.job?.title || 'Contract'}".`;
      } else {
        return;
      }

      notifications.push({
        id: `escrow-${e._id}-${t.status}-${new Date(t.timestamp).getTime()}`,
        type,
        title,
        message: msg,
        timestamp: t.timestamp,
      });
    });
  });

  // Sort latest first
  notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < Math.round(rating) ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}
          />
        ))}
        <span className="text-xs text-[#64748B] ml-1.5 font-mono">{rating}</span>
      </div>
    );
  };

  const renderViewsBar = (views: number) => {
    const maxViews = 200;
    const widthPercentage = Math.min((views / maxViews) * 100, 100);
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#334155] font-mono w-8">{views}</span>
        <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full"
            style={{ width: `${widthPercentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* SECTION 1 - TOP STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Orders"
          value={stats.activeOrders}
          icon={Briefcase}
          color="amber"
          trend=""
          isLoading={loading}
        />
        <StatCard
          title="Pending Payment"
          value={`${stats.pendingPayment.toLocaleString()} XLM`}
          icon={Clock}
          color="red"
          trend=""
          isLoading={loading}
        />
        <StatCard
          title="Completed Orders"
          value={stats.completedOrders}
          icon={CheckCircle}
          color="green"
          trend=""
          isLoading={loading}
        />
        <StatCard
          title="Total Earned"
          value={`${stats.totalXlmEarned.toLocaleString()} XLM`}
          icon={TrendingUp}
          color="purple"
          trend=""
          isLoading={loading}
        />
      </div>

      {/* SECTION 2 - INCOMING ESCROWS */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#0F1117] dark:text-white">Incoming & Active Escrows</h3>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-44 bg-white dark:bg-[#1E293B] border border-[#E4E8F0] dark:border-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : freelancerEscrows.length === 0 ? (
          <div className="rounded-xl border border-[#E4E8F0] dark:border-slate-800 bg-white dark:bg-[#1E293B] p-8 text-center text-[#9CA3AF] text-sm">
            No active incoming escrows at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freelancerEscrows.map((escrow) => {
              const deadlineDate = new Date(escrow.deadline);
              const daysLeft = differenceInDays(deadlineDate, new Date());
              const isUrgent = daysLeft >= 0 && daysLeft < 3;
              const countdown = isNaN(deadlineDate.getTime())
                ? escrow.deadline
                : formatDistanceToNow(deadlineDate, { addSuffix: true });

              const progress = (() => {
                switch (escrow.status) {
                  case 'CREATED': return 10;
                  case 'FUNDED': return 25;
                  case 'IN_PROGRESS': return 50;
                  case 'DELIVERED': return 75;
                  case 'UNDER_REVIEW': return 90;
                  case 'DISPUTED': return 95;
                  case 'COMPLETED': return 100;
                  default: return 0;
                }
              })();

              return (
                <div
                  key={escrow.id}
                  className="group relative rounded-xl border border-[#E4E8F0] dark:border-slate-800 bg-white dark:bg-[#1E293B] p-5 transition-all duration-300 hover:border-teal-450 hover:shadow-md hover:shadow-teal-500/5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={escrow.clientAvatar}
                          alt={escrow.clientName}
                          className="w-7 h-7 rounded-full bg-slate-50 border border-[#E4E8F0] dark:border-slate-800"
                        />
                        <div>
                          <h5 className="text-[10px] uppercase tracking-wider text-slate-400">Client</h5>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{escrow.clientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-teal-50 dark:bg-teal-950/30 text-teal-650 dark:text-teal-400 text-xs font-bold px-2 py-1 rounded-lg border border-teal-205 dark:border-teal-900/30">
                        <Sparkles size={11} />
                        <span>{escrow.amountLocked} XLM</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#0F1117] dark:text-white group-hover:text-teal-600 transition-colors duration-200">
                        {escrow.jobTitle}
                      </h4>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-gray-400">
                        <span className="uppercase">Status: <span className="text-teal-600 font-extrabold">{escrow.status}</span></span>
                        <span>{progress}% Progress</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-850 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-teal-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={13} className={isUrgent ? 'text-red-500' : ''} />
                      <span className={isUrgent ? 'text-red-500 font-semibold' : ''}>
                        Deadline: {format(deadlineDate, 'MMMM dd, yyyy')} ({countdown})
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-[#E4E8F0] dark:border-slate-800">
                    <button
                      onClick={() => navigate('/freelancer/escrow/' + escrow.id)}
                      className="flex-1 text-center py-2 rounded-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 transition-colors duration-150 active:scale-95 cursor-pointer"
                    >
                      Accept Workspace
                    </button>
                    <button
                      onClick={() => navigate('/freelancer/escrow/' + escrow.id)}
                      className="flex-1 text-center py-2 rounded-lg text-xs font-bold text-slate-750 dark:text-slate-300 hover:text-[#0F1117] bg-transparent border border-[#E4E8F0] dark:border-slate-800 hover:bg-[#F8F9FB] dark:hover:bg-slate-800 transition-all duration-150 active:scale-95 cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 3 - MY GIGS PERFORMANCE */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#0F1117] dark:text-white">My Gigs Performance</h3>
        <div className="rounded-xl border border-[#E4E8F0] dark:border-slate-800 bg-white dark:bg-[#1E293B] overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3 animate-pulse">
              <div className="h-4 bg-slate-100 dark:bg-slate-850 rounded w-1/4"></div>
              <div className="h-3 bg-slate-100 dark:bg-slate-850 rounded w-full"></div>
              <div className="h-3 bg-slate-100 dark:bg-slate-850 rounded w-5/6"></div>
            </div>
          ) : !gigs || gigs.length === 0 ? (
            <div className="p-6 text-center text-[#9CA3AF] text-sm">No gigs found. Create a listing to view stats.</div>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#E4E8F0] dark:border-slate-800 bg-[#F8F9FB]/50 dark:bg-slate-800/30">
                  <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Gig Title</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Views This Week</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Orders</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E8F0] dark:divide-slate-800">
                {gigs.map((gig) => (
                  <tr key={gig.id} className="hover:bg-[#F8F9FB] dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{gig.title}</td>
                    <td className="p-4">{renderViewsBar(gig.viewsThisWeek)}</td>
                    <td className="p-4 font-mono font-semibold text-slate-800 dark:text-slate-300">{gig.ordersReceived}</td>
                    <td className="p-4">{renderStars(gig.rating)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* SECTION 4 - TWO COLUMN ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Notification Center */}
        <div className="lg:col-span-6 space-y-3">
          <div className="rounded-xl border border-[#E4E8F0] dark:border-slate-800 bg-white dark:bg-[#1E293B] p-6">
            <h3 className="text-lg font-semibold text-[#0F1117] dark:text-white mb-4">Notification Center</h3>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-[#9CA3AF] text-sm">
                No new notifications.
              </div>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {notifications.map((n) => {
                  const date = new Date(n.timestamp);
                  const timeAgo = isNaN(date.getTime())
                    ? 'some time ago'
                    : formatDistanceToNow(date, { addSuffix: true });
                  return (
                    <div key={n.id} className="flex gap-3 items-start border-b border-[#F1F5F9] dark:border-slate-800 pb-3 last:border-0 last:pb-0 hover:translate-x-0.5 transition-transform duration-150">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                        n.type === 'PROPOSAL_ACCEPTED' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' :
                        n.type === 'PROPOSAL_REJECTED' ? 'bg-red-50 text-red-600 dark:bg-red-950/30' :
                        n.type === 'COMPLETED' ? 'bg-green-50 text-green-600 dark:bg-green-950/30' :
                        n.type === 'REFUNDED' ? 'bg-slate-100 text-slate-600 dark:bg-slate-850' :
                        'bg-blue-50 text-blue-600 dark:bg-blue-950/30'
                      }`}>
                        {n.type === 'PROPOSAL_ACCEPTED' ? '🎉' :
                         n.type === 'PROPOSAL_REJECTED' ? '❌' :
                         n.type === 'COMPLETED' ? '💸' :
                         n.type === 'REFUNDED' ? '🔄' : '⚙️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-[#9CA3AF] mt-1 block">{timeAgo}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <QuickActions role="FREELANCER" />
          <MessagesPreview messages={messages} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
