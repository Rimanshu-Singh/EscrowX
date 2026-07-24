import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Navbar } from '@/components/landing/Navbar';
import { ProblemSolution } from '@/components/landing/ProblemSolution';
import {
  ClosingCta,
  PoweredBy,
  StatsBar,
  Testimonials,
  WhyEscrowX,
} from '@/components/landing/EditorialSections';

export default function LandingPage() {
  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-[#FAF8F3] text-[#1A1A18] selection:bg-[#9AA879]/25 selection:text-[#1A1A18]">
      <div className="fixed inset-0 z-0 bg-[#FAF8F3]" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(26,26,24,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,24,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_50%_0%,rgba(154,168,121,0.24),rgba(250,248,243,0)_62%)]" />
      </div>

      <Navbar />
      <div className="relative z-10">
        <Hero />
        <StatsBar />
        <WhyEscrowX />
        <ProblemSolution />
        <HowItWorks />
        <PoweredBy />
        <Testimonials />
        <ClosingCta />
        <Footer />
      </div>
    </main>
  );
}
