import React from 'react';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { useFreighter } from '@/hooks/useFreighter';
import { WalletStatus } from './WalletStatus';

function shortenAddress(addr: string): string {
  if (addr.length <= 8) return addr;
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export interface WalletButtonProps {
  className?: string;
}

export function WalletButton({ className }: WalletButtonProps) {
  const {
    isConnected,
    walletAddress,
    connectWallet,
    disconnectWallet,
    isLoading,
    error,
  } = useFreighter();

  const handleConnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    await connectWallet();
  };

  const handleDisconnect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    disconnectWallet();
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <button
        disabled
        className={`inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-400 transition-all dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-500 cursor-not-allowed sm:px-4 ${className || ''}`}
      >
        <Loader2 className="w-4 h-4 animate-spin text-[#5B6BF8]" />
        Connecting...
      </button>
    );
  }

  // 2. Connected State
  if (isConnected && walletAddress) {
    return (
      <div className={`group/chip inline-flex min-h-11 max-w-full min-w-0 items-center justify-center gap-2 rounded-[10px] border border-[#16A865]/40 bg-slate-900 px-2.5 py-2 text-white shadow-[0_0_12px_rgba(22,168,101,0.2)] transition-all duration-300 hover:border-[#16A865]/80 hover:shadow-[0_0_16px_rgba(22,168,101,0.35)] sm:gap-3 sm:px-3 ${className || ''}`}>
        <div className="flex min-w-0 items-center gap-2">
          <WalletStatus />
          <span className="min-w-0 truncate font-mono text-[11px] font-medium tracking-wide text-slate-200 select-all sm:text-xs">
            {shortenAddress(walletAddress)}
          </span>
        </div>

        {/* Tooltip + Disconnect Button */}
        <div className="relative group/tooltip flex items-center">
          <button
            onClick={handleDisconnect}
            aria-label="Disconnect wallet"
            className="grid size-8 place-items-center rounded-[6px] text-slate-400 opacity-90 transition-all duration-200 hover:bg-white/10 hover:text-red-400 hover:opacity-100 md:opacity-0 group-hover/chip:opacity-100 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 text-[10px] font-semibold text-white bg-slate-950 border border-slate-800 rounded-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg z-50">
            Disconnect wallet
          </span>
        </div>
      </div>
    );
  }

  // 3. Error State
  if (error) {
    return (
      <div className={`flex max-w-full flex-col items-center gap-1 sm:items-end ${className || ''}`}>
        <button
          onClick={handleConnect}
          className="inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-[10px] border border-red-500 bg-red-50/50 px-3 py-2 text-sm font-semibold text-red-700 transition-all duration-200 hover:bg-red-50 active:scale-[0.98] dark:border-red-800 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/35 cursor-pointer sm:px-4"
        >
          <Wallet className="w-4 h-4 text-red-500" />
          Connect Wallet
        </button>
        <span className="mt-0.5 max-w-[min(240px,100%)] text-center text-[10px] font-medium leading-snug text-red-600 animate-pulse dark:text-red-400 sm:text-right">
          {error}
        </span>
      </div>
    );
  }

  // 4. Disconnected State (Default)
  return (
    <button
      onClick={handleConnect}
      className={`inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-700 cursor-pointer sm:px-4 ${className || ''}`}
    >
      <Wallet className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      Connect Wallet
    </button>
  );
}
