import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, DollarSign, PackageOpen, ClipboardList } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { deliveryService } from '../services/api';

export default function DeliveryListPage() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await deliveryService.getDeliveries();
        setDeliveries(data);
      } catch (err) {
        console.error('Error fetching deliveries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  const getCountdown = (deadlineStr: string) => {
    if (!deadlineStr) return { text: 'No deadline set', color: 'text-slate-400 bg-slate-50 border border-slate-200 font-bold px-2 py-0.5 rounded-md text-[10px]' };
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    
    if (diffTime < 0) {
      const diffDays = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24));
      return { 
        text: `Overdue by ${diffDays} day${diffDays > 1 ? 's' : ''}`, 
        color: 'text-rose-600 bg-rose-50 border border-rose-100 font-bold px-2 py-0.5 rounded-md text-[10px]' 
      };
    } else {
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        return { 
          text: `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`, 
          color: 'text-amber-600 bg-amber-50 border border-amber-100 font-bold px-2 py-0.5 rounded-md text-[10px]' 
        };
      } else {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours > 0) {
          return { 
            text: `${diffHours} hour${diffHours > 1 ? 's' : ''} remaining`, 
            color: 'text-amber-600 bg-amber-50 border border-amber-100 font-bold px-2 py-0.5 rounded-md text-[10px]' 
          };
        } else {
          return { 
            text: 'Due soon', 
            color: 'text-rose-600 bg-rose-50 border border-rose-100 font-bold px-2 py-0.5 rounded-md text-[10px]' 
          };
        }
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'working':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-50 text-amber-600 border border-amber-200">
            Working
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-green-50 text-green-600 border border-green-200">
            Delivered
          </span>
        );
      case 'revision_requested':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-50 text-rose-600 border border-rose-200">
            Revision Requested
          </span>
        );
      case 'approved':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            Approved
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-50 text-slate-600 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="min-w-0 space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-black tracking-tight text-[#0F172A] sm:text-2xl">Delivery Workspaces</h1>
            <p className="text-xs text-[#64748B] mt-0.5">Manage active deliverables, reviews, and escrow releases for your contracts.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7C3AED]"></div>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-[#E4E8F0] bg-white p-6 text-center shadow-2xs sm:p-16">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <ClipboardList className="w-6 h-6 text-[#94A3B8]" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">No Active Deliveries</h3>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
              Once a proposal is accepted, a secure workspace is created here for uploading files, client reviews, and tracking milestone progress.
            </p>
            <Link to="/marketplace" className="mt-2 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#7C3AED] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#6D28D9]">
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="flex w-full min-w-0 flex-col gap-4">
            {deliveries.map((dlv) => {
              const projectTitle = dlv.projectId?.title || 'Untitled Project';
              const projectDesc = dlv.projectId?.description || '';
              const deadline = dlv.deadline ? new Date(dlv.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
              const budgetVal = dlv.budget || dlv.projectId?.budget || dlv.projectId?.price || 0;
              const countdown = getCountdown(dlv.deadline);

              return (
                <div key={dlv._id} className="flex min-w-0 flex-col justify-between gap-5 rounded-2xl border border-[#E4E8F0] bg-white p-4 shadow-2xs transition-all hover:border-[#D1D5DB] hover:shadow-xs md:flex-row md:items-center sm:p-5">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-[9px] font-black text-slate-400 uppercase bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                        ID: <span className="break-all">{dlv.escrowId || dlv._id}</span>
                      </span>
                      {getStatusBadge(dlv.status)}
                      <span className={countdown.color}>
                        {countdown.text}
                      </span>
                    </div>

                    <h3 className="break-words text-base font-extrabold leading-snug text-[#0F172A] transition-colors hover:text-[#7C3AED]">
                      <Link to={`/delivery/${dlv.escrowId || dlv._id}`}>{projectTitle}</Link>
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 max-w-3xl leading-relaxed">
                      {projectDesc}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-slate-50 pt-4 md:flex-row md:items-center md:justify-end md:border-t-0 md:pt-0">
                    <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 md:flex md:items-center md:gap-6">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Budget</p>
                        <p className="font-black text-slate-800 mt-1 font-mono text-sm">{budgetVal} XLM</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Deadline</p>
                        <p className="font-bold text-slate-800 mt-1">{deadline}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/delivery/${dlv.escrowId || dlv._id}`)}
                      className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-[#7C3AED] px-4.5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#6D28D9] md:w-auto cursor-pointer"
                    >
                      <PackageOpen className="w-4 h-4" />
                      Open Workspace
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
