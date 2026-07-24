const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'How It Works', href: '#how-it-works' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full border border-white/10 bg-black text-sm font-black">
              E
            </span>
            <span className="text-lg font-black text-white">EscrowX</span>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-400">
            Trustless freelance payments powered by Stellar.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-7 gap-y-3" aria-label="Footer navigation">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-semibold text-slate-400 transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <p className="text-sm font-semibold text-[#93c5fd]">Built on Stellar / Soroban</p>
      </div>
    </footer>
  );
}
