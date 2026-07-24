import { ArrowRight, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { authService } from '@/services/api';

type LandingRole = 'CLIENT' | 'FREELANCER';

export function Hero() {
  const navigate = useNavigate();
  const { isConnected, walletAddress } = useAuthStore();
  const { showToast } = useToastStore();

  const handleContinue = async (role: LandingRole) => {
    if (!isConnected || !walletAddress) {
      showToast('Please connect your wallet to continue.', 'error');
      return;
    }

    localStorage.setItem('selectedRole', role);

    try {
      const res = await authService.checkWallet(walletAddress);
      navigate(res.exists ? '/auth/sign-in' : '/auth/sign-up');
    } catch {
      showToast('Authentication server unreachable. Redirecting to registration...', 'info');
      setTimeout(() => {
        navigate('/auth/sign-up');
      }, 1200);
    }
  };

  return (
    <section id="home" className="relative flex min-h-screen items-center px-4 pb-14 pt-24 sm:px-6 lg:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative mx-auto flex w-full max-w-6xl flex-col items-center text-center"
      >
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#F0EDE5] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#56633D]">
          <Circle className="size-2 fill-current text-green-400 animate-pulse " aria-hidden="true" />
          Stellar Soroban - Escrow Smart Contracts
        </p>

        <h1 className="mx-auto max-w-4xl text-balance font-serif text-[clamp(2.85rem,5.6vw,4.9rem)] font-normal leading-[0.98] tracking-normal text-[#1A1A18]">
          Easy Escrows For Everyone,
          <span className="block">Anywhere.</span>
        </h1>

        <p className="mt-4 font-serif text-[clamp(2rem,3.9vw,3.65rem)] font-normal italic leading-[1] tracking-normal text-[#6F7D4B]">
          Seamlessly On Stellar.
        </p>

        <p className="mt-5 max-w-[720px] text-balance text-[clamp(1rem,1.25vw,1.125rem)] font-normal leading-[1.65] tracking-normal text-[#6B6A63]">
          No Middlemen. No delays. Just secure, smart contract-powered
          <span className="block">agreements.</span>
        </p>

        <div className="mt-8 flex w-full max-w-[610px] flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => handleContinue('CLIENT')}
            className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-[#1A1A18] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.04em] text-[#FAF8F3] transition duration-200 hover:-translate-y-0.5 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9AA879] sm:min-w-[230px]"
          >
            CONTINUE AS CLIENT
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => handleContinue('FREELANCER')}
            className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-black/20 bg-transparent px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.04em] text-[#1A1A18] transition duration-200 hover:-translate-y-0.5 hover:bg-[#F0EDE5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9AA879] sm:min-w-[260px]"
          >
            CONTINUE AS FREELANCER
          </button>
        </div>
      </motion.div>
    </section>
  );
}
