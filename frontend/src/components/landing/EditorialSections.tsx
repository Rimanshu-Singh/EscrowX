import {
  Activity,
  BadgeCheck,
  BriefcaseBusiness,
  CircleCheck,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { useFreighter } from '@/hooks/useFreighter';

const stats = [
  { value: '50+', label: 'Total Escrows', icon: ShieldCheck },
  { value: '$120k+', label: 'Funds Secured', icon: LockKeyhole },
  { value: '35+', label: 'Freelancers Onboarded', icon: BriefcaseBusiness },
  { value: '99%', label: 'Settlement Success', icon: Activity },
];

const features = [
  {
    title: 'Escrow-First Publishing',
    description: 'Clients must fund escrow before a job goes live, so work starts with payment already secured.',
    icon: BadgeCheck,
  },
  {
    title: 'On-Chain Fund Locking',
    description: 'Payments are locked inside a Soroban smart contract, never held by EscrowX or a platform wallet.',
    icon: LockKeyhole,
  },
  {
    title: 'Milestone-Based Release',
    description: 'Funds release only after client approval, protecting freelancers from unpaid delivery.',
    icon: CircleCheck,
  },
];

const codePanels = [
  {
    title: 'escrow.rs',
    code: [
      'pub fn fund_escrow(env: Env, amount: i128) {',
      '    require!(amount > 0, Error::InvalidAmount);',
      '    storage::set_status(&env, Status::Funded);',
      '    events::escrow_funded(&env, amount);',
      '}',
    ],
  },
  {
    title: 'release.rs',
    code: [
      'pub fn release_payment(env: Env, client: Address) {',
      '    client.require_auth();',
      '    require_status(&env, Status::Delivered);',
      '    transfer_to_freelancer(&env);',
      '}',
    ],
  },
  {
    title: 'useEscrow.ts',
    code: [
      'const approve = async () => {',
      '  await contract.releasePayment({',
      '    escrowId, signer: walletAddress',
      '  });',
      '}',
    ],
  },
];

export function StatsBar() {
  return (
    <section className="border-y border-black/10 bg-[#F0EDE5] px-4 sm:px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-black/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.label} className="flex items-center gap-4 px-2 py-7 sm:px-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#DDE4CC] text-[#56633D]">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-serif text-4xl leading-none text-[#1A1A18]">{stat.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#6B6A63]">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function WhyEscrowX() {
  return (
    <section className="bg-[#FAF8F3] px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#56633D]">Why EscrowX</p>
          <h2 className="font-serif text-4xl leading-tight text-[#1A1A18] sm:text-6xl">
            Built for trustless freelancing
          </h2>
          <p className="mt-5 text-base leading-8 text-[#6B6A63] sm:text-lg">
            EscrowX makes payment security the first step, not the final negotiation.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="rounded-2xl border border-black/10 bg-[#F0EDE5] p-7">
                <span className="grid size-12 place-items-center rounded-full bg-[#DDE4CC] text-[#56633D]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-8 text-xl font-black text-[#1A1A18]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6B6A63]">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PoweredBy() {
  return (
    <section className="bg-[#151513] px-4 py-24 text-[#FAF8F3] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#BFC99B]">Soroban + Stellar</p>
          <h2 className="font-serif text-4xl leading-tight sm:text-6xl">Powered by Soroban smart contracts</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#D0CBBE] sm:text-lg">
            Funds stay programmable, transparent, and outside platform custody from funding through release.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {codePanels.map((panel) => (
            <CodeWindow key={panel.title} title={panel.title} code={panel.code} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="bg-[#FAF8F3] px-4 py-24 text-center sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-black/10 bg-[#F0EDE5] p-8 sm:p-12">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#DDE4CC] text-[#56633D]">
          <Sparkles className="size-5" aria-hidden="true" />
        </span>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-[#56633D]">Social Proof</p>
        <h2 className="mt-4 font-serif text-4xl leading-tight text-[#1A1A18] sm:text-5xl">What our users are saying</h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#6B6A63]">
          Real testimonials will appear here once EscrowX opens its first public escrow cohorts.
        </p>
      </div>
    </section>
  );
}

export function ClosingCta() {
  const { isConnected, walletAddress, connectWallet, disconnectWallet, isLoading } = useFreighter();
  const walletLabel = walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 'Connect Wallet';

  const handleWalletClick = async () => {
    if (isConnected && walletAddress) {
      disconnectWallet();
      return;
    }

    await connectWallet();
  };

  return (
    <section className="bg-[#151513] px-4 py-24 text-center text-[#FAF8F3] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-serif text-5xl leading-[1.02] sm:text-7xl">
          Fund once.
          <span className="block italic text-[#BFC99B]">Work freely.</span>
          <span className="block">Get paid securely.</span>
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#D0CBBE]">
          Connect a Stellar wallet and start the same EscrowX flow with payment confidence built in.
        </p>
        <button
          type="button"
          onClick={handleWalletClick}
          disabled={isLoading}
          className="mt-10 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FAF8F3] px-7 text-sm font-black text-[#151513] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Wallet className="size-4" aria-hidden="true" />
          {isLoading ? 'Connecting...' : isConnected && walletAddress ? `${walletLabel} / Disconnect` : 'Connect Wallet'}
        </button>
      </div>
    </section>
  );
}

function CodeWindow({ title, code }: { title: string; code: string[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D0D0C]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex gap-2">
          <span className="size-3 rounded-full bg-[#FF6B5F]" />
          <span className="size-3 rounded-full bg-[#F5C250]" />
          <span className="size-3 rounded-full bg-[#74C365]" />
        </div>
        <span className="font-mono text-xs text-[#8D8A80]">{title}</span>
      </div>
      <pre className="overflow-x-auto p-5 text-left font-mono text-xs leading-6 text-[#D9D4C8]">
        <code>
          {code.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
