import { Copy, LogOut, Loader2, Menu, Wallet, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFreighter } from '@/hooks/useFreighter';
import { Logo } from '@/components/brand/Logo';

const defaultLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Monitoring', href: '/dashboard' },
];

interface NavbarProps {
  links?: Array<{ label: string; href: string }>;
}

export function Navbar({ links = defaultLinks }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    const updateScrolled = () => setIsScrolled(window.scrollY > 8);
    updateScrolled();
    window.addEventListener('scroll', updateScrolled);
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-[#FAF8F3]/90 backdrop-blur transition-colors duration-200 ${
        isScrolled || isOpen ? 'border-b border-black/10' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-6xl px-3 py-3 sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <a href="#home" className="flex min-w-0 shrink items-center gap-2.5 focus-visible:outline-offset-4 sm:gap-3" aria-label="EscrowX home">
            <Logo className="size-8 text-[#1A1A18]" />
            <span className="truncate text-base font-bold tracking-tight text-[#1A1A18] sm:text-lg">EscrowX</span>
          </a>

          <nav className="hidden items-center justify-center gap-9 md:flex" aria-label="Primary navigation">
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

          <div className="relative hidden items-center justify-end gap-2 md:flex">
            {isConnected && walletAddress ? (
              <div className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1A1A18] px-4 py-2.5 text-sm font-medium text-[#FAF8F3] transition duration-200 hover:bg-black">
                <button
                  type="button"
                  onClick={() => setWalletMenuOpen((value) => !value)}
                  className="inline-flex items-center gap-2"
                  aria-label="Connected wallet options"
                  aria-expanded={walletMenuOpen}
                >
                  <span className="size-2 rounded-full bg-[#9DD27A]" aria-hidden="true" />
                  <span>{walletLabel}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="-mr-1 ml-1 inline-grid size-7 place-items-center rounded-full text-red-400 transition hover:scale-105 hover:bg-red-500/15 hover:text-red-300"
                  aria-label="Disconnect wallet"
                >
                  <LogOut className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleWalletClick}
                disabled={isLoading}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1A1A18] px-5 py-2.5 text-sm font-medium text-[#FAF8F3] transition duration-200 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9AA879] disabled:cursor-not-allowed disabled:opacity-70"
                aria-label="Connect wallet"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin text-[#D0CBBE]" aria-hidden="true" />
                ) : (
                  <Wallet className="size-4 text-[#D0CBBE]" aria-hidden="true" />
                )}
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}

            <span className="grid size-10 place-items-center rounded-full bg-[#A55A3E] text-sm font-bold text-white">
              EX
            </span>

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

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={handleWalletClick}
              disabled={isLoading}
              className="inline-flex min-h-10 max-w-[136px] items-center justify-center gap-1.5 rounded-full bg-[#1A1A18] px-3 py-2 text-xs font-bold text-[#FAF8F3] transition disabled:cursor-not-allowed disabled:opacity-70"
              aria-label={isConnected ? 'Connected wallet options' : 'Connect wallet'}
              aria-expanded={isConnected ? walletMenuOpen : undefined}
            >
              {isLoading ? (
                <Loader2 className="size-4 shrink-0 animate-spin text-[#D0CBBE]" aria-hidden="true" />
              ) : isConnected ? (
                <span className="size-2 shrink-0 rounded-full bg-[#9DD27A]" aria-hidden="true" />
              ) : (
                <Wallet className="size-4 shrink-0 text-[#D0CBBE]" aria-hidden="true" />
              )}
              <span className="truncate">{isLoading ? 'Connecting' : isConnected && walletAddress ? walletLabel : 'Wallet'}</span>
            </button>

            <button
              type="button"
              className="inline-grid size-10 shrink-0 place-items-center rounded-full bg-[#1A1A18] text-[#FAF8F3] transition"
              onClick={() => setIsOpen((value) => !value)}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>

            {walletMenuOpen && isConnected && (
              <div className="absolute right-3 top-full mt-2 w-[min(13rem,calc(100vw-1.5rem))] rounded-2xl border border-black/10 bg-[#FAF8F3] p-2 shadow-[0_16px_40px_rgba(26,26,24,0.12)]">
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#6B6A63] transition hover:bg-[#F0EDE5] hover:text-[#1A1A18]"
                >
                  <Copy className="size-4 text-[#6B6A63]" aria-hidden="true" />
                  Copy address
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#6B6A63] transition hover:bg-[#F0EDE5] hover:text-[#1A1A18]"
                >
                  <LogOut className="size-4 text-[#6B6A63]" aria-hidden="true" />
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>

        {isOpen && (
          <div id="mobile-nav" className="mt-4 border-t border-black/10 pt-4 md:hidden">
            <nav className="grid gap-2" aria-label="Mobile navigation">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="min-h-11 rounded-full px-3 py-2.5 text-sm font-medium text-[#6B6A63] transition hover:bg-[#F0EDE5] hover:text-[#1A1A18]"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
