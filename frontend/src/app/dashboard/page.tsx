import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle, Briefcase, Shield, CreditCard, Star, Settings as SettingsIcon,
  Edit3, Trash2, CheckCircle, XCircle, Search, Filter, ChevronLeft, ChevronRight,
  Eye, AlertTriangle, TrendingUp, Lock, DollarSign, Award, Users, ExternalLink
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuthStore } from '../../store/authStore';
import { useSocket } from '../../hooks/useSocket';
import { jobService, escrowService, disputeService, reviewService } from '../../services/api';

interface DashboardPageProps {
  tab?: 'overview' | 'jobs' | 'escrows' | 'payments' | 'reviews' | 'settings' | 'disputes' | 'applications';
}

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-500',
  open: 'bg-emerald-50 text-emerald-600',
  in_progress: 'bg-blue-50 text-blue-600',
  completed: 'bg-purple-50 text-purple-600',
  CREATED: 'bg-gray-100 text-gray-500',
  FUNDED: 'bg-blue-50 text-blue-600',
  IN_PROGRESS: 'bg-indigo-50 text-indigo-600',
  DELIVERED: 'bg-amber-50 text-amber-600',
  UNDER_REVIEW: 'bg-orange-50 text-orange-600',
  DISPUTED: 'bg-red-50 text-red-600',
  COMPLETED: 'bg-emerald-50 text-emerald-600',
  REFUNDED: 'bg-gray-100 text-gray-500',
};

export default function DashboardPage({ tab: initialTab = 'overview' }: DashboardPageProps) {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  useSocket();

  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab when route changes via prop
  useEffect(() => { setActiveTab(initialTab); }, [initialTab]);

  // Data
  const [jobs, setJobs] = useState<any[]>([]);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectTransactions, setProjectTransactions] = useState<any[]>([]);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  // Search / filter / pagination for browse jobs (freelancer)
  const [search, setSearch] = useState('');
  const [filterToken, setFilterToken] = useState('');
  const [filterMinBudget, setFilterMinBudget] = useState('');
  const [filterMaxBudget, setFilterMaxBudget] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searching, setSearching] = useState(false);

  // Job CRUD state
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobBudget, setJobBudget] = useState(100);
  const [jobToken, setJobToken] = useState<'XLM' | 'USDC'>('XLM');
  const [savingJob, setSavingJob] = useState(false);
  const [deletingJob, setDeletingJob] = useState<string | null>(null);
  const [publishingJob, setPublishingJob] = useState<string | null>(null);

  // Bid state (freelancer)
  const [bidAmounts, setBidAmounts] = useState<Record<string, number>>({});
  const [coverLetters, setCoverLetters] = useState<Record<string, string>>({});
  const [submittingBid, setSubmittingBid] = useState<string | null>(null);

  // Dispute resolution state
  const [clientPayout, setClientPayout] = useState(0);
  const [freelancerPayout, setFreelancerPayout] = useState(0);
  const [arbiterNotes, setArbiterNotes] = useState('');
  const [resolvingDisputeId, setResolvingDisputeId] = useState<string | null>(null);

  // Local static mock datasets for zero API dependency
  const MOCK_JOBS = [
    {
      _id: "job-1001",
      title: "Build Responsive React Landing Page",
      description: "Looking for an expert to design and develop a single page React application with premium styles and responsive layout.",
      budget: 300,
      tokenType: "XLM",
      status: "in_progress",
      createdAt: "2026-06-20T10:00:00.000Z",
      applications: [
        { id: "app-1", bidder: "Alex Rivera", bidAmount: 300, coverLetter: "I specialize in premium React UI layout design and have worked on similar Stellar apps." }
      ]
    },
    {
      _id: "job-1002",
      title: "Soroban Smart Contract Audit",
      description: "Security review and penetration testing for Stellar Soroban contract vault. Needs Rust/WASM experience.",
      budget: 500,
      tokenType: "XLM",
      status: "completed",
      createdAt: "2026-06-15T09:00:00.000Z",
      applications: []
    },
    {
      _id: "job-1003",
      title: "UI Animation System Integration",
      description: "Create premium CSS & Framer Motion animation presets for a web3 platform landing page.",
      budget: 400,
      tokenType: "XLM",
      status: "in_progress",
      createdAt: "2026-06-25T11:00:00.000Z",
      applications: []
    }
  ];

  const MOCK_ESCROWS = [
    {
      _id: "ESC-1001",
      id: "ESC-1001",
      job: { title: "Build Landing Page" },
      jobTitle: "Build Landing Page",
      buyerAddress: "GBXPKM7VSKBKX5JKJHLXQWRX6IQZP3D4ZQKZLM2NFTD8RWKPHJCXYZ",
      sellerAddress: "GDKPQN5XCZK8MNBRTV2HJMWLQZXUYJP6RSVTQHWFM3BKZEPD4CQWVLH",
      clientName: "Priya Shah",
      freelancerName: "Alex Rivera",
      freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      amount: 300,
      amountLocked: 300,
      tokenType: "XLM",
      status: "IN_PROGRESS",
      deadline: "2026-07-15T00:00:00Z",
      createdAt: "2026-06-20T10:30:00Z"
    },
    {
      _id: "ESC-1002",
      id: "ESC-1002",
      job: { title: "Smart Contract Audit" },
      jobTitle: "Smart Contract Audit",
      buyerAddress: "GBXPKM7VSKBKX5JKJHLXQWRX6IQZP3D4ZQKZLM2NFTD8RWKPHJCXYZ",
      sellerAddress: "GDKPQN5XCZK8MNBRTV2HJMWLQZXUYJP6RSVTQHWFM3BKZEPD4CQWVLH",
      clientName: "Priya Shah",
      freelancerName: "Elena Rostova",
      freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      amount: 500,
      amountLocked: 500,
      tokenType: "XLM",
      status: "DELIVERED",
      deadline: "2026-07-01T00:00:00Z",
      createdAt: "2026-06-15T09:15:00Z"
    },
    {
      _id: "ESC-1003",
      id: "ESC-1003",
      job: { title: "UI Animation System" },
      jobTitle: "UI Animation System",
      buyerAddress: "GBXPKM7VSKBKX5JKJHLXQWRX6IQZP3D4ZQKZLM2NFTD8RWKPHJCXYZ",
      sellerAddress: "GDKPQN5XCZK8MNBRTV2HJMWLQZXUYJP6RSVTQHWFM3BKZEPD4CQWVLH",
      clientName: "Priya Shah",
      freelancerName: "Alex Rivera",
      freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      amount: 400,
      amountLocked: 400,
      tokenType: "XLM",
      status: "COMPLETED",
      deadline: "2026-06-30T00:00:00Z",
      createdAt: "2026-06-25T11:00:00Z"
    }
  ];

  const MOCK_TRANSACTIONS = [
    {
      _id: "tx-1",
      escrowId: "ESC-1001",
      createdAt: "2026-06-20T10:30:00Z",
      status: "FUNDED",
      amount: 300,
      platformFee: 1.5,
      totalPaid: 301.5,
      transactionHash: "000000000000000000000000000000000000000000000000000000000000tx1hash",
      clientWallet: "GBXPKM7VSKBKX5JKJHLXQWRX6IQZP3D4ZQKZLM2NFTD8RWKPHJCXYZ"
    },
    {
      _id: "tx-2",
      escrowId: "ESC-1002",
      createdAt: "2026-06-15T09:15:00Z",
      status: "RELEASED",
      amount: 500,
      platformFee: 2.5,
      totalPaid: 502.5,
      transactionHash: "000000000000000000000000000000000000000000000000000000000000tx2hash",
      clientWallet: "GBXPKM7VSKBKX5JKJHLXQWRX6IQZP3D4ZQKZLM2NFTD8RWKPHJCXYZ"
    }
  ];


  const MOCK_DISPUTES = [
    {
      _id: "disp-1",
      escrow: { id: "ESC-1004", amount: 1500, job: { title: "DEX Protocol Integration" } },
      client: { name: "Priya Shah" },
      freelancer: { name: "Alex Rivera" },
      status: "open",
      reason: "Late milestone delivery dispute",
      createdAt: "2026-06-24T12:00:00.000Z"
    }
  ];

  // Load all data
  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    // Simulate instant mock data loading without calling Axios
    if (user.role === 'CLIENT') {
      setMyJobs(MOCK_JOBS);
      setEscrows(MOCK_ESCROWS);
      setProjectTransactions(MOCK_TRANSACTIONS);
    } else if (user.role === 'FREELANCER') {
      setJobs(MOCK_JOBS);
      setTotalPages(1);
      setEscrows(MOCK_ESCROWS);
    } else if (user.role === 'ARBITRATOR' || user.role === 'ADMIN') {
      setDisputes(MOCK_DISPUTES);
      setEscrows(MOCK_ESCROWS);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Search/filter jobs (freelancer)
  const handleSearch = async () => {
    setSearching(true);
    setPage(1);
    const filtered = MOCK_JOBS.filter(job => {
      const matchSearch = search ? job.title.toLowerCase().includes(search.toLowerCase()) || job.description.toLowerCase().includes(search.toLowerCase()) : true;
      const matchToken = filterToken ? job.tokenType === filterToken : true;
      const matchMin = filterMinBudget ? job.budget >= Number(filterMinBudget) : true;
      const matchMax = filterMaxBudget ? job.budget <= Number(filterMaxBudget) : true;
      return matchSearch && matchToken && matchMin && matchMax;
    });
    setJobs(filtered);
    setSearching(false);
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
  };

  // Create/edit job
  const openNewJobForm = () => {
    setEditingJob(null);
    setJobTitle('');
    setJobDesc('');
    setJobBudget(100);
    setJobToken('XLM');
    setShowJobForm(true);
  };

  const openEditJobForm = (job: any) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobDesc(job.description);
    setJobBudget(job.budget);
    setJobToken(job.tokenType);
    setShowJobForm(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingJob(true);
    const mockNewJob = {
      _id: editingJob ? editingJob._id : 'job-' + Date.now(),
      title: jobTitle,
      description: jobDesc,
      budget: jobBudget,
      tokenType: jobToken,
      status: editingJob ? editingJob.status : 'draft',
      createdAt: editingJob ? editingJob.createdAt : new Date().toISOString(),
      applications: []
    };
    if (editingJob) {
      setMyJobs(prev => prev.map(j => j._id === editingJob._id ? mockNewJob : j));
    } else {
      setMyJobs(prev => [mockNewJob, ...prev]);
    }
    setShowJobForm(false);
    setSavingJob(false);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Delete this job and all its applications?')) return;
    setDeletingJob(jobId);
    setMyJobs(prev => prev.filter(j => j._id !== jobId));
    setDeletingJob(null);
  };

  const handlePublishJob = async (jobId: string) => {
    setPublishingJob(jobId);
    setMyJobs(prev => prev.map(j => j._id === jobId ? { ...j, status: 'open' } : j));
    setPublishingJob(null);
  };

  // Apply to job (freelancer)
  const handleApply = async (jobId: string) => {
    const bid = bidAmounts[jobId] || 50;
    const letter = coverLetters[jobId] || '';
    if (!letter) { alert('Cover letter is required'); return; }
    setSubmittingBid(jobId);
    alert('Application submitted successfully! (Simulation)');
    setCoverLetters(prev => ({ ...prev, [jobId]: '' }));
    setSubmittingBid(null);
  };

  // Resolve dispute (arbitrator)
  const handleResolveDispute = async (disputeId: string, totalAmount: number) => {
    if (clientPayout + freelancerPayout !== totalAmount) {
      alert(`Split payouts must equal total escrow: ${totalAmount} XLM`);
      return;
    }
    setResolvingDisputeId(disputeId);
    setDisputes(prev => prev.filter(d => d._id !== disputeId));
    alert('Dispute resolved successfully! (Simulation)');
    setResolvingDisputeId(null);
  };

  if (!user) return null;

  const tabTitle: Record<string, string> = {
    overview: `${user.role} Dashboard`,
    jobs: user.role === 'FREELANCER' ? 'Browse Jobs' : 'My Jobs',
    escrows: user.role === 'FREELANCER' ? 'My Contracts' : 'My Escrows',
    payments: user.role === 'FREELANCER' ? 'Earnings' : 'Payments',
    reviews: user.role === 'FREELANCER' ? 'Reputation' : 'Reviews',
    settings: 'Settings',
    disputes: 'Resolve Disputes',
  };

  return (
    <AppLayout title={tabTitle[activeTab] || 'Dashboard'}>
      <div className="space-y-6">

        {/* ============ OVERVIEW TAB ============ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Client Overview */}
            {user.role === 'CLIENT' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { label: 'Active Escrows', value: escrows.filter(e => !['COMPLETED','REFUNDED'].includes(e.status)).length, icon: Shield, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Completed', value: escrows.filter(e => e.status === 'COMPLETED').length, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'Funds Locked (XLM)', value: escrows.reduce((s,e) => !['COMPLETED','REFUNDED'].includes(e.status) ? s + e.amount : s, 0).toLocaleString(), icon: Lock, color: 'text-purple-600 bg-purple-50' },
                    { label: 'Pending Review', value: escrows.filter(e => e.status === 'DELIVERED').length, icon: Eye, color: 'text-amber-600 bg-amber-50' },
                  ].map(stat => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-sm">
                      <div className={`w-9 h-9 rounded-[8px] ${stat.color} flex items-center justify-center mb-3`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">{stat.label}</p>
                      <p className="text-xl font-bold text-[#0F172A] mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Quick Actions</h3>
                    <Link to="/jobs" className="text-xs text-[#5B6BF8] font-semibold hover:underline">Manage Jobs →</Link>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/jobs" className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#5B6BF8] text-white text-xs font-bold hover:bg-[#4757E8] transition-all">
                      <Briefcase className="w-3.5 h-3.5" /> Post a Job
                    </Link>
                    <Link to="/escrow/new" className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#0F172A] text-white text-xs font-bold hover:bg-[#1E293B] transition-all">
                      <PlusCircle className="w-3.5 h-3.5" /> Create Escrow
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Freelancer Overview */}
            {user.role === 'FREELANCER' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { label: 'Earnings (XLM)', value: escrows.reduce((s,e) => e.status === 'COMPLETED' ? s + e.amount : s, 0).toLocaleString(), icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'Active Contracts', value: escrows.filter(e => !['COMPLETED','REFUNDED'].includes(e.status)).length, icon: Shield, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Trust Score', value: `${user.trustScore}/100`, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
                    { label: 'Badge', value: user.badge, icon: Award, color: 'text-amber-600 bg-amber-50' },
                  ].map(stat => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-sm">
                      <div className={`w-9 h-9 rounded-[8px] ${stat.color} flex items-center justify-center mb-3`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">{stat.label}</p>
                      <p className="text-xl font-bold text-[#0F172A] mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Work Orders</h3>
                    <Link to="/jobs" className="text-xs text-[#5B6BF8] font-semibold hover:underline">Browse Jobs →</Link>
                  </div>
                  {escrows.filter(e => ['FUNDED','IN_PROGRESS'].includes(e.status)).length === 0
                    ? <p className="text-xs text-gray-400 italic">No active work orders. Browse open jobs to apply.</p>
                    : escrows.filter(e => ['FUNDED','IN_PROGRESS'].includes(e.status)).map(e => (
                        <div key={e._id} className="flex items-center justify-between border border-[#E5E7EB] rounded-[12px] p-4 bg-[#FAFAFA] mb-3">
                          <div>
                            <p className="text-xs font-bold text-[#0F172A]">{e.job?.title || 'Milestone Task'}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Locked: {e.amount} {e.tokenType}</p>
                          </div>
                          <Link to={`/escrow/${e._id}`} className="px-3.5 py-1.5 rounded-[8px] bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9]">Submit Work</Link>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {/* Arbitrator Overview */}
            {(user.role === 'ARBITRATOR' || user.role === 'ADMIN') && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { label: 'Open Cases', value: disputes.filter(d => d.status !== 'resolved').length, color: 'text-red-500' },
                    { label: 'Resolved Cases', value: disputes.filter(d => d.status === 'resolved').length, color: 'text-emerald-600' },
                    { label: 'Total Disputes', value: disputes.length, color: 'text-[#0F172A]' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-sm">
                      <p className="text-[10px] uppercase font-bold text-gray-400">{stat.label}</p>
                      <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Disputes Queue</h3>
                  {disputes.filter(d => d.status !== 'resolved').length === 0
                    ? <p className="text-xs text-gray-400 italic">No open dispute cases. Queue is clear.</p>
                    : disputes.filter(d => d.status !== 'resolved').slice(0, 3).map(d => (
                        <div key={d._id} className="flex items-center justify-between border border-[#E5E7EB] rounded-[12px] p-4 bg-[#FAFAFA] mb-3">
                          <div>
                            <p className="text-xs font-bold text-[#0F172A]">{d.escrow?.job?.title || 'Dispute'}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Amount: {d.escrow?.amount} XLM</p>
                          </div>
                          <Link to="/disputes" className="px-3.5 py-1.5 rounded-[8px] bg-[#0F172A] text-white text-xs font-bold hover:bg-[#1E293B]">Resolve</Link>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ JOBS TAB ============ */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* CLIENT: My Jobs list with CRUD */}
            {user.role === 'CLIENT' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0F172A]">My Job Postings</h3>
                  <button onClick={openNewJobForm} className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#5B6BF8] text-white text-xs font-bold hover:bg-[#4757E8] transition-all">
                    <PlusCircle className="w-3.5 h-3.5" /> New Job
                  </button>
                </div>

                {/* Job Create/Edit Form */}
                <AnimatePresence>
                  {showJobForm && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white border border-[#5B6BF8]/30 rounded-[16px] p-6 shadow-md"
                    >
                      <h4 className="text-sm font-bold text-[#0F172A] mb-4">{editingJob ? 'Edit Job' : 'Create New Job'}</h4>
                      <form onSubmit={handleSaveJob} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Project Title</label>
                          <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required placeholder="UI/UX Design for Stellar App"
                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[8px] text-xs focus:outline-none focus:ring-1 focus:ring-[#5B6BF8]" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</label>
                          <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} required rows={3} placeholder="Detailed project requirements..."
                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[8px] text-xs focus:outline-none focus:ring-1 focus:ring-[#5B6BF8] resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Budget</label>
                            <input type="number" value={jobBudget} onChange={e => setJobBudget(Number(e.target.value))} required
                              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[8px] text-xs focus:outline-none focus:ring-1 focus:ring-[#5B6BF8]" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Token</label>
                            <select value={jobToken} onChange={e => setJobToken(e.target.value as any)}
                              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[8px] text-xs focus:outline-none focus:ring-1 focus:ring-[#5B6BF8]">
                              <option value="XLM">XLM</option>
                              <option value="USDC">USDC</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button type="submit" disabled={savingJob}
                            className="flex-1 py-2.5 rounded-[8px] bg-[#5B6BF8] text-white text-xs font-bold hover:bg-[#4757E8] disabled:opacity-40 transition-all">
                            {savingJob ? 'Saving...' : editingJob ? 'Update Job' : 'Save as Draft'}
                          </button>
                          <button type="button" onClick={() => setShowJobForm(false)}
                            className="px-4 py-2.5 rounded-[8px] border border-[#E5E7EB] text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Jobs List */}
                {myJobs.length === 0
                  ? (
                    <div className="text-center py-16 bg-white border border-dashed border-[#E5E7EB] rounded-[16px]">
                      <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-gray-400">No jobs yet</p>
                      <p className="text-xs text-gray-400 mt-1">Create your first job posting to attract freelancers.</p>
                      <button onClick={openNewJobForm} className="mt-4 px-4 py-2 rounded-[8px] bg-[#5B6BF8] text-white text-xs font-bold">Post a Job</button>
                    </div>
                  )
                  : (
                    <div className="grid gap-4">
                      {myJobs.map(job => (
                        <motion.div key={job._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_COLOR[job.status]}`}>{job.status}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{job.tokenType}</span>
                              </div>
                              <h4 className="text-sm font-bold text-[#0F172A]">{job.title}</h4>
                              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{job.description}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-bold text-[#0F172A]">{job.budget} {job.tokenType}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E5E7EB]">
                            {job.status === 'draft' && (
                              <button onClick={() => handlePublishJob(job._id)} disabled={publishingJob === job._id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 disabled:opacity-40 transition-all">
                                <CheckCircle className="w-3 h-3" />
                                {publishingJob === job._id ? 'Publishing...' : 'Publish'}
                              </button>
                            )}
                            {['draft', 'open'].includes(job.status) && (
                              <>
                                <button onClick={() => openEditJobForm(job)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white border border-[#E5E7EB] text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
                                  <Edit3 className="w-3 h-3" /> Edit
                                </button>
                                <button onClick={() => handleDeleteJob(job._id)} disabled={deletingJob === job._id}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white border border-red-200 text-xs font-bold text-red-500 hover:bg-red-50 disabled:opacity-40 transition-all">
                                  <Trash2 className="w-3 h-3" />
                                  {deletingJob === job._id ? 'Deleting...' : 'Delete'}
                                </button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )
                }
              </div>
            )}

            {/* FREELANCER: Browse Jobs with search, filter, pagination */}
            {user.role === 'FREELANCER' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#0F172A]">Browse Open Projects</h3>

                {/* Search & Filters */}
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-4 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2 relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="Search jobs by title or description..."
                        className="w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-[8px] text-xs focus:outline-none focus:ring-1 focus:ring-[#5B6BF8]" />
                    </div>
                    <select value={filterToken} onChange={e => setFilterToken(e.target.value)}
                      className="px-3 py-2 border border-[#E5E7EB] rounded-[8px] text-xs focus:outline-none focus:ring-1 focus:ring-[#5B6BF8]">
                      <option value="">All Tokens</option>
                      <option value="XLM">XLM</option>
                      <option value="USDC">USDC</option>
                    </select>
                    <div className="flex gap-2">
                      <input type="number" value={filterMinBudget} onChange={e => setFilterMinBudget(e.target.value)} placeholder="Min budget"
                        className="flex-1 px-2 py-2 border border-[#E5E7EB] rounded-[8px] text-xs focus:outline-none focus:ring-1 focus:ring-[#5B6BF8]" />
                      <input type="number" value={filterMaxBudget} onChange={e => setFilterMaxBudget(e.target.value)} placeholder="Max"
                        className="flex-1 px-2 py-2 border border-[#E5E7EB] rounded-[8px] text-xs focus:outline-none focus:ring-1 focus:ring-[#5B6BF8]" />
                    </div>
                  </div>
                  <button onClick={handleSearch} disabled={searching}
                    className="mt-3 flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#5B6BF8] text-white text-xs font-bold hover:bg-[#4757E8] disabled:opacity-40 transition-all">
                    <Filter className="w-3.5 h-3.5" />
                    {searching ? 'Searching...' : 'Apply Filters'}
                  </button>
                </div>

                {/* Job Cards */}
                {jobs.length === 0
                  ? (
                    <div className="text-center py-16 bg-white border border-dashed border-[#E5E7EB] rounded-[16px]">
                      <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-gray-400">No jobs match your criteria</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters.</p>
                    </div>
                  )
                  : (
                    <div className="grid gap-4">
                      {jobs.map(job => (
                        <div key={job._id} className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-bold text-[#0F172A]">{job.title}</h4>
                              <p className="text-[11px] text-gray-400 mt-1">Client: {job.client?.username} · Trust: {job.client?.trustScore}%</p>
                            </div>
                            <span className="text-xs font-bold text-[#5B6BF8] bg-[#5B6BF8]/10 px-3 py-1 rounded-full">{job.budget} {job.tokenType}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-3 leading-relaxed">{job.description}</p>
                          <div className="border-t border-[#E5E7EB] pt-4 mt-4">
                            <div className="flex items-end gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Your Bid</label>
                                <input type="number" value={bidAmounts[job._id] || 50}
                                  onChange={e => setBidAmounts(prev => ({ ...prev, [job._id]: Number(e.target.value) }))}
                                  className="w-24 px-2 py-1.5 border border-[#E5E7EB] rounded-[6px] text-xs focus:outline-none" />
                              </div>
                              <div className="flex-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cover Letter</label>
                                <input type="text" value={coverLetters[job._id] || ''}
                                  onChange={e => setCoverLetters(prev => ({ ...prev, [job._id]: e.target.value }))}
                                  placeholder="Briefly describe your approach..."
                                  className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded-[6px] text-xs focus:outline-none" />
                              </div>
                              <button onClick={() => handleApply(job._id)} disabled={submittingBid === job._id}
                                className="px-4 py-2 rounded-[8px] bg-[#5B6BF8] text-white text-xs font-bold hover:bg-[#4757E8] disabled:opacity-40 transition-all whitespace-nowrap">
                                {submittingBid === job._id ? 'Applying...' : 'Apply Now'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                }

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}
                      className="p-2 rounded-[8px] border border-[#E5E7EB] text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-gray-600">Page {page} of {totalPages}</span>
                    <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}
                      className="p-2 rounded-[8px] border border-[#E5E7EB] text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============ ESCROWS TAB ============ */}
        {activeTab === 'escrows' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A]">{user.role === 'FREELANCER' ? 'My Active Contracts' : 'My Escrow Contracts'}</h3>
            {escrows.length === 0
              ? (
                <div className="text-center py-16 bg-white border border-dashed border-[#E5E7EB] rounded-[16px]">
                  <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-400">No escrow contracts yet</p>
                  {user.role === 'CLIENT' && <Link to="/escrow/new" className="mt-4 inline-block px-4 py-2 rounded-[8px] bg-[#5B6BF8] text-white text-xs font-bold">Create Escrow</Link>}
                </div>
              )
              : (
                <div className="grid gap-3">
                  {escrows.map(e => (
                    <div key={e._id} className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_COLOR[e.status]}`}>{e.status}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#0F172A]">{e.job?.title || 'Stellar Contract'}</h4>
                        <p className="text-[10px] font-mono text-gray-400 mt-0.5 truncate max-w-[200px]">{e.contractId}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs font-bold text-[#0F172A]">{e.amount} {e.tokenType}</span>
                        <Link to={`/escrow/${e._id}`} className="px-3.5 py-1.5 rounded-[8px] bg-white border border-[#E5E7EB] text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
                          Manage →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}

        {/* ============ PAYMENTS TAB ============ */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A]">{user.role === 'FREELANCER' ? 'Earnings History' : 'Payment History'}</h3>
            
            {user.role === 'CLIENT' ? (
              // CLIENT payment history: Transactions list
              projectTransactions.length === 0 ? (
                <div className="text-center py-16 bg-white border border-dashed border-[#E5E7EB] rounded-[16px]">
                  <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-400">No payment history yet</p>
                  <p className="text-xs text-gray-400 mt-1">Once you fund an escrow contract, transactions will appear here.</p>
                </div>
              ) : (
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-sm overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F8F9FB] border-b border-[#E5E7EB]">
                      <tr>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Escrow ID</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Date</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Status</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Budget</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Fee</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Total Paid</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {projectTransactions.map(tx => (
                        <tr 
                          key={tx._id} 
                          onClick={() => setSelectedTx(tx)}
                          className="hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                        >
                          <td className="px-5 py-3.5 font-bold text-[#0F172A] font-mono">{tx.escrowId}</td>
                          <td className="px-5 py-3.5 text-slate-500">{new Date(tx.date || tx.createdAt).toLocaleDateString()}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              tx.status === 'RELEASED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              tx.status === 'REFUNDED' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                              'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-mono font-semibold text-slate-700">{tx.amount} XLM</td>
                          <td className="px-5 py-3.5 font-mono text-slate-500">{tx.platformFee} XLM</td>
                          <td className="px-5 py-3.5 font-mono font-bold text-[#7C3AED]">{tx.totalPaid} XLM</td>
                          <td className="px-5 py-3.5 text-right font-bold text-[#7C3AED] hover:underline">
                            View →
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              // FREELANCER (legacy earnings / escrows)
              escrows.length === 0 ? (
                <div className="text-center py-16 bg-white border border-dashed border-[#E5E7EB] rounded-[16px]">
                  <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-400">No payment history yet</p>
                </div>
              ) : (
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-sm overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F8F9FB] border-b border-[#E5E7EB]">
                      <tr>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Project</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Status</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Amount</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {escrows.map(e => (
                        <tr key={e._id} className="hover:bg-[#FAFAFA] transition-colors">
                          <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{e.job?.title || 'Contract'}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_COLOR[e.status]}`}>{e.status}</span>
                          </td>
                          <td className="px-5 py-3.5 font-mono font-bold">{e.amount} {e.tokenType}</td>
                          <td className="px-5 py-3.5 text-right">
                            <Link to={`/escrow/${e._id}`} className="text-[#5B6BF8] font-bold hover:underline">View →</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        )}

        {/* ============ REVIEWS TAB ============ */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-sm">
                <p className="text-[10px] uppercase font-bold text-gray-400">Trust Score</p>
                <p className="text-3xl font-bold text-[#0F172A] mt-1">{user.trustScore}<span className="text-sm text-gray-400">/100</span></p>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-sm">
                <p className="text-[10px] uppercase font-bold text-gray-400">Badge Level</p>
                <p className="text-xl font-bold mt-1">
                  {user.badge === 'Platinum' && <span className="text-[#E5E4E2]">⬡</span>}
                  {user.badge === 'Gold' && <span className="text-amber-400">⬡</span>}
                  {user.badge === 'Silver' && <span className="text-gray-400">⬡</span>}
                  {user.badge === 'Bronze' && <span className="text-orange-700">⬡</span>}
                  <span className="ml-1 text-[#0F172A]">{user.badge}</span>
                </p>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-sm">
                <p className="text-[10px] uppercase font-bold text-gray-400">Completed Jobs</p>
                <p className="text-3xl font-bold text-[#0F172A] mt-1">{escrows.filter(e => e.status === 'COMPLETED').length}</p>
              </div>
            </div>
            {reviews.length === 0
              ? (
                <div className="text-center py-16 bg-white border border-dashed border-[#E5E7EB] rounded-[16px]">
                  <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-400">No reviews yet</p>
                  <p className="text-xs text-gray-400 mt-1">Reviews will appear after completed escrow contracts.</p>
                </div>
              ) : null
            }
          </div>
        )}

        {/* ============ SETTINGS TAB ============ */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-xl">
            <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#0F172A] mb-4">Account Information</h3>
              <div className="space-y-3">
                {[
                  { label: 'Username', value: user.username || '—' },
                  { label: 'Email', value: user.email || '—' },
                  { label: 'Role', value: user.role },
                  { label: 'Wallet Address', value: user.walletAddress, mono: true },
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between py-2 border-b border-[#E5E7EB] last:border-0">
                    <span className="text-[10px] uppercase font-bold text-gray-400">{f.label}</span>
                    <span className={`text-xs font-semibold text-[#0F172A] ${f.mono ? 'font-mono text-[10px]' : ''} max-w-[220px] truncate`}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#0F172A] mb-2">Notification Preferences</h3>
              <p className="text-xs text-gray-400">Real-time Socket.IO notifications are always enabled for escrow events and messages.</p>
            </div>
          </div>
        )}

        {/* ============ DISPUTES TAB (Arbitrator/Admin) ============ */}
        {activeTab === 'disputes' && (user.role === 'ARBITRATOR' || user.role === 'ADMIN') && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-[#0F172A]">Open Dispute Cases</h3>
            {disputes.filter(d => d.status !== 'resolved').length === 0
              ? (
                <div className="text-center py-16 bg-white border border-dashed border-[#E5E7EB] rounded-[16px]">
                  <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-400">No open disputes</p>
                </div>
              )
              : disputes.filter(d => d.status !== 'resolved').map(d => (
                <div key={d._id} className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-sm grid md:grid-cols-[1fr_280px] gap-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-[#0F172A]">{d.escrow?.job?.title || 'Dispute'}</h4>
                    <p className="text-[10px] text-gray-400">Raised by: {d.raisedBy?.username} · Reason: {d.reason}</p>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Evidence</p>
                      {d.evidence?.map((ev: any, idx: number) => (
                        <div key={idx} className="border border-[#E5E7EB] rounded-[8px] p-3 text-xs bg-[#FAFAFA]">
                          <p className="font-semibold text-gray-600">{ev.type?.toUpperCase()}: {ev.content}</p>
                          {ev.url && <a href={ev.url} target="_blank" rel="noreferrer" className="text-blue-500 underline mt-1 block">View Resource</a>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-l border-[#E5E7EB] pl-6 space-y-4">
                    <h4 className="text-xs font-bold text-[#0F172A]">Settlement Split</h4>
                    <p className="text-[10px] text-gray-400">Total locked: {d.escrow?.amount} XLM</p>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">To Client (XLM)</label>
                        <input type="number" value={clientPayout} onChange={e => setClientPayout(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 border border-[#E5E7EB] rounded-[6px] text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">To Freelancer (XLM)</label>
                        <input type="number" value={freelancerPayout} onChange={e => setFreelancerPayout(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 border border-[#E5E7EB] rounded-[6px] text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Decision Notes</label>
                        <input type="text" value={arbiterNotes} onChange={e => setArbiterNotes(e.target.value)} placeholder="Reason for split..."
                          className="w-full px-2.5 py-1.5 border border-[#E5E7EB] rounded-[6px] text-xs" />
                      </div>
                    </div>
                    <button onClick={() => handleResolveDispute(d._id, d.escrow?.amount)} disabled={resolvingDisputeId === d._id}
                      className="w-full py-2.5 rounded-[8px] bg-[#10B981] text-white text-xs font-bold hover:bg-[#059669] disabled:opacity-40 transition-all">
                      {resolvingDisputeId === d._id ? 'Executing...' : 'Execute Payout Split'}
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

      </div>

      {/* TRANSACTION DETAILS MODAL */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col p-6 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">Transaction Receipt</h3>
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded ${
                    selectedTx.status === 'RELEASED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    selectedTx.status === 'REFUNDED' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                    'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                    {selectedTx.status}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-medium">Escrow ID:</span>
                  <span className="font-mono font-bold text-slate-800 select-all">{selectedTx.escrowId}</span>
                </div>

                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-medium">Stellar Tx Hash:</span>
                  <a 
                    href={`https://stellar.expert/explorer/testnet/tx/${selectedTx.transactionHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[#7C3AED] hover:underline flex items-center gap-1 shrink-0"
                  >
                    {selectedTx.transactionHash.slice(0, 10)}...{selectedTx.transactionHash.slice(-8)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-medium">Client Wallet:</span>
                  <span className="font-mono text-slate-500 select-all shrink-0">
                    {selectedTx.clientWallet.slice(0, 10)}...{selectedTx.clientWallet.slice(-8)}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-medium">Date & Time:</span>
                  <span className="font-bold text-slate-700">
                    {new Date(selectedTx.date || selectedTx.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="pt-3 space-y-2 bg-[#FAF9FF] p-4 rounded-xl border border-[#7C3AED]/5 font-medium">
                  <div className="flex justify-between text-slate-600">
                    <span>Budget Amount:</span>
                    <span className="font-mono font-bold">{selectedTx.amount} XLM</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Platform Fee (0.5%):</span>
                    <span className="font-mono">{selectedTx.platformFee} XLM</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E2E8F0] pt-2 text-[#0F172A] font-bold text-sm">
                    <span>Total Amount Paid:</span>
                    <span className="font-mono text-[#7C3AED] font-black">{selectedTx.totalPaid} XLM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
