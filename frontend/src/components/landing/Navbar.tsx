import { Check, Copy, LogOut, Loader2, Menu, Wallet, X } from 'lucide-react';
import { useState } from 'react';
import { useFreighter } from '@/hooks/useFreighter';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Dashboard', href: '/dashboard' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const { isConnected, walletAddress, connectWallet, disconnectWallet, isLoading } = useFreighter();

  const walletLabel = walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 'Connect Wallet';

  const handleWalletClick = async () => {
    if (isConnected && walletAddress) {
      setWalletMenuOpen((value) => !value);
      return;
    }

    await connectWallet();
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setWalletMenuOpen(false);
  };

  const handleCopyAddress = async () => {
    if (!walletAddress) return;
    await navigator.clipboard.writeText(walletAddress);
    setWalletMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#FAF8F3]/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-6">
          <a href="#home" className="flex items-center gap-3 focus-visible:outline-offset-4" aria-label="EscrowX home">
            <span className="grid size-8 place-items-center rounded-full bg-[#1A1A18] text-xs font-black tracking-tight text-[#FAF8F3]">
              E
            </span>
            <span className="text-base font-bold tracking-tight text-[#1A1A18] sm:text-lg">EscrowX</span>
          </a>

          <nav className="hidden flex-1 items-center gap-8 md:flex" aria-label="Primary navigation">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#6B6A63] transition-colors duration-200 hover:text-[#1A1A18]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="relative hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={handleWalletClick}
              disabled={isLoading}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1A1A18] px-5 py-2.5 text-sm font-medium text-[#FAF8F3] transition duration-200 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9AA879] disabled:cursor-not-allowed disabled:opacity-70"
              aria-label={isConnected ? 'Connected wallet options' : 'Connect wallet'}
              aria-expanded={isConnected ? walletMenuOpen : undefined}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin text-[#D0CBBE]" aria-hidden="true" />
              ) : isConnected ? (
                <span className="inline-flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#9DD27A]" aria-hidden="true" />
                  <Wallet className="size-4 text-[#D0CBBE]" aria-hidden="true" />
                </span>
              ) : (
                <Wallet className="size-4 text-[#D0CBBE]" aria-hidden="true" />
              )}
              {isLoading ? 'Connecting...' : walletLabel}
            </button>

            {walletMenuOpen && isConnected && (
              <div className="absolute right-0 top-full mt-3 w-48 rounded-2xl border border-black/10 bg-[#FAF8F3] p-2 shadow-[0_16px_40px_rgba(26,26,24,0.12)]">
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#6B6A63] transition hover:bg-[#F0EDE5] hover:text-[#1A1A18]"
                >
                  <Copy className="size-4 text-[#6B6A63]" aria-hidden="true" />
                  Copy address
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#6B6A63] transition hover:bg-[#F0EDE5] hover:text-[#1A1A18]"
                >
                  <LogOut className="size-4 text-[#6B6A63]" aria-hidden="true" />
                  Disconnect
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="inline-grid size-10 place-items-center rounded-full bg-[#1A1A18] text-[#FAF8F3] transition md:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>

        {isOpen && (
          <div id="mobile-nav" className="mt-4 border-t border-black/10 pt-4 md:hidden">
            <nav className="grid gap-2" aria-label="Mobile navigation">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm font-medium text-[#6B6A63] transition hover:bg-[#F0EDE5] hover:text-[#1A1A18]"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <button
              type="button"
              onClick={isConnected && walletAddress ? handleDisconnect : handleWalletClick}
              disabled={isLoading}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1A1A18] px-5 py-3 text-sm font-medium text-[#FAF8F3] disabled:cursor-not-allowed disabled:opacity-70"
              aria-label={isConnected ? 'Disconnect wallet' : 'Connect wallet'}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin text-[#D0CBBE]" aria-hidden="true" />
              ) : isConnected ? (
                <Check className="size-4 text-[#9DD27A]" aria-hidden="true" />
              ) : (
                <Wallet className="size-4 text-[#D0CBBE]" aria-hidden="true" />
              )}
              {isLoading ? 'Connecting...' : isConnected && walletAddress ? `${walletLabel} / Disconnect` : 'Connect Wallet'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
