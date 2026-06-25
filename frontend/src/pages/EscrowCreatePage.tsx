import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Clock,
  Wallet,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Info,
  AlertCircle,
  Tag,
  Code,
  Coins,
  ExternalLink,
  Loader2
} from 'lucide-react';

import { signTransaction, isConnected } from '@stellar/freighter-api';
import {
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  Memo,
} from '@stellar/stellar-sdk';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { escrowService } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function EscrowCreatePage() {
  const navigate = useNavigate();
  const { user, walletAddress: clientWalletAddress } = useAuthStore();

  // Step workflow states: 1 = Form, 2 = Summary, 3 = Wallet Modal, 4 = Success Screen
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  // Form states (Step 1)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deliveryDays, setDeliveryDays] = useState<number>(7);
  const [budget, setBudget] = useState<number>(100);
  const [skillsStr, setSkillsStr] = useState('');
  const [tagsStr, setTagsStr] = useState('');

  // Confirmation states (Step 4 Success)
  const [successData, setSuccessData] = useState<any | null>(null);

  // Fee calculation (0.5%)
  const platformFee = Number((budget * 0.005).toFixed(4));
  const totalAmount = Number((budget + platformFee).toFixed(4));

  const handleContinueToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || budget <= 0 || deliveryDays <= 0) {
      alert('Please fill out all required fields.');
      return;
    }
    setCurrentStep(2);
  };

  const triggerDeployAndFund = async () => {
    const connected = await isConnected();
    if (!connected) {
      alert('Freighter wallet not found. Please install it.');
      return;
    }
    setWalletModalOpen(true);
  };
  const handleWalletConfirm = async () => {
    setLoading(true);
    try {
      const TREASURY = 'GDGSHBO7VF2E6ZUB2DLGOBBRQUNNLL3V6M7JQEUUT6SEJOTEPAIGLMMX';
      const server = new Horizon.Server('https://horizon-testnet.stellar.org');

      // Load sender account
      const sourceAccount = await server.loadAccount(clientWalletAddress!);

      // Build transaction
      const tx = new TransactionBuilder(sourceAccount, {
        fee: '100',
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: TREASURY,
            asset: Asset.native(),
            amount: totalAmount.toString(),
          })
        )
        .addMemo(Memo.text(`escrowx:fund`.slice(0, 28)))
        .setTimeout(30)
        .build();

      // Sign with Freighter — this triggers the popup
      const result = await signTransaction(tx.toXDR(), {
        networkPassphrase: Networks.TESTNET,
      });
      const signedXdr = result.signedTxXdr;

      // Submit to Stellar testnet
      const { Transaction } = await import('@stellar/stellar-sdk');
      const signedTx = new Transaction(signedXdr, Networks.TESTNET);
      const submitted = await server.submitTransaction(signedTx);

      const realTxHash = submitted.hash;

      // Now call your real backend
      const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

      const response = await escrowService.createProjectEscrow({
        transactionHash: realTxHash,
        clientWallet: clientWalletAddress || '',
        budget,
        platformFee,
        totalAmount,
        title,
        description,
        type: 'PROJECT',
        deliveryDays,
        skills,
        tags,
      });

      setSuccessData({
        escrowId: response.escrow.escrowId,
        transactionHash: response.escrow.transactionHash,
        date: new Date(response.escrow.createdAt).toLocaleDateString(),
        budget: response.escrow.budget,
        platformFee: response.escrow.platformFee,
        totalAmount: response.escrow.totalAmount,
        walletAddress: response.escrow.clientWallet,
        status: response.escrow.status,
      });

      setWalletModalOpen(false);
      setCurrentStep(4);
    } catch (err: any) {
      console.error('Funding error:', err);
      alert(
        err?.message?.includes('User declined')
          ? 'Transaction rejected by user.'
          : err?.response?.data?.error || 'Transaction failed. Please try again.'
      );
      setWalletModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* HEADER BAR */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (currentStep === 2) {
                  setCurrentStep(1);
                } else {
                  navigate(-1);
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#64748B]">
              Step {currentStep} of 2
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* STEP 1: CREATE ESCROW / DETAILS FORM */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border border-[#E4E8F0] rounded-2xl shadow-xs overflow-hidden"
            >
              <div className="p-6 border-b border-[#F1F5F9] bg-[#FAF9FF]/40">
                <h2 className="text-lg font-black text-[#0F172A] tracking-tight">Initialize Escrow Project</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Fill in the project details. These terms will be locked in the escrow vault before publication.</p>
              </div>

              <form onSubmit={handleContinueToSummary} className="p-6 space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Project Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Develop React Landing Page with HSL Styling"
                    className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#7C3AED] bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Detailed Description</label>
                  <textarea
                    required
                    rows={5}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe requirements, milestones, acceptance criteria, and specific deliverables..."
                    className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#7C3AED] bg-slate-50/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Project Budget (XLM)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={budget}
                      onChange={e => setBudget(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#7C3AED] bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Delivery Time (Days)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={deliveryDays}
                      onChange={e => setDeliveryDays(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#7C3AED] bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Skills Required (Comma-separated)</label>
                    <input
                      type="text"
                      value={skillsStr}
                      onChange={e => setSkillsStr(e.target.value)}
                      placeholder="React, CSS, Tailwind, Typescript"
                      className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#7C3AED] bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={tagsStr}
                      onChange={e => setTagsStr(e.target.value)}
                      placeholder="Frontend, WebApp, MVP"
                      className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#7C3AED] bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F1F5F9] flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 py-3 border border-[#E4E8F0] text-[#0F172A] text-xs font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Continue to Fund Vault <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 2: FUND ESCROW VAULT SUMMARY */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border border-[#E4E8F0] rounded-2xl shadow-xs overflow-hidden"
            >
              <div className="p-6 border-b border-[#F1F5F9] bg-[#FAF9FF]/40">
                <h2 className="text-lg font-black text-[#0F172A] tracking-tight">Fund Escrow Vault</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Secure the project by locking funds. The listing will only be published once funded.</p>
              </div>

              <div className="p-6 space-y-6">

                {/* Contract terms card */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-4 text-xs text-[#475569]">
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Agreement Title</span>
                    <span className="font-bold text-[#0F172A] text-right">{title}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Counterparty</span>
                    <span className="font-semibold text-[#0F172A] bg-slate-100 px-2 py-0.5 rounded text-[10px]">Pending Freelancer Selection</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Estimated Delivery</span>
                    <span className="font-bold text-[#0F172A]">{deliveryDays} Days limit</span>
                  </div>

                  {skillsStr && (
                    <div className="flex justify-between items-start gap-4">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Skills</span>
                      <span className="text-[#0F172A] font-semibold text-right truncate max-w-[250px]">{skillsStr}</span>
                    </div>
                  )}

                  {tagsStr && (
                    <div className="flex justify-between items-start gap-4">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Tags</span>
                      <span className="text-[#0F172A] font-semibold text-right truncate max-w-[250px]">{tagsStr}</span>
                    </div>
                  )}

                  <div className="border-t border-[#E2E8F0] pt-4 space-y-2.5">
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-500">Locked Amount (Budget)</span>
                      <span className="font-mono font-bold text-slate-700">{budget} XLM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-500">Platform Fee (0.5%)</span>
                      <span className="font-mono font-bold text-slate-700">{platformFee} XLM</span>
                    </div>
                    <div className="flex justify-between border-t border-[#E2E8F0] pt-3 text-sm text-[#0F172A]">
                      <span className="font-extrabold uppercase tracking-wide">Total Cost</span>
                      <span className="font-mono font-black text-[#7C3AED] text-base">{totalAmount} XLM</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3.5 border border-[#E4E8F0] text-[#0F172A] text-xs font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer text-center"
                  >
                    Edit Terms
                  </button>
                  <button
                    onClick={triggerDeployAndFund}
                    className="flex-1 py-3.5 bg-gradient-to-r from-slate-900 to-black hover:from-slate-800 hover:to-slate-900 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer border-t border-slate-700"
                  >
                    <Wallet className="w-4 h-4" />
                    Deploy & Fund
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS PAGE */}
          {/* STEP 4: SUCCESS PAGE */}
          {currentStep === 4 && successData && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Success Banner */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-200"
                >
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Escrow Funded Successfully</h2>
                  <p className="text-xs text-emerald-700 mt-1 font-medium">
                    ✓ Stellar transaction confirmed · ✓ Funds locked in treasury · ✓ Listing published
                  </p>
                </div>
              </div>

              {/* Transaction Details Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
                <div className="px-5 py-3.5 border-b border-[#F1F5F9] bg-[#FAFBFF] flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Details</span>
                  <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                    ● CONFIRMED
                  </span>
                </div>

                <div className="p-5 space-y-3 text-xs">
                  {/* Escrow ID */}
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <Shield className="w-3 h-3" /> Escrow ID
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#7C3AED] select-all">{successData.escrowId}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(successData.escrowId)}
                        className="text-slate-300 hover:text-slate-500 transition-colors"
                        title="Copy"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Transaction Hash */}
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3" /> Tx Hash
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500 select-all">
                        {successData.transactionHash.slice(0, 12)}...{successData.transactionHash.slice(-10)}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(successData.transactionHash)}
                        className="text-slate-300 hover:text-slate-500 transition-colors"
                        title="Copy full hash"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${successData.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
                        title="View on Stellar Explorer"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Wallet */}
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <Wallet className="w-3 h-3" /> From Wallet
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 select-all">
                      {successData.walletAddress.slice(0, 8)}...{successData.walletAddress.slice(-6)}
                    </span>
                  </div>

                  {/* Treasury */}
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <Coins className="w-3 h-3" /> To Treasury
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      GDGSH...MMOX
                    </span>
                  </div>

                  {/* Network */}
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <Code className="w-3 h-3" /> Network
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      STELLAR TESTNET
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Confirmed At
                    </span>
                    <span className="font-bold text-slate-700">{successData.date}</span>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
                <div className="px-5 py-3.5 border-b border-[#F1F5F9] bg-[#FAFBFF]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Breakdown</span>
                </div>
                <div className="p-5 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Project Budget (Locked)</span>
                    <span className="font-mono font-bold text-slate-700">{successData.budget} XLM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Platform Fee (0.5%)</span>
                    <span className="font-mono font-bold text-slate-700">{successData.platformFee} XLM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Network Fee (est.)</span>
                    <span className="font-mono font-bold text-slate-700">~0.00001 XLM</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                    <span className="font-black text-[#0F172A] uppercase tracking-wide">Total Paid</span>
                    <span className="font-mono text-base font-black text-[#7C3AED]">{successData.totalAmount} XLM</span>
                  </div>
                </div>
              </div>

              {/* What happens next */}
              <div className="bg-[#F8FAFF] border border-[#E0E7FF] rounded-2xl p-5 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">What Happens Next</p>
                <div className="space-y-2.5">
                  {[
                    { icon: '🔒', text: 'Your funds are locked in the EscrowX treasury vault' },
                    { icon: '📋', text: 'Your project listing is now live on the marketplace' },
                    { icon: '👀', text: 'Freelancers can view and send proposals to your project' },
                    { icon: '✅', text: 'Funds release only after you approve the delivered work' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-xs text-slate-600 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={() => navigate('/marketplace')}
                  className="flex-1 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-100 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View on Marketplace
                </button>
                <button
                  onClick={() => navigate('/client/payments')}
                  className="flex-1 py-3.5 border border-[#E4E8F0] hover:bg-slate-50 text-[#0F172A] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Coins className="w-3.5 h-3.5" />
                  Payment History
                </button>
              </div>

              {/* Explorer Link */}
              <p className="text-center text-[10px] text-slate-400">
                Verify on-chain →{' '}
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${successData.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7C3AED] font-bold hover:underline"
                >
                  Stellar Expert Explorer ↗
                </a>
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* WALLET SIGNING CONFIRMATION MODAL */}
      <AnimatePresence>
        {walletModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col p-6 space-y-6 text-center"
            >
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto border border-purple-100 animate-pulse">
                <Wallet className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#0F172A]">Stellar Wallet Authorization</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Review and sign the transaction in your Freighter wallet extension to lock <strong>{totalAmount} XLM</strong>.
                </p>
              </div>

              <div className="bg-[#FAF9FF] border border-purple-100/50 rounded-xl p-3.5 text-left space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Operation:</span>
                  <span className="font-semibold text-slate-800">Deploy & Fund Soroban Vault</span>
                </div>
                <div className="flex justify-between">
                  <span>Network:</span>
                  <span className="font-bold text-amber-600">TESTNET</span>
                </div>
                <div className="flex justify-between">
                  <span>Gas Limit:</span>
                  <span className="font-mono text-slate-500">0.05 XLM</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleWalletConfirm}
                  className="flex-1 py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Approve Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setWalletModalOpen(false)}
                  className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
