import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Navbar } from '@/components/landing/Navbar';
import { ProblemSolution } from '@/components/landing/ProblemSolution';

export default function LandingPage() {
  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-[#030712] text-white selection:bg-[#60a5fa]/25 selection:text-white">
      <div className="fixed inset-0 z-0 bg-[#030712]" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.24),rgba(3,7,18,0)_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(3,7,18,0)_0%,rgba(3,7,18,0.42)_68%,rgba(3,7,18,0.92)_100%)]" />
      </div>

      <Navbar />
      <div className="relative z-10">
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <Footer />
      </div>
    </main>
  );
}
