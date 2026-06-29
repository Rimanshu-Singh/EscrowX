import React, { useState, useEffect } from 'react';
import { StatCard } from './shared/StatCard';
import {
  Database,
  AlertTriangle,
  Globe,
  Flag,
  UserCheck,
  UserX,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { disputeService, escrowService } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allDisputes = await disputeService.getDisputes();
        setDisputes(allDisputes || []);

        const allEscrows = await escrowService.getMyEscrows();
        setEscrows(allEscrows || []);
      } catch (err) {
        console.error("Error loading admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Collect unique users from escrows & disputes dynamically
  const usersMap = new Map<string, any>();
  
  escrows.forEach((e: any) => {
    if (e.client) {
      usersMap.set(e.client._id || e.client.id || 'c-' + e.client.username, {
        id: e.client._id || e.client.id,
        name: e.client.username || 'Client',
        walletAddress: e.client.walletAddress || '',
        role: 'CLIENT',
        flagged: (e.client.trustScore || 100) < 30,
        joinedAt: '2026-06-01'
      });
    }
    if (e.freelancer) {
      usersMap.set(e.freelancer._id || e.freelancer.id || 'f-' + e.freelancer.username, {
        id: e.freelancer._id || e.freelancer.id,
        name: e.freelancer.username || 'Freelancer',
        walletAddress: e.freelancer.walletAddress || '',
        role: 'FREELANCER',
        flagged: (e.freelancer.trustScore || 100) < 30,
        joinedAt: '2026-06-01'
      });
    }
  });

  const users = Array.from(usersMap.values());

  const stats = {
    totalPlatformEscrows: escrows.length,
    activeDisputes: disputes.filter(d => d.status !== 'resolved').length,
    totalXlmOnPlatform: escrows.reduce((sum, e) => sum + e.amount, 0),
    flaggedUsers: users.filter(u => u.flagged).length,
  };

  const handleAssignToDAO = async (id: string) => {
    setAssigningId(id);
    try {
      alert(`Dispute ${id} successfully assigned to DAO governance vote.`);
      // Mock assigning state transition locally
      setDisputes(prev => prev.map(d => d._id === id ? { ...d, assignedToDAO: true } : d));
    } catch (err) {
      console.error(err);
    } finally {
      setAssigningId(null);
    }
  };

  const handleSuspendUser = (name: string) => {
    alert(`Suspended user: "${name}"`);
  };

  const handleWarnUser = (name: string) => {
    alert(`Sent warning to user: "${name}"`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* SECTION 1 - TOP STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Platform Escrows"
          value={stats.totalPlatformEscrows}
          icon={Database}
          color="blue"
          trend=""
          isLoading={loading}
        />
        <StatCard
          title="Active Disputes"
          value={stats.activeDisputes}
          icon={AlertTriangle}
          color="red"
          trend=""
          isLoading={loading}
        />
        <StatCard
          title="Total XLM on Platform"
          value={`${stats.totalXlmOnPlatform.toLocaleString()} XLM`}
          icon={Globe}
          color="green"
          trend=""
          isLoading={loading}
        />
        <StatCard
          title="Flagged Users"
          value={stats.flaggedUsers}
          icon={Flag}
          color="amber"
          trend=""
          isLoading={loading}
        />
      </div>

      {/* SECTION 2 - DISPUTES QUEUE */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#0F1117] dark:text-white">Disputes Resolution Queue</h3>
        <div className="rounded-xl border border-[#E4E8F0] dark:border-slate-800 bg-white dark:bg-[#1E293B] overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3 animate-pulse">
              <div className="h-4 bg-slate-100 dark:bg-slate-850 rounded w-1/4"></div>
              <div className="h-3 bg-slate-100 dark:bg-slate-850 rounded w-full"></div>
              <div className="h-3 bg-slate-100 dark:bg-slate-850 rounded w-5/6"></div>
            </div>
          ) : !disputes || disputes.length === 0 ? (
            <div className="p-6 text-center text-[#9CA3AF] text-sm">No active disputes.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E4E8F0] dark:border-slate-800 bg-[#F8F9FB]/50 dark:bg-slate-800/30">
                    <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Dispute ID</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Job Title</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Client</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Freelancer</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Amount</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Opened At</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">DAO</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E8F0] dark:divide-slate-800">
                  {disputes.map((dispute) => {
                    const openedDate = new Date(dispute.createdAt || dispute.openedAt);
                    const formattedOpened = isNaN(openedDate.getTime())
                      ? dispute.createdAt || dispute.openedAt
                      : format(openedDate, 'MMM dd, yyyy');

                    const isPendingMutation = assigningId === dispute._id;

                    return (
                      <tr key={dispute._id} className="hover:bg-[#F8F9FB] dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-mono text-[#9CA3AF]">{dispute._id}</td>
                        <td className="p-4 font-semibold text-[#0F1117] dark:text-white">{dispute.escrow?.job?.title || 'Contract Job'}</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">{dispute.escrow?.client?.username || dispute.escrow?.client?.name || 'Client'}</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">{dispute.escrow?.freelancer?.username || dispute.escrow?.freelancer?.name || 'Freelancer'}</td>
                        <td className="p-4 text-indigo-600 dark:text-indigo-400 font-bold">{dispute.escrow?.amount} XLM</td>
                        <td className="p-4 text-slate-500">{formattedOpened}</td>
                        <td className="p-4">
                          {dispute.assignedToDAO ? (
                            <span className="text-xs text-purple-600 font-semibold px-2 py-0.5 rounded bg-purple-50 border border-purple-200">
                              DAO Escrowed
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Arbitrator Only</span>
                          )}
                        </td>
                        <td className="p-4">
                          {dispute.assignedToDAO ? (
                            <button
                              disabled
                              className="px-3 py-1 rounded text-xs font-semibold text-green-600 bg-green-50 border border-green-200"
                            >
                              Assigned ✓
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAssignToDAO(dispute._id)}
                              disabled={isPendingMutation}
                              className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:text-white/40 transition-colors cursor-pointer"
                            >
                              {isPendingMutation ? (
                                <>
                                  <Loader2 size={12} className="animate-spin" />
                                  Assigning...
                                </>
                              ) : (
                                'Assign to DAO'
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3 - TWO COLUMN ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* User Management */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-lg font-semibold text-[#0F1117] dark:text-white">User Management</h3>
          <div className="rounded-xl border border-[#E4E8F0] dark:border-slate-800 bg-white dark:bg-[#1E293B] overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3 animate-pulse">
                <div className="h-4 bg-slate-100 dark:bg-slate-850 rounded w-1/4"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-850 rounded w-full"></div>
              </div>
            ) : !users || users.length === 0 ? (
              <div className="p-6 text-center text-[#9CA3AF] text-sm">No users registered.</div>
            ) : (
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E4E8F0] dark:border-slate-800 bg-[#F8F9FB]/50 dark:bg-slate-800/30">
                    <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Name</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Wallet</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Role</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Status</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E8F0] dark:divide-slate-800">
                  {users.map((userItem) => (
                    <tr
                      key={userItem.id}
                      className={`transition-colors ${
                        userItem.flagged
                          ? 'bg-red-50 hover:bg-red-100/50 border-l-2 border-l-red-500'
                          : 'hover:bg-[#F8F9FB] dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-300">{userItem.name}</div>
                        <div className="text-[10px] text-slate-400">Joined {userItem.joinedAt}</div>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-600 dark:text-slate-400">{userItem.walletAddress}</td>
                      <td className="p-4 text-xs">
                        <span className="px-2 py-0.5 rounded bg-slate-50 border border-[#E4E8F0] text-slate-700 font-semibold">
                          {userItem.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {userItem.flagged ? (
                          <span className="flex items-center gap-1 text-red-600 font-bold text-xs">
                            <ShieldAlert size={12} />
                            Flagged
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Active</span>
                        )}
                      </td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => handleWarnUser(userItem.name)}
                          className="px-2.5 py-1 rounded text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
                        >
                          Warn
                        </button>
                        <button
                          onClick={() => handleSuspendUser(userItem.name)}
                          className="px-2.5 py-1 rounded text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                        >
                          Suspend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Platform Analytics */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-lg font-semibold text-[#0F1117] dark:text-white">Platform Analytics</h3>
          <div className="rounded-xl border border-[#E4E8F0] dark:border-slate-800 bg-white dark:bg-[#1E293B] p-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold block">
                Escrows this week
              </span>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                  <span>Mon - Wed</span>
                  <span>{Math.floor(stats.totalPlatformEscrows * 0.4)} escrows</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }} />
                </div>

                <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 pt-1">
                  <span>Thu - Sat</span>
                  <span>{Math.floor(stats.totalPlatformEscrows * 0.6)} escrows</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>

            {/* Resolution Rate */}
            <div className="flex items-center gap-6 border-t border-[#E4E8F0] dark:border-slate-800 pt-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-slate-100"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-green-500"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - 0.94)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#0F1117] dark:text-white font-mono">
                  94%
                </div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold block">
                  Dispute Resolution Rate
                </span>
                <p className="text-sm font-semibold text-slate-650 dark:text-slate-300 mt-1">
                  DAO & Arbitrator resolution efficiency.
                </p>
              </div>
            </div>

            {/* Avg Dispute Time */}
            <div className="border-t border-[#E4E8F0] dark:border-slate-800 pt-4 flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">
                Avg Dispute Time
              </span>
              <span className="text-xl font-bold text-[#0F1117] dark:text-white font-mono">2.8 Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
