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
    <section id="about" className="relative bg-[#F0EDE5] px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#56633D]">Problem / Solution</p>
          <h2 className="text-balance font-serif text-4xl leading-tight tracking-normal text-[#1A1A18] sm:text-6xl">
            Trust Shouldn't Be The Hardest Part Of Freelancing.
          </h2>
          <p className="mt-5 text-base leading-8 text-[#6B6A63] sm:text-lg">
            Traditional platforms ask both sides to trust the marketplace first. EscrowX makes secured payment the starting point.
          </p>
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
          ? 'rounded-2xl border border-black/10 bg-[#FAF8F3] p-6 sm:p-8'
          : 'rounded-2xl border border-black/10 bg-[#FAF8F3]/70 p-6 sm:p-8'
      }
    >
      <h3 className="mb-7 text-xl font-black text-[#1A1A18]">{title}</h3>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#6B6A63] sm:text-base">
            <Icon
              className={tone === 'accent' ? 'mt-1 size-5 shrink-0 text-[#56633D]' : 'mt-1 size-5 shrink-0 text-[#8D8A80]'}
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
