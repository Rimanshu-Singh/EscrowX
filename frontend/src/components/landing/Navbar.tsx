import { Menu, Wallet, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Dashboard', href: '/dashboard' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:pt-6">
      <div
        className={`mx-auto max-w-5xl border border-white/10 bg-[#07111f]/80 px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-[border-radius] duration-200 sm:px-6 ${
          isOpen ? 'rounded-[28px]' : 'rounded-full'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <a href="#home" className="flex items-center gap-3 focus-visible:outline-offset-4" aria-label="EscrowX home">
            <span className="grid size-10 place-items-center rounded-full border border-white/10 bg-black text-sm font-black tracking-tight shadow-inner">
              E
            </span>
            <span className="text-base font-bold tracking-tight text-white sm:text-lg">EscrowX</span>
          </a>

          <nav className="hidden items-center gap-10 md:flex" aria-label="Primary navigation">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] font-bold uppercase tracking-[0.18em] text-slate-300 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition duration-200 hover:-translate-y-0.5 hover:border-[#60a5fa]/40 hover:bg-[#050a12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#60a5fa]"
              aria-label="Connect wallet"
            >
              <Wallet className="size-4 text-slate-400" aria-hidden="true" />
              Connect Wallet
            </button>
          </div>

          <button
            type="button"
            className="inline-grid size-10 place-items-center rounded-full border border-white/10 bg-black/70 text-white transition hover:border-[#60a5fa]/40 md:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>

        {isOpen && (
          <div id="mobile-nav" className="mt-4 border-t border-white/10 pt-4 md:hidden">
            <nav className="grid gap-2" aria-label="Mobile navigation">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-300 transition hover:bg-white/5 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <button
              type="button"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-black px-5 py-3 text-sm font-bold text-white"
              aria-label="Connect wallet"
            >
              <Wallet className="size-4 text-slate-400" aria-hidden="true" />
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
