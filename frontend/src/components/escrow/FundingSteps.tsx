import React from 'react';
import { Check, Loader2 } from 'lucide-react';

interface FundingStepsProps {
  step: 'idle' | 'building' | 'signing' | 'submitting' | 'confirming' | 'done' | 'error';
}

interface StepItem {
  id: number;
  label: string;
  subtitle: string;
  keys: string[];
}

const STEPS_DATA: StepItem[] = [
  {
    id: 1,
    label: 'Building Transaction',
    subtitle: 'Preparing your XLM payment...',
    keys: ['building'],
  },
  {
    id: 2,
    label: 'Waiting for Signature',
    subtitle: 'Freighter wallet popup opened. Please sign.',
    keys: ['signing'],
  },
  {
    id: 3,
    label: 'Submitting to Stellar',
    subtitle: 'Broadcasting to Stellar Testnet...',
    keys: ['submitting'],
  },
  {
    id: 4,
    label: 'Confirming on Backend',
    subtitle: 'Updating escrow status on platform...',
    keys: ['confirming'],
  },
  {
    id: 5,
    label: 'Escrow Funded!',
    subtitle: 'Funds locked. Freelancer notified!',
    keys: ['done'],
  },
];

export const FundingSteps: React.FC<FundingStepsProps> = ({ step }) => {
  // Map current hook step to active index
  const getStepStatus = (index: number, itemKeys: string[]) => {
    const stepOrder = ['idle', 'building', 'signing', 'submitting', 'confirming', 'done'];
    const currentIdx = stepOrder.indexOf(step);
    
    // Find the index of the first key in stepOrder
    const targetIdx = stepOrder.indexOf(itemKeys[0]);

    if (step === 'done') {
      return 'completed';
    }

    if (currentIdx > targetIdx) {
      return 'completed';
    } else if (currentIdx === targetIdx) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  return (
    <div className="bg-[#161622] border border-[#252538] rounded-xl p-6 space-y-6 w-full text-slate-100 shadow-md">
      <div className="space-y-1">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#A78BFA]">Transaction Progress</h4>
        <p className="text-[10px] text-slate-400">Please do not refresh or close this window.</p>
      </div>

      <div className="space-y-5 relative">
        {STEPS_DATA.map((item, idx) => {
          const status = getStepStatus(idx, item.keys);
          const isLast = idx === STEPS_DATA.length - 1;

          return (
            <div key={item.id} className="flex items-start gap-4 relative group">
              {/* Connector line */}
              {!isLast && (
                <div 
                  className={`absolute left-[13px] top-7 bottom-[-13px] w-[2px] transition-colors duration-500 ${
                    status === 'completed' ? 'bg-[#8B5CF6]' : 'bg-[#2E2E44]'
                  }`} 
                />
              )}

              {/* Step indicator circle */}
              <div className="z-10 flex items-center justify-center shrink-0">
                {status === 'completed' ? (
                  <div className="w-7 h-7 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <Check className="w-4 h-4 stroke-[3px]" />
                  </div>
                ) : status === 'current' ? (
                  <div className="w-7 h-7 rounded-full border-2 border-[#8B5CF6] bg-[#1E1E2F] flex items-center justify-center text-[#8B5CF6] animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                    <Loader2 className="w-4 h-4 animate-spin stroke-[2.5px]" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border-2 border-[#2E2E44] bg-[#161622] flex items-center justify-center text-slate-500">
                    <span className="text-xs font-bold font-mono">{item.id}</span>
                  </div>
                )}
              </div>

              {/* Text content */}
              <div className="space-y-0.5 pt-0.5">
                <p 
                  className={`text-xs font-bold transition-colors duration-300 ${
                    status === 'completed' ? 'text-[#10B981]' :
                    status === 'current' ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </p>
                <p 
                  className={`text-[10px] transition-colors duration-300 ${
                    status === 'current' ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
