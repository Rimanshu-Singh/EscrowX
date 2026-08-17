import { Logo } from '@/components/brand/Logo';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'How It Works', href: '#how-it-works' },
];

const resources = ['Docs', 'Security', 'Soroban'];
const product = ['Escrows', 'Marketplace', 'Dashboard'];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#151513] px-4 py-14 text-[#FAF8F3] sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <Logo className="size-9 text-[#FAF8F3]" />
            <span className="text-lg font-black">EscrowX</span>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#D0CBBE]">
            Trustless freelance payments powered by Stellar.
          </p>
        </div>

        <nav className="grid gap-3" aria-label="Footer navigation">
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8D8A80]">Navigation</h3>
          {links.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-semibold text-[#D0CBBE] transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="grid gap-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8D8A80]">Resources</h3>
          {resources.map((item) => (
            <a key={item} href="#" className="text-sm font-semibold text-[#D0CBBE] transition hover:text-white">
              {item}
            </a>
          ))}
        </div>

        <div className="grid gap-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8D8A80]">Product</h3>
          {product.map((item) => (
            <a key={item} href="#" className="text-sm font-semibold text-[#D0CBBE] transition hover:text-white">
              {item}
            </a>
          ))}
          <p className="mt-2 text-sm font-semibold text-[#BFC99B]">Status: Testnet</p>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-xs font-semibold text-[#8D8A80]">
        EscrowX 2026. Built on Stellar / Soroban.
      </div>
    </footer>
  );
}
