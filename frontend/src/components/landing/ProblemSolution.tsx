import { CircleCheck, CircleX } from 'lucide-react';
import { motion } from 'framer-motion';

const traditional = [
  'Payment uncertainty',
  'Platform-controlled funds',
  'Chargebacks and disputes',
  'Trust before security',
];

const escrowx = [
  'Funds secured before work begins',
  'Smart-contract controlled escrow',
  'Transparent on-chain settlement',
  'Security before trust',
];

export function ProblemSolution() {
  return (
    <section id="about" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#93c5fd]">Problem / Solution</p>
          <h2 className="text-balance text-4xl font-black leading-tight tracking-normal text-white sm:text-5xl md:text-6xl">
            Trust Shouldn't Be The Hardest Part Of Freelancing.
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          <ComparisonColumn
            title="Traditional Freelancing"
            tone="muted"
            items={traditional}
            icon="bad"
          />
          <ComparisonColumn
            title="EscrowX"
            tone="accent"
            items={escrowx}
            icon="good"
          />
        </div>
      </div>
    </section>
  );
}

function ComparisonColumn({
  title,
  items,
  icon,
  tone,
}: {
  title: string;
  items: string[];
  icon: 'bad' | 'good';
  tone: 'muted' | 'accent';
}) {
  const Icon = icon === 'good' ? CircleCheck : CircleX;

  return (
    <div
      className={
        tone === 'accent'
          ? 'rounded-[8px] border border-[#60a5fa]/20 bg-[#07111f]/80 p-6 shadow-[0_22px_80px_rgba(37,99,235,0.12)] sm:p-8'
          : 'rounded-[8px] border border-white/10 bg-white/[0.025] p-6 sm:p-8'
      }
    >
      <h3 className="mb-7 text-xl font-black text-white">{title}</h3>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-300 sm:text-base">
            <Icon
              className={tone === 'accent' ? 'mt-1 size-5 shrink-0 text-emerald-300' : 'mt-1 size-5 shrink-0 text-slate-500'}
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
