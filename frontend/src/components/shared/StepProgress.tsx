'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  label: string;
  description?: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  return (
    <div className={cn('flex w-full min-w-0 items-start gap-0 overflow-hidden', className)}>
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex min-w-0 flex-1 items-start last:flex-none">
            <div className="flex min-w-0 flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 sm:h-9 sm:w-9',
                  isCompleted
                    ? 'bg-[#5B6BF8] border-[#5B6BF8] text-white'
                    : isActive
                    ? 'bg-white border-[#5B6BF8] text-[#5B6BF8] shadow-md shadow-[#5B6BF8]/20'
                    : 'bg-white border-[#E4E8F0] text-[#9CA3AF]'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <div className="flex min-w-0 flex-col items-center text-center">
                <span
                  className={cn(
                    'max-w-[58px] whitespace-normal break-words text-[9px] font-semibold uppercase leading-tight tracking-normal sm:max-w-none sm:whitespace-nowrap sm:text-[11px] sm:tracking-[0.08em]',
                    isActive ? 'text-[#5B6BF8]' : isCompleted ? 'text-[#0F1117]' : 'text-[#9CA3AF]'
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="max-w-16 text-[10px] leading-tight text-[#9CA3AF] sm:max-w-20">{step.description}</span>
                )}
              </div>
            </div>

            {!isLast && (
              <div
                className={cn(
                  'mx-1 mt-4 h-0.5 flex-1 transition-all duration-500 sm:mx-3',
                  isCompleted ? 'bg-[#5B6BF8]' : 'bg-[#E4E8F0]'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
