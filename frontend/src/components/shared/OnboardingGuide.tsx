import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { BookOpen, CheckCircle2, Lock, X } from 'lucide-react';
import { motion } from 'framer-motion';

const STORAGE_KEY = 'escrowx_onboarding_completed';
const OPEN_EVENT = 'escrowx:open-onboarding';

const guideSteps = [
  'Connect your wallet',
  'Create or join a contract',
  'Fund escrow',
  'Complete milestones',
  'Approve and release payment',
];

export function openOnboardingGuide() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function OnboardingGuide() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const completed = window.localStorage.getItem(STORAGE_KEY) === 'true';
    if (!completed) {
      const timer = window.setTimeout(() => setOpen(true), 450);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  const completeGuide = () => {
    window.localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    }
    setOpen(nextOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-slate-950/45 backdrop-blur-xs" />
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            className="fixed left-1/2 top-1/2 z-[81] max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[16px] border border-[#E4E8F0] bg-white p-0 shadow-2xl dark:border-border dark:bg-card"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#EEF2F7] px-5 py-4 dark:border-border">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-[#EEF0FF] text-[#5B6BF8] dark:bg-purple-950/30">
                  <Lock className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <Dialog.Title className="text-base font-black tracking-tight text-[#0F172A] dark:text-text-primary">
                    Welcome to EscrowX
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-xs leading-relaxed text-[#64748B] dark:text-text-secondary">
                    Secure freelance work through milestone-based payments powered by Stellar.
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close onboarding guide"
                  className="rounded-[8px] p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-surface-elevated"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <div className="px-5 py-5">
              <div className="space-y-3">
                {guideSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-[10px] border border-[#EEF2F7] bg-[#FAFBFC] px-3 py-3 dark:border-border dark:bg-surface-elevated">
                    <span className="grid size-7 shrink-0 place-items-center rounded-[8px] bg-white text-[10px] font-black text-[#5B6BF8] shadow-xs dark:bg-card">
                      {index + 1}
                    </span>
                    <span className="text-sm font-bold text-[#0F172A] dark:text-text-primary">{step}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[12px] border border-[#DDE2FF] bg-[#F7F8FF] p-4 text-xs leading-relaxed text-[#475569] dark:border-purple-900/40 dark:bg-purple-950/20 dark:text-text-secondary">
                <div className="mb-1 flex items-center gap-2 font-bold text-[#5B6BF8]">
                  <BookOpen className="size-4" aria-hidden="true" />
                  What to remember
                </div>
                Escrow means the funds are held until the agreed work is reviewed. Milestones break the work into clear checkpoints.
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[#EEF2F7] px-5 py-4 sm:flex-row sm:justify-end dark:border-border">
              <button
                type="button"
                onClick={completeGuide}
                className="rounded-[10px] border border-[#E4E8F0] px-4 py-2.5 text-xs font-bold text-[#64748B] transition-colors hover:bg-slate-50 dark:border-border dark:text-text-secondary dark:hover:bg-surface-elevated"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={completeGuide}
                className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#5B6BF8] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#4757E8]"
              >
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Start Guide
              </button>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
