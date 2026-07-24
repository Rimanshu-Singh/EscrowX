import { BriefcaseBusiness, LockKeyhole, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Fund',
    description: 'Client creates a project and locks payment into escrow.',
    icon: LockKeyhole,
  },
  {
    number: '02',
    title: 'Deliver',
    description: 'Freelancer works knowing the funds are already secured.',
    icon: BriefcaseBusiness,
  },
  {
    number: '03',
    title: 'Release',
    description: 'Client approves delivery and the smart contract releases payment.',
    icon: ShieldCheck,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#93c5fd]">How EscrowX Works</p>
          <h2 className="text-balance text-4xl font-black leading-tight tracking-normal text-white sm:text-5xl">
            Three steps from locked funds to final payout.
          </h2>
        </motion.div>

        <div className="relative grid gap-4 md:grid-cols-3">
          <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-12 hidden h-px bg-gradient-to-r from-transparent via-[#60a5fa]/35 to-transparent md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative rounded-[8px] border border-white/10 bg-[#07111f]/60 p-6 sm:p-7"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-sm font-black tracking-[0.18em] text-[#60a5fa]">{step.number}</span>
                  <span className="grid size-10 place-items-center rounded-full border border-white/10 bg-black/50">
                    <Icon className="size-5 text-slate-300" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{step.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
