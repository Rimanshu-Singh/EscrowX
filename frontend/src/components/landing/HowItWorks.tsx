import { BriefcaseBusiness, CircleCheck, LockKeyhole, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Connect Wallet',
    description: 'Connect a Stellar wallet and choose whether you are starting as client or freelancer.',
    icon: Wallet,
  },
  {
    number: '02',
    title: 'Client Funds Escrow',
    description: 'The client funds the job before work begins, locking payment into Soroban escrow.',
    icon: LockKeyhole,
  },
  {
    number: '03',
    title: 'Freelancer Delivers Work',
    description: 'The freelancer delivers with confidence because the payment is already secured.',
    icon: BriefcaseBusiness,
  },
  {
    number: '04',
    title: 'Client Approves',
    description: 'Approval releases locked funds directly through the smart contract.',
    icon: CircleCheck,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-[#FAF8F3] px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#56633D]">How It Works</p>
          <h2 className="text-balance font-serif text-4xl leading-tight tracking-normal text-[#1A1A18] sm:text-6xl">
            Four calm steps from wallet to payout.
          </h2>
        </motion.div>

        <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-12 hidden h-px bg-black/10 lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative rounded-2xl border border-black/10 bg-[#F0EDE5] p-6 sm:p-7"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-serif text-3xl text-[#8D8A80]">{step.number}</span>
                  <span className="grid size-10 place-items-center rounded-full bg-[#DDE4CC] text-[#56633D]">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#1A1A18]">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6B6A63]">{step.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
