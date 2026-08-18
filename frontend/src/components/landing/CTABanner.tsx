'use client';

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CTABanner() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[24px] p-6 text-center sm:p-12 md:p-16"
          style={{ background: 'linear-gradient(135deg, #5B6BF8 0%, #7B68EE 100%)' }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }}
            />
          </div>
          {/* Blobs */}
          <div className="absolute left-0 top-0 hidden h-64 w-64 rounded-full bg-white/5 blur-3xl sm:block" />
          <div className="absolute bottom-0 right-0 hidden h-64 w-64 rounded-full bg-white/5 blur-3xl sm:block" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white/80 text-[11px] font-semibold uppercase tracking-[0.1em] mb-6">
              Get started today
            </div>
            <h2 className="mb-4 text-[32px] font-extrabold leading-tight tracking-normal text-white sm:text-[40px] md:text-[52px]">
              Start your first escrow
              <br />
              in under 60 seconds.
            </h2>
            <p className="mx-auto mb-8 max-w-[480px] text-base leading-relaxed text-white/70 sm:text-[17px]">
              No sign-up, no KYC, no paperwork. Just connect your Freighter wallet and create a trustless escrow instantly.
            </p>

            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                to="/escrow/new"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-white px-8 py-3.5 font-bold text-[#5B6BF8] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F8F9FB] hover:shadow-xl"
              >
                Connect Wallet
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-white/30 px-8 py-3.5 font-semibold text-white transition-all duration-200 hover:bg-white/10"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
