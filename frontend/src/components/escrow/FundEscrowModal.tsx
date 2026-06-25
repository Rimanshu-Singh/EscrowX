import React, { useEffect, useState } from 'react';
import { Wallet, X, AlertTriangle, CheckCircle, XCircle, Copy, Check, Loader2 } from 'lucide-react';
import { useFundEscrow } from '../../hooks/useFundEscrow';
import { FundingSteps } from './FundingSteps';

interface FundEscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  escrowId: string;
  amountXLM: string;
  walletAddress: string;
  onSuccess: (txHash: string) => void;
}

export const FundEscrowModal: React.FC<FundEscrowModalProps> = ({
  isOpen,
  onClose,
  escrowId,
  amountXLM,
  walletAddress,
  onSuccess,
}) => {
  const { fundEscrow, error, txHash, step, reset } = useFundEscrow();
  const [copied, setCopied] = useState(false);

  // Reset state when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      reset();
      setCopied(false);
    }
  }, [isOpen]);

  // Handle Escape key closure
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (step === 'idle' || step === 'error') {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, step, onClose]);

  if (!isOpen) return null;

  const handleFundClick = async () => {
    const success = await fundEscrow(escrowId, amountXLM, walletAddress);
    if (success && txHash) {
      // onSuccess will be triggered from Success view Done button
    }
  };

  const handleCopyHash = async () => {
    if (txHash) {
      await navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDoneClick = () => {
    if (txHash) {
      onSuccess(txHash);
    }
    onClose();
  };

  // Shorten wallet address for display
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isProcessing = ['building', 'signing', 'submitting', 'confirming'].includes(step);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop blur */}
      <div 
        className="fixed inset-0 bg-[#0A0A0F]/80 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!isProcessing) onClose();
        }}
      />

      {/* Centered Modal */}
      <div className="relative w-full max-w-md mx-4 bg-[#16161E] border border-[#232332] rounded-2xl shadow-2xl p-6 overflow-hidden z-10 transform transition-all duration-300 scale-100 opacity-100 flex flex-col text-slate-200">
        
        {/* Header (Hide close button during processing) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#232332]">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#A78BFA]">
            {step === 'done' ? 'Escrow Funded' : step === 'error' ? 'Transaction Failed' : 'Fund Escrow'}
          </h3>
          {!isProcessing && (
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-[#232332] p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="mt-4 flex-1 space-y-4">
          
          {/* STATE 1: CONFIRM (idle) */}
          {step === 'idle' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-400">Review before locking funds</p>
              </div>

              {/* Details Box (dark inner card) */}
              <div className="bg-[#1E1E28] border border-[#2A2A38] rounded-xl p-4 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Amount</span>
                  <span className="font-mono font-black text-white">{amountXLM} XLM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Recipient</span>
                  <span className="font-mono font-bold text-slate-300" title={walletAddress}>
                    EscrowX Treasury ({formatAddress('GDGSHBO7VF2E6ZUB2DLGOBBRQUNNLL3V6M7JQEUUT6SEJOTEPAIGLMMX')})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Network</span>
                  <span className="text-slate-300 font-bold">Stellar Testnet</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Memo</span>
                  <span className="font-mono bg-[#16161E] px-2 py-0.5 rounded border border-[#2D2D3E] text-[#F3E8FF] font-bold">
                    escrow:{escrowId.slice(0, 21)}
                  </span>
                </div>
              </div>

              {/* Warning note (amber) */}
              <div className="flex items-start gap-2.5 bg-amber-950/20 border border-amber-800/30 rounded-xl p-3.5 text-[10px] text-amber-200 leading-relaxed">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>
                  <strong>Warning:</strong> Funds will be locked until work is approved. This action cannot be undone.
                </span>
              </div>

              {/* Two buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  onClick={handleFundClick}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer hover:shadow-lg"
                >
                  <Wallet className="w-4 h-4" />
                  Fund Now
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-[#1E1E28] hover:bg-[#252533] border border-[#2D2D3E] text-slate-400 hover:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: PROCESSING */}
          {isProcessing && (
            <div className="space-y-6 py-2">
              <FundingSteps step={step} />
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-[#8B5CF6]" />
                <span>Processing Stellar transaction...</span>
              </div>
            </div>
          )}

          {/* STATE 3: SUCCESS (done) */}
          {step === 'done' && (
            <div className="space-y-5 text-center py-4">
              {/* Large green checkmark animation */}
              <div className="mx-auto w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-500 animate-[bounce_1s_ease-in-out_infinite] shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <CheckCircle className="w-9 h-9 stroke-[2.5px]" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-white">Escrow Funded Successfully! 🎉</h4>
                <p className="text-[11px] text-slate-400">Freelancer has been notified to begin work.</p>
              </div>

              {/* Tx Hash Box */}
              {txHash && (
                <div className="bg-[#1E1E28] border border-[#2A2A38] rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wide">
                    <span>Transaction Hash</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-[#16161E] border border-[#2D2D3E] p-2 rounded-lg">
                    <span className="font-mono text-[10px] text-[#A78BFA] truncate max-w-[280px]">
                      {txHash}
                    </span>
                    <button 
                      onClick={handleCopyHash}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#232332] transition-colors cursor-pointer shrink-0"
                      title="Copy full hash"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleDoneClick}
                className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer hover:shadow-lg"
              >
                Done
              </button>
            </div>
          )}

          {/* STATE 4: ERROR */}
          {step === 'error' && (
            <div className="space-y-5 text-center py-4">
              <div className="mx-auto w-16 h-16 bg-red-500/10 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <XCircle className="w-9 h-9 stroke-[2.5px]" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-white">Transaction Failed</h4>
                <p className="text-[11px] text-red-400 leading-relaxed bg-red-950/20 border border-red-900/30 p-3 rounded-xl max-w-sm mx-auto">
                  {error || 'Something went wrong. Please try again.'}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  onClick={reset}
                  className="w-full py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-[#1E1E28] hover:bg-[#252533] border border-[#2D2D3E] text-slate-400 hover:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
