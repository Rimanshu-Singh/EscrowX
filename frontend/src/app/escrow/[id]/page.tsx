import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Copy, CheckCircle2, ShieldAlert, Lock, Clock, Calendar, Star, AlertCircle, PlusCircle, RefreshCw, AlertTriangle, Play
} from 'lucide-react';
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout';
import { useAuthStore } from '../../../store/authStore';
import { escrowService, disputeService, reviewService, escrowUpdateService } from '../../../services/api';
import { FundEscrowModal } from '../../../components/escrow/FundEscrowModal';
import { useEscrowContract } from '../../../hooks/useEscrowContract';
import { EscrowGuidance } from '../../../components/shared/EscrowGuidance';
import { InfoTooltip } from '../../../components/shared/InfoTooltip';

const TIMELINE_STEPS = [
  { key: 'CREATED', label: 'Created' },
  { key: 'FUNDED', label: 'Funded' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'COMPLETED', label: 'Complete' },
];

const STATUS_ORDER = ['CREATED', 'FUNDED', 'IN_PROGRESS', 'DELIVERED', 'COMPLETED'];

// Contact info sharing regex validator helper
const hasContactInfo = (text: string): boolean => {
  if (!text) return false;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
  const consecutiveDigitsRegex = /\b\d{8,15}\b/;
  const contactKeywordsRegex = /(whatsapp|telegram|discord|t\.me|wa\.me|discord\.gg|calendly|skype|zoom)/i;

  return emailRegex.test(text) || 
         phoneRegex.test(text) || 
         consecutiveDigitsRegex.test(text) || 
         contactKeywordsRegex.test(text);
};

export default function EscrowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token, walletAddress } = useAuthStore();
  const { approveDelivery, raiseDispute, markInProgress } = useEscrowContract();

  // Escrow funding modal states
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [currentEscrowId, setCurrentEscrowId] = useState('');
  const [currentAmountXLM, setCurrentAmountXLM] = useState('');

  // Auth Guard redirect
  useEffect(() => {
    if (!token || !user) {
      navigate('/auth/login');
    }
  }, [token, user, navigate]);

  const [copiedId, setCopiedId] = useState(false);
  const [loading, setLoading] = useState(true);

  // Escrow Workspace states
  const [escrow, setEscrow] = useState<any>(null);
  const [delivery, setDelivery] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);

  // Post update fields
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [submittingUpdate, setSubmittingUpdate] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Review update field
  const [revisionNotes, setRevisionNotes] = useState<{ [key: string]: string }>({});
  const [showRevisionInput, setShowRevisionInput] = useState<string | null>(null);

  // Review escrow rating fields
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Dispute form state
  const [disputeReason, setDisputeReason] = useState('');
  const [raisingDispute, setRaisingDispute] = useState(false);

  // Load details from backend
  const loadWorkspaceDetails = async () => {
    if (!id) return;
    try {
      const data = await escrowService.getEscrow(id);
      setEscrow(data.escrow);
      setDelivery(data.delivery);
      setTransactions(data.transactions);
      
      // Fetch structured updates
      const updateData = await escrowUpdateService.getUpdates(id);
      setUpdates(updateData);

      try {
        const reviewsData = await reviewService.getEscrowReviews(id);
        setReviews(reviewsData);
      } catch (revErr) {
        console.error('Error fetching reviews:', revErr);
      }
    } catch (err) {
      console.error('Error loading escrow workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceDetails();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7C3AED]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!escrow) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto text-center py-12 bg-white border border-[#E4E8F0] rounded-xl shadow-sm space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-sm font-bold text-[#0F172A]">Escrow Not Found</h3>
          <p className="text-xs text-[#64748B]">This escrow workspace does not exist or has been removed.</p>
          <Link to="/dashboard" className="text-xs text-[#7C3AED] underline mt-3 inline-block">Back to Dashboard</Link>
        </div>
      </DashboardLayout>
    );
  }

  const isClient = user?.id === escrow.client?._id || user?.id === escrow.client?.id;
  const isFreelancer = user?.id === escrow.freelancer?._id || user?.id === escrow.freelancer?.id;

  const currentStatusIndex = STATUS_ORDER.indexOf(
    ['DISPUTED', 'REFUNDED'].includes(escrow.status) ? 'FUNDED' : escrow.status
  );

  const handleCopyId = () => {
    navigator.clipboard.writeText(escrow.contractId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  // Client funds contract on-chain
  const handleFund = async () => {
    try {
      const txHash = 'mock_stellar_deposit_tx_hash_' + Math.random().toString(36).slice(2);
      await escrowService.fundEscrow(escrow._id, txHash);
      alert('Vault successfully funded on-chain!');
      loadWorkspaceDetails();
    } catch (err) {
      alert('Funding transaction failed');
    }
  };

  // Freelancer submits new progress update
  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);

    // Filter contact info
    if (hasContactInfo(updateTitle) || hasContactInfo(updateDescription)) {
      setUpdateError("External communication is not allowed. Please remove email addresses, phone numbers, or messaging links (WhatsApp, Telegram, Discord).");
      return;
    }

    setSubmittingUpdate(true);
    try {
      await escrowUpdateService.postUpdate(escrow._id, {
        title: updateTitle,
        description: updateDescription
      });
      alert('Workspace update posted successfully!');
      setUpdateTitle('');
      setUpdateDescription('');
      loadWorkspaceDetails();
    } catch (err: any) {
      setUpdateError(err.response?.data?.error || 'Failed to post update');
    } finally {
      setSubmittingUpdate(false);
    }
  };

  // Client reviews update (Approve / Request Revision)
  const handleReviewUpdate = async (updateId: string, action: 'approve' | 'revise') => {
    try {
      const notes = revisionNotes[updateId];
      if (action === 'revise' && !notes) {
        alert('Please provide revision notes explaining what needs to be changed.');
        return;
      }

      await escrowUpdateService.reviewUpdate(updateId, action, notes);
      alert(`Update status updated successfully!`);
      setShowRevisionInput(null);
      loadWorkspaceDetails();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Freelancer starts work on-chain
  const handleStartWork = async () => {
    try {
      const res = await markInProgress(escrow.contractId, walletAddress || '', escrow.freelancer?.walletAddress || '', escrow._id);
      if (res.success) {
        alert('Work started successfully on-chain! Status updated to In Progress.');
        loadWorkspaceDetails();
      } else {
        alert(`Failed to start work: ${res.error}`);
      }
    } catch (err) {
      alert('Failed to start work');
    }
  };

  // Client approves and releases payment (escrow completion)
  const handleApproveEscrow = async () => {
    if (!window.confirm("Are you sure you want to approve this project deliverables and release contract funds? This action is final.")) return;
    try {
      const res = await approveDelivery(escrow.contractId, walletAddress || '', escrow._id);
      if (res.success) {
        alert('Payment released successfully! Soroban contract closed.');
        loadWorkspaceDetails();
      } else {
        alert(`Failed to release payment: ${res.error}`);
      }
    } catch (err) {
      alert('Failed to release payment');
    }
  };

  // Raise dispute
  const handleRaiseDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason) return;
    setRaisingDispute(true);
    try {
      const res = await raiseDispute(escrow.contractId, walletAddress || '', escrow._id, disputeReason);
      if (res.success) {
        alert('Dispute raised successfully on-chain!');
        setDisputeReason('');
        loadWorkspaceDetails();
      } else {
        alert(`Failed to raise dispute: ${res.error}`);
      }
    } catch (err) {
      alert('Failed to raise dispute');
    } finally {
      setRaisingDispute(false);
    }
  };

  // Submit review
  const handleLeaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment) return;
    setSubmittingReview(true);
    try {
      await reviewService.submitReview({
        escrowId: escrow._id,
        rating: reviewRating,
        comment: reviewComment
      });
      alert('Review submitted successfully!');
      setReviewComment('');
      setReviewRating(5);
      loadWorkspaceDetails();
    } catch (err) {
      alert('Failed to submit review');
    }
    setSubmittingReview(false);
  };

  return (
    <DashboardLayout>
      <div className="min-w-0 space-y-6">
        {/* Back Link */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <button
            onClick={loadWorkspaceDetails}
            className="p-1.5 rounded-lg border border-[#E4E8F0] hover:bg-slate-50 text-[#64748B]"
            title="Refresh Workspace"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Workspace Title Card */}
        <div className="flex min-w-0 flex-col items-start justify-between gap-4 rounded-xl border border-[#E4E8F0] bg-white p-4 shadow-xs sm:p-6 md:flex-row md:items-center">
          <div className="min-w-0 space-y-1.5">
            <div className="flex min-w-0 items-center gap-2">
              <span className="min-w-0 truncate font-mono text-[9px] text-gray-400">Contract ID: {escrow.contractId}</span>
              <InfoTooltip label="Wallet">Your wallet signs escrow transactions, but funds only move when you approve an action.</InfoTooltip>
              <button onClick={handleCopyId} className="inline-flex min-h-8 min-w-8 items-center justify-center rounded p-1 transition-colors hover:bg-slate-50">
                <Copy className="w-3 h-3 text-gray-400" />
              </button>
              {copiedId && <span className="text-[9px] text-emerald-500 font-bold">Copied!</span>}
            </div>
            <h2 className="text-md break-words font-black tracking-tight text-[#0F172A]">Escrow Workspace #{escrow._id.slice(-6).toUpperCase()}</h2>
            <div className="inline-flex items-center gap-1.5">
              <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
                escrow.status === 'COMPLETED' ? 'bg-emerald-500 text-white' :
                escrow.status === 'DISPUTED' ? 'bg-red-500 text-white' :
                escrow.status === 'FUNDED' ? 'bg-[#7C3AED] text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                {escrow.status}
              </span>
              <InfoTooltip label="Transaction Status">Shows where this escrow is in the funding, work, review, release, refund, or dispute flow.</InfoTooltip>
            </div>
          </div>
          <div className="w-full text-left md:w-auto md:text-right">
            <p className="font-mono text-xl font-black text-[#0F172A]">{escrow.amount} {escrow.tokenType}</p>
            <div className="mt-0.5 flex items-center gap-1 md:justify-end">
              <p className="text-[10px] text-[#64748B] font-medium uppercase">Stellar locked contract</p>
              <InfoTooltip label="Escrow">Funds are securely held until the agreed milestone or work is approved.</InfoTooltip>
            </div>
          </div>
        </div>

        <EscrowGuidance status={escrow.status} />

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT & CENTER PANEL (span 9) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Stepper Steps */}
            <div className="rounded-xl border border-[#E4E8F0] bg-white p-4 shadow-xs sm:p-6">
              <h4 className="mb-5 text-[10px] font-black uppercase tracking-widest text-slate-400 sm:mb-6">Contract Status Stepper</h4>
              <div className="flex min-w-0 items-start justify-between overflow-hidden">
                {TIMELINE_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStatusIndex;
                  const isLast = idx === TIMELINE_STEPS.length - 1;
                  return (
                    <div key={step.key} className="flex min-w-0 flex-1 items-start last:flex-none">
                      <div className="flex min-w-0 flex-col items-center">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                          isDone ? 'bg-[#7C3AED] border-[#7C3AED] text-white' : 'bg-white border-[#E4E8F0] text-gray-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="mt-2 max-w-[58px] break-words text-center text-[9px] font-extrabold uppercase leading-tight tracking-normal text-slate-400 sm:max-w-none sm:tracking-wider">{step.label}</span>
                      </div>
                      {!isLast && (
                        <div className={`mx-1 mt-4 h-0.5 flex-1 sm:mx-2 ${idx < currentStatusIndex ? 'bg-[#7C3AED]' : 'bg-[#E4E8F0]'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Funding request (Client-only CREATED) */}
            {escrow.status === 'CREATED' && isClient && (
              <div className="bg-[#FAF9FF] border border-[#7C3AED]/10 rounded-xl p-6 text-center space-y-3.5">
                <Lock className="w-8 h-8 text-[#7C3AED] mx-auto" />
                <h4 className="text-xs font-bold text-[#0F172A]">Fund Escrow Vault</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Deploy and lock {escrow.amount} {escrow.tokenType} on the Stellar Soroban Ledger. This starts the project milestone flow.
                </p>
                <button
                  onClick={() => {
                    setCurrentEscrowId(escrow._id);
                    setCurrentAmountXLM(escrow.amount.toString());
                    setIsFundModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all shadow-sm cursor-pointer"
                >
                  Fund Contract Now
                </button>
              </div>
            )}

            {/* MIDDLE PANEL: TIMELINE UPDATES */}
            <div className="bg-white border border-[#E4E8F0] rounded-xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0F172A]">Structured Progress Updates</h3>
                <span className="text-[10px] text-slate-400 font-bold">{updates.length} Updates Posted</span>
              </div>

              {/* Updates Timeline List */}
              {updates.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 italic">
                  No work updates posted yet. Work history will show up here.
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#F1F5F9]">
                  {updates.map((up) => (
                    <div key={up._id} className="relative pl-7 space-y-2.5">
                      {/* Timeline dot */}
                      <span className={`absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        up.status === 'approved' ? 'bg-emerald-500' :
                        up.status === 'revision_requested' ? 'bg-amber-500' : 'bg-[#7C3AED]'
                      }`} />

                      <div className="bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl p-4.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Update #{up.updateNumber}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase ${
                            up.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                            up.status === 'revision_requested' ? 'bg-amber-50 text-amber-600' :
                            'bg-purple-50 text-[#7C3AED]'
                          }`}>{up.status === 'revision_requested' ? 'revision requested' : up.status}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#0F172A]">{up.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{up.description}</p>
                        <span className="text-[9px] text-slate-400 block pt-1">Posted on {new Date(up.createdAt).toLocaleString()}</span>

                        {up.status === 'revision_requested' && up.revisionNotes && (
                          <div className="bg-amber-50 border border-amber-100/55 rounded-lg p-3 text-[11px] text-amber-800 space-y-1 mt-2">
                            <span className="font-bold uppercase tracking-wider text-[8px] block">Client Revision Feedback:</span>
                            <p>{up.revisionNotes}</p>
                          </div>
                        )}

                        {/* Client Actions on Pending Updates */}
                        {isClient && up.status === 'pending' && (
                          <div className="mt-3 flex flex-col gap-2 border-t border-[#E2E8F0] pt-2 sm:flex-row">
                            <button
                              onClick={() => handleReviewUpdate(up._id, 'approve')}
                              className="min-h-10 flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-[10px] font-bold text-white hover:bg-emerald-600 cursor-pointer"
                            >
                              Approve Update
                            </button>
                            <button
                              onClick={() => setShowRevisionInput(up._id)}
                              className="min-h-10 rounded-lg border border-amber-200 px-3.5 py-2 text-[10px] font-bold text-amber-600 hover:bg-amber-50 cursor-pointer"
                            >
                              Request Changes
                            </button>
                          </div>
                        )}

                        {/* Revision feedback input */}
                        {showRevisionInput === up._id && (
                          <div className="pt-3 border-t border-[#E2E8F0] space-y-2 mt-3">
                            <textarea
                              placeholder="Detail the changes required (e.g. Add unit test, change design color)..."
                              value={revisionNotes[up._id] || ''}
                              onChange={(e) => setRevisionNotes(prev => ({ ...prev, [up._id]: e.target.value }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-[#0F172A] resize-none"
                              rows={2}
                            />
                            <div className="flex flex-col justify-end gap-2 sm:flex-row">
                              <button
                                onClick={() => setShowRevisionInput(null)}
                                className="min-h-10 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleReviewUpdate(up._id, 'revise')}
                                className="min-h-10 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-600"
                              >
                                Submit Request
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Client Final Release actions */}
              {isClient && escrow.status === 'IN_PROGRESS' && (
                <div className="flex flex-col gap-3 border-t border-[#F1F5F9] pt-4.5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Milestone Approved?</span>
                    <p className="text-xs text-slate-500 mt-0.5">Click release to release contract funds to the freelancer wallet.</p>
                  </div>
                  <button
                    onClick={handleApproveEscrow}
                    className="min-h-11 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-600 cursor-pointer sm:w-auto"
                  >
                    Release Contract Funds
                  </button>
                </div>
              )}

              {isFreelancer && escrow.status === 'FUNDED' && (
                <div className="bg-[#FAF9FF] border border-[#7C3AED]/10 rounded-xl p-6 text-center space-y-3.5 mt-4">
                  <Play className="w-8 h-8 text-[#7C3AED] mx-auto animate-pulse" />
                  <h4 className="text-xs font-bold text-[#0F172A]">Start Project Milestone</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Set the contract status to In Progress on-chain. This registers your active start on the Stellar Testnet.
                  </p>
                  <button
                    onClick={handleStartWork}
                    className="px-5 py-2.5 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all shadow-sm cursor-pointer"
                  >
                    Start Work
                  </button>
                </div>
              )}

              {/* Freelancer Post Update Form */}
              {isFreelancer && escrow.status === 'IN_PROGRESS' && (
                <form onSubmit={handlePostUpdate} className="border-t border-[#F1F5F9] pt-5 space-y-4">
                  <div className="flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-[#7C3AED]" />
                    <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Post Work Progress Update</h4>
                  </div>

                  {updateError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{updateError}</span>
                    </div>
                  )}

                  <div className="bg-[#FAF9FF] border border-[#7C3AED]/10 rounded-xl p-3 text-[10px] text-slate-500 leading-relaxed">
                    <span className="font-bold text-[#7C3AED] uppercase block mb-0.5">⚠️ Sharing Contact Details is Prohibited</span>
                    Do not provide email addresses, WhatsApp, Telegram, Skype, Zoom, or phone numbers. All communication must remain on EscrowX.
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1">Update Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Completed layout coding / Set up SQLite database connection"
                      value={updateTitle}
                      onChange={(e) => setUpdateTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs bg-[#FAFAFA]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Summarize the features completed, logic updates, or blockers..."
                      value={updateDescription}
                      onChange={(e) => setUpdateDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs bg-[#FAFAFA] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingUpdate}
                    className="w-full py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {submittingUpdate ? 'Posting update...' : 'Submit Workspace Update'}
                  </button>
                </form>
              )}
            </div>

            {/* Job Details Card */}
            <div className="bg-white border border-[#E4E8F0] rounded-xl p-6 shadow-xs space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workspace Specifications</h4>
              <h3 className="text-xs font-bold text-[#0F172A]">{escrow.job?.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                {escrow.job?.description || 'No detailed specifications loaded.'}
              </p>
            </div>

            {/* Raise Dispute */}
            {['FUNDED', 'IN_PROGRESS'].includes(escrow.status) && (isClient || isFreelancer) && (
              <div className="bg-white border border-red-100 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-red-500">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Dispute Resolution Vault</h4>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  If counterparty deliverables violate contract specifications, you can freeze contract funds and notify the community arbitrator.
                </p>
                <form onSubmit={handleRaiseDispute} className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    placeholder="Dispute reason details..."
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    required
                    className="min-h-11 flex-1 rounded-xl border border-[#E2E8F0] bg-[#FAFAFA] px-3.5 py-2 text-xs text-[#0F172A]"
                  />
                  <button
                    type="submit"
                    disabled={raisingDispute}
                    className="min-h-11 rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-red-600 cursor-pointer"
                  >
                    {raisingDispute ? 'Disputing...' : 'Raise Dispute'}
                  </button>
                </form>
              </div>
            )}

            {/* Reviews Section */}
            {(escrow.status === 'COMPLETED' || escrow.status === 'REFUNDED') && (
              <div className="bg-white border border-[#E4E8F0] rounded-xl p-6 shadow-xs space-y-4">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Collaboration Reviews</h4>
                
                {reviews.length > 0 && (
                  <div className="space-y-3">
                    {reviews.map((r: any) => (
                      <div key={r._id} className="border border-[#E4E8F0] rounded-xl p-4 bg-[#FAFAFA] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0F172A]">{r.reviewer?.name || 'User'}</span>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 italic">"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {(isClient || isFreelancer) && !reviews.some((r: any) => r.reviewer?._id === user?.id || r.reviewer === user?.id) && (
                  <form onSubmit={handleLeaveReview} className="space-y-4 border-t border-slate-100 pt-4">
                    <h5 className="text-xs font-bold text-slate-600">Rate counterparty:</h5>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-0.5 rounded hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <textarea
                        placeholder="Write feedback comment..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-[#0F172A] resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                    className="min-h-11 rounded-lg bg-[#7C3AED] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#6D28D9]"
                    >
                      {submittingReview ? 'Submitting Review...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Transaction Logs */}
            <div className="bg-white border border-[#E4E8F0] rounded-xl p-6 shadow-xs">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4">Transaction History</h4>
              {transactions.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No transactions loaded.</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map(tx => (
                    <div key={tx._id} className="flex min-w-0 flex-col gap-1 border-b border-[#E5E7EB] pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase text-[#7C3AED]">{tx.type}</p>
                        <p className="mt-0.5 truncate font-mono text-[9px] text-gray-400" title={tx.txHash}>{tx.txHash}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-500">{new Date(tx.timestamp).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR (span 3) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Parties Card */}
            <div className="bg-white border border-[#E4E8F0] rounded-xl p-5 shadow-xs space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parties Involved</h4>
              
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Client / Employer</p>
                  <p className="text-xs font-bold text-[#0F172A] mt-0.5">{escrow.client?.name}</p>
                  <p className="font-mono text-[9px] text-gray-400 truncate">{escrow.client?.walletAddress}</p>
                </div>
                
                <div className="border-t border-[#F1F5F9] pt-3">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Freelancer / Provider</p>
                  <p className="text-xs font-bold text-[#0F172A] mt-0.5">{escrow.freelancer?.name}</p>
                  <p className="font-mono text-[9px] text-gray-400 truncate">{escrow.freelancer?.walletAddress}</p>
                </div>

                <div className="border-t border-[#F1F5F9] pt-3">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Arbitrator</p>
                  <p className="text-xs font-bold text-[#0F172A] mt-0.5">{escrow.arbitrator?.name || 'Community Arbiter'}</p>
                  <p className="font-mono text-[9px] text-gray-400 truncate">{escrow.arbitrator?.walletAddress}</p>
                </div>
              </div>
            </div>

            {/* Deadline Countdown */}
            <div className="bg-white border border-[#E4E8F0] rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contract Deadline</h4>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{new Date(escrow.deadline).toLocaleDateString()}</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-[10px] font-bold text-amber-800">
                  Due in {Math.max(0, Math.ceil((new Date(escrow.deadline).getTime() - Date.now()) / 86400000))} Days
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <FundEscrowModal
        isOpen={isFundModalOpen}
        onClose={() => setIsFundModalOpen(false)}
        escrow={escrow}
        clientWallet={walletAddress || user?.walletAddress || ''}
        onSuccess={(txHash) => {
          loadWorkspaceDetails();
        }}
      />
    </DashboardLayout>
  );
}
