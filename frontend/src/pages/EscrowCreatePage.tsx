import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, Wallet, CheckCircle2, ArrowLeft, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { escrowService, apiClient } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { StepProgress } from '../components/shared/StepProgress';

const STEPS = [
  { id: 1, label: 'Agreement Details' },
  { id: 2, label: 'Fund Vault' },
  { id: 3, label: 'Smart Contract Deployed' }
];

export default function EscrowCreatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, walletAddress: clientWalletAddress } = useAuthStore();
  
  // Parse query params
  const searchParams = new URLSearchParams(location.search);
  const qListingId = searchParams.get('listingId') || '';
  const qAmount = searchParams.get('amount') || '0';
  const qCounterpartyAddress = searchParams.get('counterpartyAddress') || '';
  const qCounterpartyId = searchParams.get('counterpartyId') || '';
  const qTitle = searchParams.get('title') || '';

  // Form states
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState(qTitle || 'Stellar Escrow Agreement');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(Number(qAmount) || 100);
  const [deadlineDays, setDeadlineDays] = useState<number>(7);
  const [counterpartyAddress, setCounterpartyAddress] = useState(qCounterpartyAddress);
  const [counterpartyId, setCounterpartyId] = useState(qCounterpartyId);
  const [arbitratorAddress, setArbitratorAddress] = useState('GCHJ5V7QW5BTPKMYXNMHWRT...9QZM');
  
  const [loading, setLoading] = useState(false);
  const [deployedEscrow, setDeployedEscrow] = useState<any | null>(null);

  // Fetch listing details to fill description if listingId is provided
  useEffect(() => {
    if (qListingId) {
      apiClient.get(`/listings/${qListingId}`)
        .then(res => {
          if (res.data) {
            setDescription(`Agreement based on Listing: "${res.data.title}"\n\nOriginal description:\n${res.data.description}`);
            if (!title) setTitle(res.data.title);
            if (!counterpartyAddress) {
              setCounterpartyAddress(res.data.createdBy?.walletAddress || '');
            }
            if (!counterpartyId) {
              setCounterpartyId(res.data.createdBy?._id || res.data.createdBy?.id || '');
            }
          }
        })
        .catch(err => console.error('Error fetching listing details in escrow creation:', err));
    }
  }, [qListingId]);

  const handleNextToFund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !counterpartyAddress || amount <= 0) {
      alert('Please fill out all required details.');
      return;
    }
    setCurrentStep(2);
  };

  const handleDeployContract = async () => {
    setLoading(true);
    try {
      // Simulate/Generate Soroban contract details
      const mockContractId = 'C' + [...Array(55)].map(() => (~~(Math.random()*36)).toString(36)).join('').toUpperCase();
      const mockTxHash = '0x' + [...Array(64)].map(() => (~~(Math.random()*16)).toString(16)).join('');
      
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + Number(deadlineDays));

      // Call API to create Escrow in the DB
      const res = await escrowService.createEscrow({
        listingId: qListingId || undefined,
        contractId: mockContractId,
        arbitratorAddress: 'GBDT...K9XM', // Default platform admin wallet
        amount: Number(amount),
        tokenType: 'XLM',
        deadline: deadlineDate.toISOString(),
        txHash: mockTxHash,
        freelancerId: counterpartyId || undefined
      });

      setDeployedEscrow(res);
      setCurrentStep(3);
    } catch (err: any) {
      console.error('Error creating escrow:', err);
      alert(err.response?.data?.error || 'Failed to deploy smart contract escrow.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>

        {/* Step Progress bar */}
        <div className="bg-white border border-[#E4E8F0] rounded-xl p-4 shadow-sm">
          <StepProgress steps={STEPS} currentStep={currentStep} />
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Agreement Details */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-[#E4E8F0] rounded-xl p-6 shadow-sm space-y-5"
            >
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Initialize Escrow Agreement</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Define the parameters of your smart contract. These terms are binding once funded.</p>
              </div>

              <form onSubmit={handleNextToFund} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Agreement Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Website development milestone"
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Detailed Description & Deliverables</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="List all requirements, milestones, acceptance criteria, and details..."
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Contract Amount (XLM)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={amount}
                      onChange={e => setAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Delivery Deadline (Days)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={deadlineDays}
                      onChange={e => setDeadlineDays(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Counterparty Wallet Address</label>
                  <input
                    type="text"
                    required
                    value={counterpartyAddress}
                    onChange={e => setCounterpartyAddress(e.target.value)}
                    placeholder="e.g. GDKPQN5XCZK8MNBRTV2H..."
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-mono focus:outline-none"
                  />
                  <p className="text-[9px] text-gray-400 mt-1">Stellar public address of the other party (starting with G).</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#0F172A] text-white text-xs font-bold hover:bg-[#1E293B] transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  Continue to Funding <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: Fund Vault */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-[#E4E8F0] rounded-xl p-6 shadow-sm space-y-6"
            >
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Fund Escrow Vault</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Deploy the agreement to the Stellar blockchain. The Client will lock {amount} XLM into the Soroban contract.</p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 space-y-3.5 text-xs text-[#475569]">
                <div className="flex justify-between">
                  <span className="font-medium">Agreement Title:</span>
                  <span className="font-bold text-[#0F172A]">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Counterparty:</span>
                  <span className="font-mono text-[10px] text-gray-500">{counterpartyAddress.slice(0, 10)}...{counterpartyAddress.slice(-8)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/80 pt-3">
                  <span className="font-medium text-[#0F172A]">Locked Amount:</span>
                  <span className="font-mono font-bold text-[#0F172A]">{amount} XLM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Platform Fee (0.5%):</span>
                  <span className="font-mono font-bold text-[#0F172A]">{(amount * 0.005).toFixed(4)} XLM</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/80 pt-3 text-sm text-[#0F172A]">
                  <span className="font-bold">Total Cost:</span>
                  <span className="font-mono font-extrabold text-[#7C3AED]">{(amount * 1.005).toFixed(4)} XLM</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-3 rounded-lg border border-[#E4E8F0] bg-white text-[#0F172A] text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Edit Terms
                </button>
                <button
                  onClick={handleDeployContract}
                  disabled={loading}
                  className="flex-1 py-3 rounded-lg bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Wallet className="w-4 h-4" />
                  {loading ? 'Deploying...' : 'Deploy & Fund'}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Smart Contract Deployed */}
          {currentStep === 3 && deployedEscrow && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#E4E8F0] rounded-xl p-6 shadow-sm text-center space-y-6"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Escrow Deployed Successfully!</h2>
                <p className="text-xs text-[#64748B] mt-0.5">The Soroban smart contract is live and the vault has been funded.</p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 text-left text-xs font-medium space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Escrow ID:</span>
                  <span className="font-bold text-[#0F172A]">{deployedEscrow._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Contract Address:</span>
                  <span className="font-mono text-[10px] text-gray-500 select-all">{deployedEscrow.contractId.slice(0, 16)}...{deployedEscrow.contractId.slice(-12)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Transaction Hash:</span>
                  <span className="font-mono text-[10px] text-gray-500 select-all">{deployedEscrow.txHash.slice(0, 16)}...{deployedEscrow.txHash.slice(-12)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate(user?.role === 'CLIENT' ? `/client/escrows` : `/freelancer/escrows`)}
                className="w-full py-3 rounded-lg bg-[#0F172A] text-white text-xs font-bold hover:bg-[#1E293B] transition-all cursor-pointer shadow-sm"
              >
                Go to My Escrows
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
