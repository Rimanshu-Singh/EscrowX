import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center px-4 pb-12 pt-28 sm:px-6 sm:pt-32">
      <div className="pointer-events-none absolute left-1/2 top-24 h-40 w-[min(860px,80vw)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(96,165,250,0.22),rgba(3,7,18,0)_70%)] blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative mx-auto flex w-full max-w-[1180px] flex-col items-center text-center"
      >
        <h1 className="max-w-[1180px] text-balance text-[clamp(3rem,5vw,5.9rem)] font-semibold leading-[1.04] tracking-normal text-white">
          Easy Escrows For Everyone,
          <span className="block">Anywhere.</span>
        </h1>

        <p className="mt-8 font-serif text-[clamp(2.3rem,4.35vw,5rem)] italic leading-none tracking-normal text-[#60a5fa]">
          Seamlessly On Stellar.
        </p>

        <p className="mt-8 max-w-[720px] text-balance text-[clamp(1rem,1.45vw,1.55rem)] leading-[1.65] tracking-normal text-slate-400">
          No Middlemen. No delays. Just secure, smart contract-powered
          <span className="block">agreements.</span>
        </p>

        <div className="mt-16 flex w-full max-w-[600px] flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
          <a
            href="#"
            className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full bg-white px-7 text-[14px] font-black uppercase tracking-normal text-[#030712] shadow-[0_18px_48px_rgba(255,255,255,0.11)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-[0_22px_56px_rgba(96,165,250,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-w-[235px]"
          >
            CONTINUE AS CLIENT
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href="#"
            className="inline-flex min-h-[58px] items-center justify-center rounded-full border border-white/10 bg-[#07111f]/70 px-7 text-[14px] font-black uppercase tracking-normal text-white shadow-[0_16px_42px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-0.5 hover:border-[#60a5fa]/45 hover:bg-[#091827] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#60a5fa] sm:min-w-[270px]"
          >
            CONTINUE AS FREELANCER
          </a>
        </div>
      </motion.div>
    </section>
  );
}
