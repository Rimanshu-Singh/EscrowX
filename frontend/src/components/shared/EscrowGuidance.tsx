import { ArrowRight, CheckCircle2, Clock, RefreshCcw, ShieldCheck, Wallet } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

const guidance: Record<string, { title: string; description: string; icon: React.ElementType }> = {
  CREATED: {
    title: 'Next step: Fund the escrow before work begins.',
    description: 'The contract exists, but the freelancer should not begin until the client deposits the agreed amount.',
    icon: Wallet,
  },
  PENDING: {
    title: 'Next step: Fund the escrow before work begins.',
    description: 'The escrow is waiting for the client deposit.',
    icon: Wallet,
  },
  FUNDED: {
    title: 'Funds are secured. Work can begin.',
    description: 'The client deposit is locked for this milestone, so the freelancer can start with payment protection in place.',
    icon: ShieldCheck,
  },
  IN_PROGRESS: {
    title: 'The milestone is in progress.',
    description: 'The freelancer should complete the agreed scope and share progress or deliverables inside EscrowX.',
    icon: Clock,
  },
  DELIVERED: {
    title: 'The freelancer submitted this milestone.',
    description: 'The client should review the submitted work, then approve it, request changes, or raise a dispute if needed.',
    icon: ArrowRight,
  },
  UNDER_REVIEW: {
    title: 'The milestone is waiting for client review.',
    description: 'The client should check the submission and decide the next action.',
    icon: ArrowRight,
  },
  REVISION_REQUESTED: {
    title: 'Changes were requested.',
    description: 'The freelancer should review the feedback, update the work, and submit a new version.',
    icon: RefreshCcw,
  },
  APPROVED: {
    title: 'The milestone has been approved.',
    description: 'Approval confirms the work is accepted. The final payment release should follow the contract flow.',
    icon: CheckCircle2,
  },
  COMPLETED: {
    title: 'Payment has successfully been released.',
    description: 'The escrow is complete and the funds have moved according to the contract outcome.',
    icon: CheckCircle2,
  },
  RELEASED: {
    title: 'Payment has successfully been released.',
    description: 'The freelancer has been paid from the secured escrow funds.',
    icon: CheckCircle2,
  },
  DISPUTED: {
    title: 'This escrow is in dispute.',
    description: 'Funds remain protected while the dispute is reviewed through the platform process.',
    icon: RefreshCcw,
  },
  REFUNDED: {
    title: 'Funds have been returned.',
    description: 'This escrow is closed with a refund outcome.',
    icon: RefreshCcw,
  },
  working: {
    title: 'This milestone is being worked on.',
    description: 'The freelancer should submit deliverables when the milestone scope is complete.',
    icon: Clock,
  },
  delivered: {
    title: 'The freelancer submitted this milestone.',
    description: 'The client should review the delivery and approve it or request changes.',
    icon: ArrowRight,
  },
  approved: {
    title: 'The milestone has been approved.',
    description: 'The delivery is accepted and payment release is complete or in progress.',
    icon: CheckCircle2,
  },
  revision_requested: {
    title: 'Changes were requested.',
    description: 'The freelancer should address the feedback and resubmit the milestone.',
    icon: RefreshCcw,
  },
};

interface EscrowGuidanceProps {
  status?: string | null;
  className?: string;
}

export function EscrowGuidance({ status, className }: EscrowGuidanceProps) {
  if (!status) return null;

  const item = guidance[status] || {
    title: 'Check the current escrow status.',
    description: 'Review the action panel and transaction history to decide what should happen next.',
    icon: ArrowRight,
  };
  const Icon = item.icon;

  return (
    <section className={className}>
      <div className="rounded-xl border border-[#DDE2FF] bg-[#F7F8FF] p-4 shadow-xs dark:border-purple-900/40 dark:bg-purple-950/20">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-[9px] bg-white text-[#5B6BF8] shadow-xs dark:bg-card">
            <Icon className="size-4.5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#5B6BF8]">What happens now?</h3>
              <InfoTooltip label="Escrow status">This guidance is based on the current contract or milestone state.</InfoTooltip>
            </div>
            <p className="mt-1 text-sm font-bold leading-snug text-[#0F172A] dark:text-text-primary">{item.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#64748B] dark:text-text-secondary">{item.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

