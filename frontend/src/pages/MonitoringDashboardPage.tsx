import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Globe2,
  LockKeyhole,
  LogOut,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useFreighter } from '@/hooks/useFreighter';
import { STELLAR_CONFIG } from '@/lib/stellar.config';
import { Navbar } from '@/components/landing/Navbar';
import { formatXLM } from '@/lib/utils';

type DashboardTab = 'escrow' | 'activity';

const mockEscrow = {
  title: 'Stellar marketplace landing build',
  client: 'GDOL...SCQN',
  freelancer: 'GBKM...91ZF',
  amount: '2,450 XLM',
  status: 'Milestone review',
};

const activityItems = [
  { event: 'Payment released to freelancer', time: '2 min ago', tone: 'success' },
  { event: 'Milestone submitted for client approval', time: '18 min ago', tone: 'info' },
  { event: 'Escrow funded on Soroban testnet', time: '41 min ago', tone: 'success' },
  { event: 'Contract state refreshed', time: '1 hr ago', tone: 'neutral' },
];

const stats = [
  {
    label: 'Total Escrows',
    value: '128',
    badge: 'Active',
    icon: ClipboardList,
  },
  {
    label: 'Total Funds Locked',
    value: '42,860 XLM',
    badge: '+8 this week',
    icon: LockKeyhole,
  },
  {
    label: 'Active Freelancers',
    value: '50+',
    badge: 'You joined',
    icon: Users,
  },
  {
    label: 'Total Clients',
    value: '36',
    badge: 'Active',
    icon: UserRound,
  },
  {
    label: 'Network',
    value: 'Testnet',
    badge: 'Online',
    icon: Globe2,
  },
];

const growthData = [
  { day: 'Mon', funds: 28600, freelancers: 31, clients: 20 },
  { day: 'Tue', funds: 30400, freelancers: 34, clients: 22 },
  { day: 'Wed', funds: 32900, freelancers: 37, clients: 25 },
  { day: 'Thu', funds: 35100, freelancers: 41, clients: 27 },
  { day: 'Fri', funds: 38600, freelancers: 44, clients: 30 },
  { day: 'Sat', funds: 41100, freelancers: 47, clients: 33 },
  { day: 'Sun', funds: 42860, freelancers: 50, clients: 36 },
];

export default function MonitoringDashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('escrow');
  const [banner, setBanner] = useState('Escrow funded. Refreshing data from Soroban testnet...');
  const {
    isConnected,
    walletAddress,
    network,
    balance,
    balanceLoading,
    balanceError,
    connectWallet,
    disconnectWallet,
  } = useFreighter();

  useEffect(() => {
    if (isConnected && walletAddress) {
      setBanner('Wallet connected. Monitoring live escrow state...');
      const timeout = window.setTimeout(() => setBanner('Milestone approved. Releasing funds through escrow...'), 3600);
      return () => window.clearTimeout(timeout);
    }

    setBanner('Public monitoring active. Connect a wallet to personalize account data.');
    return undefined;
  }, [isConnected, walletAddress]);

  const handleDisconnect = () => {
    disconnectWallet();
    setBanner('Wallet disconnected. Public monitoring remains available.');
  };

  const handleConnect = async () => {
    const connectedAddress = await connectWallet();
    setBanner(
      connectedAddress
        ? 'Wallet connected. Monitoring live escrow state...'
        : 'Wallet connection was not completed.'
    );
  };

  return (
    <main className="min-h-screen bg-[#FAF8F3] text-[#1A1A18]">
      <Navbar links={[{ label: 'Home', href: '/' }, { label: 'Monitoring', href: '/dashboard' }]} />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6">
        <section className="mb-9">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#F0EDE5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#A55A3E]">
            <span className="size-2 rounded-full bg-[#2F9B68]" aria-hidden="true" />
            Live Dashboard
          </p>
          <h1 className="font-serif text-5xl font-normal leading-tight text-[#1A1A18] sm:text-6xl">
            Escrow Overview
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#6B6A63] sm:text-lg">
            Monitor funded escrows, milestone releases, and real-time activity from the Soroban smart contract.
          </p>
        </section>

        <section className="mb-6 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <GrowthChart />

        {banner && (
          <section className="mb-6 flex items-center gap-3 rounded-2xl border border-[#2F9B68]/20 bg-[#E5F2E7] px-4 py-3 text-sm font-medium text-[#24583D]">
            <span className="size-2 rounded-full bg-[#2F9B68]" aria-hidden="true" />
            {banner}
          </section>
        )}

        <section className="mb-6 grid gap-4 lg:grid-cols-2">
          <WalletCard
            walletAddress={walletAddress}
            network={isConnected ? network || 'Testnet' : 'Not connected'}
            balance={balance}
            balanceLoading={balanceLoading}
            balanceError={balanceError}
            isConnected={isConnected}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
          <ContractCard />
        </section>

        <section className="rounded-3xl border border-black/10 bg-[#F0EDE5] p-4 sm:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <TabButton
              active={activeTab === 'escrow'}
              icon={BriefcaseBusiness}
              label="Live Escrow"
              onClick={() => setActiveTab('escrow')}
            />
            <TabButton
              active={activeTab === 'activity'}
              icon={Activity}
              label="Activity"
              onClick={() => setActiveTab('activity')}
            />
          </div>

          {activeTab === 'escrow' ? <LiveEscrow /> : <ActivityFeed />}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  badge,
  icon: Icon,
}: {
  label: string;
  value: string;
  badge: string;
  icon: LucideIcon;
}) {
  return (
    <article className="flex h-full min-h-[150px] flex-col rounded-2xl border border-black/10 bg-[#F0EDE5] p-4">
      <div className="mb-5 flex items-start justify-between gap-2">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#F2D6C9] text-[#A55A3E]">
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
        <span className="rounded-full border border-black/10 bg-[#FAF8F3] px-2.5 py-1 text-[11px] font-semibold leading-none text-[#6B6A63]">
          {badge}
        </span>
      </div>
      <div className="mt-auto">
        <p className="text-[11px] font-semibold uppercase leading-4 tracking-[0.12em] text-[#6B6A63]">{label}</p>
        <p className="mt-2 whitespace-nowrap text-[26px] font-black leading-tight tracking-tight text-[#1A1A18]">{value}</p>
      </div>
    </article>
  );
}

function GrowthChart() {
  const legend = [
    { label: 'Total Funds Locked', color: '#D9916B' },
    { label: 'Freelancers', color: '#6F7D4B' },
    { label: 'Clients', color: '#8C7A55' },
  ];

  return (
    <section className="mb-6 rounded-3xl border border-black/10 bg-[#151513] p-5 text-[#FAF8F3]">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#2A2721] text-[#D9916B]">
            <TrendingUp className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#A7A399]">Growth Overview</p>
            <p className="mt-1 text-sm text-[#D0CBBE]">Funds locked, freelancers, and clients over time.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {legend.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-2 text-xs font-medium text-[#D0CBBE]">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthData} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="fundsGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#D9916B" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#D9916B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(250,248,243,0.08)" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#A7A399', fontSize: 12 }} />
            <YAxis yAxisId="funds" tickLine={false} axisLine={false} tick={{ fill: '#A7A399', fontSize: 12 }} tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} />
            <YAxis yAxisId="people" orientation="right" tickLine={false} axisLine={false} tick={{ fill: '#A7A399', fontSize: 12 }} />
            <Tooltip
              cursor={{ stroke: 'rgba(250,248,243,0.16)' }}
              contentStyle={{
                background: '#FAF8F3',
                border: '1px solid rgba(26,26,24,0.12)',
                borderRadius: '14px',
                color: '#1A1A18',
              }}
            />
            <Area yAxisId="funds" type="monotone" dataKey="funds" name="Total Funds Locked" stroke="#D9916B" strokeWidth={2} fill="url(#fundsGradient)" />
            <Line yAxisId="people" type="monotone" dataKey="freelancers" name="Freelancers" stroke="#6F7D4B" strokeWidth={2} dot={false} />
            <Line yAxisId="people" type="monotone" dataKey="clients" name="Clients" stroke="#8C7A55" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function WalletCard({
  walletAddress,
  network,
  balance,
  balanceLoading,
  balanceError,
  isConnected,
  onConnect,
  onDisconnect,
}: {
  walletAddress: string | null;
  network: string;
  balance: number | null;
  balanceLoading: boolean;
  balanceError: string | null;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const walletExplorerUrl = walletAddress
    ? `https://stellar.expert/explorer/testnet/account/${walletAddress}`
    : 'https://stellar.expert/explorer/testnet';
  const balanceLabel = !isConnected
    ? 'Connect wallet'
    : balanceLoading
      ? 'Loading...'
      : typeof balance === 'number'
        ? `${formatXLM(balance)} XLM`
        : balanceError
          ? 'Unavailable'
          : 'Loading...';

  return (
    <DetailCard
      icon={Wallet}
      label="Wallet"
      subtext={isConnected ? 'Connected account' : 'Connect to view account details'}
      footer={
        isConnected ? (
          <>
            <a href={walletExplorerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#A55A3E]">
              Explorer <ArrowUpRight className="size-3.5" />
            </a>
            <button type="button" onClick={onDisconnect} className="inline-flex items-center gap-1 font-semibold text-[#A55A3E]">
              Disconnect <LogOut className="size-3.5" />
            </button>
          </>
        ) : (
          <button type="button" onClick={onConnect} className="inline-flex items-center gap-1 font-semibold text-[#A55A3E]">
            Connect Wallet <ArrowUpRight className="size-3.5" />
          </button>
        )
      }
    >
      <LongInfoRow label="Address" value={walletAddress || 'Not connected'} dot={isConnected ? 'green' : 'muted'} />
      <InfoRow label="Balance" value={balanceLabel} />
      <InfoRow label="Network" value={network} badge={isConnected} />
    </DetailCard>
  );
}

function ContractCard() {
  const contractExplorerUrl = `https://stellar.expert/explorer/testnet/contract/${STELLAR_CONFIG.ESCROWX_CONTRACT_ID}`;

  return (
    <DetailCard
      icon={ShieldCheck}
      label="Escrow Contract"
      subtext="Deployed on Stellar testnet"
      footer={
        <a href={contractExplorerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#A55A3E]">
          View on Explorer <ArrowUpRight className="size-3.5" />
        </a>
      }
    >
      <LongInfoRow label="Contract ID" value={STELLAR_CONFIG.ESCROWX_CONTRACT_ID} dot="green" />
      <InfoRow label="Status" value="Active" badge />
      <InfoRow label="SDK version" value="Soroban v27" />
    </DetailCard>
  );
}

function DetailCard({
  icon: Icon,
  label,
  subtext,
  children,
  footer,
}: {
  icon: LucideIcon;
  label: string;
  subtext: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-black/10 bg-[#F0EDE5] p-5">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-[#F2D6C9] text-[#A55A3E]">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B6A63]">{label}</p>
          <p className="text-sm text-[#6B6A63]">{subtext}</p>
        </div>
      </div>
      <div className="grid gap-3">{children}</div>
      <div className="mt-6 flex flex-wrap gap-4 border-t border-black/10 pt-4 text-sm">{footer}</div>
    </article>
  );
}

function InfoRow({
  label,
  value,
  dot,
  badge,
}: {
  label: string;
  value: string;
  dot?: 'green' | 'muted';
  badge?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#FAF8F3] px-4 py-3">
      <span className="shrink-0 text-sm font-medium text-[#6B6A63]">{label}</span>
      <span className="flex min-w-0 items-center justify-end gap-2 text-right text-sm font-semibold text-[#1A1A18]">
        {dot && <span className={`size-2 shrink-0 rounded-full ${dot === 'green' ? 'bg-[#2F9B68]' : 'bg-[#A7A399]'}`} />}
        {badge ? (
          <span className="rounded-full bg-[#E5F2E7] px-3 py-1 text-xs font-bold text-[#24583D]">{value}</span>
        ) : (
          <span className="min-w-0">{value}</span>
        )}
      </span>
    </div>
  );
}

function LongInfoRow({
  label,
  value,
  dot,
}: {
  label: string;
  value: string;
  dot: 'green' | 'muted';
}) {
  return (
    <div className="rounded-2xl bg-[#FAF8F3] px-4 py-3">
      <span className="block text-sm font-medium text-[#6B6A63]">{label}</span>
      <span className="mt-2 flex min-w-0 items-start gap-2 text-left">
        <span className={`mt-2 size-2 shrink-0 rounded-full ${dot === 'green' ? 'bg-[#2F9B68]' : 'bg-[#A7A399]'}`} />
        <span className="min-w-0 break-all font-mono text-[11px] font-semibold leading-relaxed text-[#1A1A18]">
          {value}
        </span>
      </span>
    </div>
  );
}

function TabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
        active ? 'bg-[#1A1A18] text-[#FAF8F3]' : 'border border-black/10 bg-[#FAF8F3] text-[#6B6A63] hover:text-[#1A1A18]'
      }`}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

function LiveEscrow() {
  return (
    <div className="rounded-3xl bg-[#FAF8F3] p-5">
      <div className="grid gap-4 lg:grid-cols-5">
        <InfoBlock label="Job Title" value={mockEscrow.title} className="lg:col-span-2" />
        <InfoBlock label="Client" value={mockEscrow.client} />
        <InfoBlock label="Freelancer" value={mockEscrow.freelancer} />
        <InfoBlock label="Locked Amount" value={mockEscrow.amount} />
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#E5F2E7] px-4 py-3 text-sm font-semibold text-[#24583D]">
        <CheckCircle2 className="size-4" />
        {mockEscrow.status}
      </div>
    </div>
  );
}

function ActivityFeed() {
  return (
    <div className="grid gap-3 rounded-3xl bg-[#FAF8F3] p-5">
      {activityItems.map((item) => (
        <div key={`${item.event}-${item.time}`} className="flex items-start justify-between gap-4 rounded-2xl border border-black/10 bg-[#F0EDE5] px-4 py-3">
          <div className="flex items-start gap-3">
            <span className={`mt-2 size-2 rounded-full ${item.tone === 'success' ? 'bg-[#2F9B68]' : item.tone === 'info' ? 'bg-[#A55A3E]' : 'bg-[#A7A399]'}`} />
            <p className="text-sm font-semibold text-[#1A1A18]">{item.event}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[#6B6A63]">
            <Clock3 className="size-3.5" />
            {item.time}
          </span>
        </div>
      ))}
    </div>
  );
}

function InfoBlock({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-2xl border border-black/10 bg-[#F0EDE5] p-4 ${className}`}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6B6A63]">{label}</p>
      <p className="mt-2 truncate text-base font-black text-[#1A1A18]">{value}</p>
    </div>
  );
}
