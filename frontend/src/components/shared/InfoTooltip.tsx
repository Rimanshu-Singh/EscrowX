import * as Tooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoTooltipProps {
  label: string;
  children: string;
  className?: string;
}

export function InfoTooltip({ label, children, className }: InfoTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            aria-label={`What is ${label}?`}
            className={cn(
              'inline-flex size-5 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-elevated hover:text-[#5B6BF8] focus-visible:outline-[#5B6BF8]',
              className
            )}
          >
            <Info className="size-3.5" aria-hidden="true" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={8}
            collisionPadding={12}
            className="z-[90] max-w-[min(280px,calc(100vw-32px))] rounded-[8px] border border-[#E4E8F0] bg-white px-3 py-2 text-[11px] font-medium leading-relaxed text-[#475569] shadow-xl dark:border-border dark:bg-card dark:text-text-secondary"
          >
            {children}
            <Tooltip.Arrow className="fill-white dark:fill-card" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

