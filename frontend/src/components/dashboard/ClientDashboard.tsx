import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { StatCard } from './shared/StatCard';
import { EscrowTable } from './shared/EscrowTable';
import { ActivityFeed } from './shared/ActivityFeed';
import { MessagesPreview } from './shared/MessagesPreview';
import { QuickActions } from './shared/QuickActions';
import { Shield, Clock, CheckCircle, Coins } from 'lucide-react';

const clientDashboardData = {
  totalEscrows: 3,
  activeProjects: 2,
  completedProjects: 5,
  totalSpent: "1200 XLM",
  recentEscrows: [
    {
      escrowId: "ESC-1001",
      title: "Build Landing Page",
      status: "IN_PROGRESS",
      amount: "300 XLM"
    },
    {
      escrowId: "ESC-1002",
      title: "Smart Contract Audit",
      status: "DELIVERED",
      amount: "500 XLM"
    }
  ]
};

export const ClientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const clientName = user?.name || 'Priya Shah';

  const stats = {
    totalEscrows: clientDashboardData.totalEscrows,
    activeEscrows: clientDashboardData.activeProjects,
    completedJobs: clientDashboardData.completedProjects,
    totalXlmSpent: 1200,
  };

  const clientEscrows = clientDashboardData.recentEscrows.map((escrow) => ({
    id: escrow.escrowId,
    clientName: clientName,
    clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    freelancerName: escrow.escrowId === "ESC-1001" ? "Alex Rivera" : "Elena Rostova",
    freelancerAvatar: escrow.escrowId === "ESC-1001"
      ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
      : "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    jobTitle: escrow.title,
    amountLocked: parseFloat(escrow.amount),
    deadline: escrow.escrowId === "ESC-1001" ? "2026-07-15T00:00:00Z" : "2026-07-01T00:00:00Z",
    status: escrow.status as any,
    createdAt: "2026-06-20T10:30:00Z",
  }));

  const activities = [
    {
      id: "act-1",
      type: "NEW_ESCROW" as any,
      message: "New escrow contract created for 'Build Landing Page'",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "act-2",
      type: "DELIVERY" as any,
      message: "Smart Contract Audit delivered by Elena Rostova",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "act-3",
      type: "RELEASE" as any,
      message: "Freelancer payout released for UI Animation System",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    }
  ];

  const messages = [
    {
      id: "msg-1",
      from: "Alex Rivera",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      preview: "Hi Priya, the landing page layout is complete. Let me know when you can review it.",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      unread: true,
    },
    {
      id: "msg-2",
      from: "Elena Rostova",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      preview: "I've uploaded the smart contract audit reports to the dashboard.",
      timestamp: new Date(Date.now() - 5400000).toISOString(),
      unread: false,
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* SECTION 1 - TOP STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Escrows Created"
          value={stats.totalEscrows}
          icon={Shield}
          color="purple"
          trend="+12%"
          isLoading={false}
        />
        <StatCard
          title="Active Escrows"
          value={stats.activeEscrows}
          icon={Clock}
          color="amber"
          trend="+4%"
          isLoading={false}
        />
        <StatCard
          title="Completed Jobs"
          value={stats.completedJobs}
          icon={CheckCircle}
          color="green"
          trend="+18%"
          isLoading={false}
        />
        <StatCard
          title="Total XLM Spent"
          value={`${stats.totalXlmSpent} XLM`}
          icon={Coins}
          color="blue"
          trend="+22%"
          isLoading={false}
        />
      </div>

      {/* SECTION 2 - MY ACTIVE ESCROWS */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#0F1117]">My Active Escrows</h3>
          <span className="text-xs text-slate-400 font-mono">
            {clientEscrows.length} total escrows
          </span>
        </div>
        <EscrowTable escrows={clientEscrows} isLoading={false} />
      </div>

      {/* SECTION 3 - TWO COLUMN ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-6">
          <ActivityFeed activities={activities} isLoading={false} />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <QuickActions role="CLIENT" />
          <MessagesPreview messages={messages} isLoading={false} />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
