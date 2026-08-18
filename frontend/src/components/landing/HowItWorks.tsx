import { BriefcaseBusiness, CircleCheck, ClipboardCheck, LockKeyhole, Users, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { InfoTooltip } from '@/components/shared/InfoTooltip';

const steps = [
  {
    number: '01',
    title: 'Connect Your Wallet',
    description: 'Connect your Stellar wallet to securely interact with EscrowX.',
    icon: Wallet,
  },
  {
    number: '02',
    title: 'Create or Accept Work',
    description: 'Clients create contracts or projects, and freelancers participate in agreed work.',
    icon: BriefcaseBusiness,
  },
  {
    number: '03',
    title: 'Fund the Escrow',
    description: 'The client deposits funds into the Stellar escrow contract before work begins.',
    icon: LockKeyhole,
  },
  {
    number: '04',
    title: 'Submit & Review Milestones',
    description: 'Freelancers submit completed milestones and clients review the work.',
    icon: ClipboardCheck,
  },
  {
    number: '05',
    title: 'Release Payment',
    description: 'Once approved, escrowed funds are securely released to the freelancer.',
    icon: CircleCheck,
  },
];

const roles = [
  {
    title: 'Client',
    description: 'Creates jobs or contracts, selects a freelancer, funds escrow, reviews milestones, and approves payment.',
  },
  {
    title: 'Freelancer',
    description: 'Applies for or accepts work, completes milestones, submits work, and receives payment after approval.',
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
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#56633D]">How EscrowX Works</p>
          <h2 className="text-balance font-serif text-4xl leading-tight tracking-normal text-[#1A1A18] sm:text-6xl">
            How EscrowX Works
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#6B6A63]">
            Secure freelance payments through milestone-based escrow on Stellar.
          </p>
        </motion.div>

        <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="pointer-events-none absolute left-[10%] right-[10%] top-12 hidden h-px bg-black/10 lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative rounded-2xl border border-black/10 bg-[#F0EDE5] p-5 sm:p-6"
              >
                <div className="mb-7 flex items-center justify-between">
                  <span className="font-serif text-3xl text-[#8D8A80]">{step.number}</span>
                  <span className="grid size-10 place-items-center rounded-full bg-[#DDE4CC] text-[#56633D]">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-black leading-tight text-[#1A1A18]">{step.title}</h3>
                  {step.title.includes('Escrow') && (
                    <InfoTooltip label="Escrow">Funds are securely held until the agreed milestone or work is approved.</InfoTooltip>
                  )}
                  {step.title.includes('Milestones') && (
                    <InfoTooltip label="Milestone">A defined stage of work that can be submitted and approved separately.</InfoTooltip>
                  )}
                </div>
                <p className="mt-3 text-sm leading-7 text-[#6B6A63]">{step.description}</p>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="mt-6 rounded-2xl border border-black/10 bg-[#E7E2D6] p-5 sm:p-6"
        >
          <div className="mb-5 flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full bg-[#DDE4CC] text-[#56633D]">
              <Users className="size-5" aria-hidden="true" />
            </span>
            <h3 className="text-xl font-black text-[#1A1A18]">Choose the role that matches your workflow</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((role) => (
              <div key={role.title} className="rounded-xl border border-black/10 bg-[#FAF8F3] p-5">
                <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[#56633D]">{role.title}</h4>
                <p className="mt-2 text-sm leading-7 text-[#6B6A63]">{role.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
