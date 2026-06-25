import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, X, User } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { hireRequestService } from '../services/api';

export default function ClientApplicationsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSentRequests = async () => {
    try {
      const data = await hireRequestService.getMyHireRequests();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching sent hire requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentRequests();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-black text-[#0F172A] tracking-tight">My Applications / Sent Hire Requests</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Track and fund hire requests you have sent to freelancer service listings.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#7C3AED]"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white border border-[#E4E8F0] rounded-xl p-12 text-center max-w-xl mx-auto shadow-2xs space-y-3">
            <Briefcase className="w-10 h-10 text-[#94A3B8] mx-auto" />
            <h3 className="text-xs font-bold text-[#0F172A]">No Sent Requests</h3>
            <p className="text-xs text-[#64748B]">You haven't sent any hire requests to freelancer services yet.</p>
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
                    <th className="px-6 py-4">Freelancer</th>
                    <th className="px-6 py-4">Project / Gig Title</th>
                    <th className="px-6 py-4">Budget</th>
                    <th className="px-6 py-4">Deadline</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-xs text-[#334155]">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <Link to={`/u/${req.freelancer?.username || ''}`} className="hover:opacity-80 transition-opacity">
                            <img
                              src={req.freelancer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.freelancer?.username || 'User'}`}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border"
                            />
                          </Link>
                          <div>
                            <span className="font-bold text-[#0F172A] block hover:text-[#7C3AED] transition-colors">
                              <Link to={`/u/${req.freelancer?.username || ''}`}>{req.freelancer?.name || req.freelancer?.username || 'Freelancer'}</Link>
                            </span>
                            <span className="font-mono text-[9px] text-gray-400 select-all" title={req.freelancer?.walletAddress}>
                              {req.freelancer?.walletAddress ? `${req.freelancer.walletAddress.slice(0, 6)}...${req.freelancer.walletAddress.slice(-4)}` : '—'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/listing/${req.listing?._id || req.listing}`} className="font-bold text-[#0F172A] hover:text-[#7C3AED] transition-colors block line-clamp-1">
                          {req.projectTitle}
                        </Link>
                        <span className="text-[10px] text-slate-400 line-clamp-1">{req.projectDescription}</span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-800">{req.budgetAmount} XLM</td>
                      <td className="px-6 py-4 font-medium text-slate-600">{new Date(req.deadline).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                          req.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          req.status === 'REJECTED' ? 'bg-red-50 text-red-600 border border-red-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {req.status === 'ACCEPTED' && (
                            <button
                              onClick={() => navigate(`/escrow/create?listingId=${req.listing?._id || req.listing}&amount=${req.budgetAmount}&counterpartyAddress=${req.freelancer?.walletAddress || ''}&counterpartyId=${req.freelancer?._id || req.freelancer?.id || req.freelancer}&title=${encodeURIComponent(req.projectTitle)}`)}
                              className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                            >
                              Fund Escrow
                            </button>
                          )}
                          <Link
                            to={`/listing/${req.listing?._id || req.listing}`}
                            className="p-1.5 rounded-lg border border-[#E4E8F0] hover:bg-slate-100 text-[#475569] transition-colors"
                            title="View Service Listing"
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
