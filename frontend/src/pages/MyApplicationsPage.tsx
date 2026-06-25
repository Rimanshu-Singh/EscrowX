import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Trash2 } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { proposalService } from '../services/api';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const data = await proposalService.getSentProposals();
      setApplications(data);
    } catch (err) {
      console.error('Error fetching proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleWithdraw = async (appId: string) => {
    if (!window.confirm("Are you sure you want to withdraw this proposal?")) return;
    try {
      await proposalService.withdrawProposal(appId);
      alert('Proposal withdrawn successfully');
      fetchApps();
    } catch (err) {
      alert('Failed to withdraw proposal');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-black text-[#0F172A] tracking-tight">My Proposals & Applications</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Track all applications you have submitted to client projects.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#7C3AED]"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white border border-[#E4E8F0] rounded-xl p-12 text-center max-w-xl mx-auto shadow-2xs space-y-3">
            <Briefcase className="w-10 h-10 text-[#94A3B8] mx-auto" />
            <h3 className="text-xs font-bold text-[#0F172A]">No Applications Found</h3>
            <p className="text-xs text-[#64748B]">You haven't submitted proposals to project listings yet.</p>
            <Link to="/marketplace" className="inline-block mt-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-xs">
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-[#E4E8F0] rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E4E8F0] text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="px-6 py-4">Project Listing</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Bid Amount</th>
                    <th className="px-6 py-4">Delivery</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date Submitted</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-xs text-[#334155]">
                   {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#0F172A]">
                        <Link to={`/listing/${app.projectId?._id || app.projectId}`} className="hover:text-[#7C3AED] transition-colors line-clamp-1">
                          {app.projectId?.title || 'Project Proposal'}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-700 hover:text-[#7C3AED] transition-colors">
                          <Link to={`/u/${app.projectId?.ownerUsername || app.projectOwnerId?.username || ''}`}>
                            {app.projectOwnerId?.name || app.projectId?.ownerUsername || 'A Client'}
                          </Link>
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-800">{app.bidAmount} XLM</td>
                      <td className="px-6 py-4 font-semibold text-slate-600">{app.expectedDelivery} Days</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                          app.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          app.status === 'REJECTED' ? 'bg-red-50 text-red-600 border border-red-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {app.status === 'PENDING' && (
                            <button
                              onClick={() => handleWithdraw(app._id)}
                              className="p-1.5 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                              title="Withdraw Proposal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <Link
                            to={`/listing/${app.projectId?._id || app.projectId}`}
                            className="p-1.5 rounded-lg border border-[#E4E8F0] hover:bg-slate-100 text-[#475569] transition-colors"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
