'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Copy, LogOut, ExternalLink, ChevronDown } from 'lucide-react';
import { truncateAddress, copyToClipboard } from '@/lib/utils';
import { cn } from '@/lib/utils';

const MOCK_WALLET = 'GBXPKM7VSKBKX5JKJHLXQWRX6IQZP3D4ZQKZLM2NFTD8RWKPHJCXYZ';

interface WalletConnectButtonProps {
  variant?: 'outlined' | 'filled';
  className?: string;
}

export function WalletConnectButton({ variant = 'filled', className }: WalletConnectButtonProps) {
  const [connected, setConnected] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const balance = 10_842.50;

  const handleConnect = () => {
    setConnected(true);
  };

  const handleCopy = async () => {
    await copyToClipboard(MOCK_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setShowDropdown(false);
  };

  if (!connected) {
    return (
      <button
        onClick={handleConnect}
        className={cn(
          'inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-[10px] px-3 py-2 text-sm font-semibold transition-all duration-200 sm:px-4',
          variant === 'outlined'
            ? 'border border-[#5B6BF8] text-[#5B6BF8] hover:bg-[#EEF0FF]'
            : 'bg-[#5B6BF8] text-white hover:bg-[#4757E8] shadow-sm hover:shadow-md hover:-translate-y-px',
          className
        )}
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="relative max-w-full">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={cn(
          'inline-flex min-h-11 max-w-full min-w-0 items-center gap-2 rounded-[10px] border border-[#E4E8F0] bg-white px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-[#F8F9FB]',
          className
        )}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#16A865]" />
          <span className="truncate font-mono text-xs text-[#6B7280]">
            {truncateAddress(MOCK_WALLET, 6)}
          </span>
        </div>
        <span className="hidden rounded-[4px] bg-[#EEF0FF] px-1.5 py-0.5 text-[11px] font-semibold text-[#5B6BF8] sm:inline">
          {balance.toLocaleString()} XLM
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full z-50 mt-2 w-[min(16rem,calc(100vw-2rem))] overflow-hidden rounded-[12px] border border-[#E4E8F0] bg-white shadow-xl"
          >
            <div className="p-3 border-b border-[#E4E8F0]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] mb-1">Connected Wallet</p>
              <p className="font-mono text-xs text-[#0F1117] break-all leading-relaxed">{MOCK_WALLET}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-[#0F1117]">{balance.toLocaleString()} XLM</span>
                <span className="text-xs text-[#9CA3AF]">≈ $1,214.36</span>
              </div>
            </div>

            <div className="p-1.5">
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-sm text-[#6B7280] hover:bg-[#F8F9FB] hover:text-[#0F1117] transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy Address'}
              </button>
              <a
                href="#"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-sm text-[#6B7280] hover:bg-[#F8F9FB] hover:text-[#0F1117] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View on Explorer
              </a>
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
