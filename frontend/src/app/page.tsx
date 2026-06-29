import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Lock, Sparkles, ChevronRight, Play, ArrowRight, CheckCircle2,
  Cpu, Users, BarChart3, HelpCircle, Activity, Award,
  ChevronDown, CheckCircle, Star, ArrowUpRight, Copy, Terminal,
  ExternalLink, Zap, RefreshCw, Send, Check, ShieldAlert,
  Moon, Code, Landmark, Wallet, Globe, LockKeyhole, Calendar, Search
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { WalletButton } from '@/components/wallet/WalletButton';
import { useToastStore } from '../store/toastStore';
import { authService } from '../services/api';

// Import UI Primitives
import { Particles } from '@/components/ui/particles';
import { BorderBeam } from '@/components/ui/border-beam';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { Marquee } from '@/components/ui/marquee';
import { SpotlightCard } from '@/components/ui/spotlight-card';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isConnected, walletAddress } = useAuthStore();
  const { showToast } = useToastStore();
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  // Custom states for interactive preview dashboard
  const [dashboardTab, setDashboardTab] = useState<'escrows' | 'logs' | 'disputes'>('escrows');
  const [inspectorContract, setInspectorContract] = useState({
    id: 'CAQZ5VRMGHPKMHWRJTPQNXW...',
    client: 'GBXPKM7VSKBKX5JKJHLX...',
    freelancer: 'GDKPQN5XCZK8MNBRTV...',
    amount: '10,842.50 XLM',
    status: 'FUNDED',
    timestamp: 'Just now'
  });
  const [isInspectorLoading, setIsInspectorLoading] = useState(false);

  // Scroll tracking for floating navbar shrink effect
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handler to copy contract address
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Address copied to clipboard!", "info");
  };

  // Simulate updating Soroban state inspector
  const handleInspectRefresh = () => {
    setIsInspectorLoading(true);
    setTimeout(() => {
      setIsInspectorLoading(false);
      const randomAmounts = ['12,450.00 USDC', '5,000.00 XLM', '18,200.00 USDC', '9,120.50 XLM'];
      const randomStatuses = ['FUNDED', 'RELEASED', 'IN_DISPUTE', 'DELIVERED'];
      const randomAmount = randomAmounts[Math.floor(Math.random() * randomAmounts.length)];
      const randomStatus = randomStatuses[Math.floor(Math.random() * randomStatuses.length)];

      setInspectorContract({
        id: `CAQZ${Math.random().toString(36).substring(2, 10).toUpperCase()}...${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        client: `GBXP${Math.random().toString(36).substring(2, 8).toUpperCase()}...`,
        freelancer: `GDKP${Math.random().toString(36).substring(2, 8).toUpperCase()}...`,
        amount: randomAmount,
        status: randomStatus,
        timestamp: '1s ago'
      });
      showToast("Soroban State Refreshed", "info");
    }, 800);
  };

  // Keep original CTA handler logic exactly
  const handleCTA = async (role: 'CLIENT' | 'FREELANCER') => {
    if (!isConnected || !walletAddress) {
      showToast("Please connect your Stellar wallet first.", "error");
      return;
    }

    localStorage.setItem('selectedRole', role);

    try {
      showToast("Checking wallet registration...", "info");
      const res = await authService.checkWallet(walletAddress);
      if (res.exists) {
        navigate('/auth/sign-in');
      } else {
        navigate('/auth/sign-up');
      }
    } catch (err: any) {
      console.error("Wallet check error:", err);
      showToast("Authentication server unreachable. Redirecting to registration...", "info");
      // Resilient fallback: redirect to sign-up if server check fails
      setTimeout(() => {
        navigate('/auth/sign-up');
      }, 1200);
    }
  };

  // Bento Card States
  const [bentoSearchQuery, setBentoSearchQuery] = useState('');
  const [selectedBentoEscrow, setSelectedBentoEscrow] = useState<string | null>(null);
  const [bentoValuationInput, setBentoValuationInput] = useState('2500');
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const bentoSearchData = [
    { id: 'CAQZ5VRM...PQNXW', partner: 'Web3Labs Corp (Client)', val: '12,500 USDC', status: 'FUNDED' },
    { id: 'CAQZ9YTK...99KAX', partner: 'Solidity Devs (Freelancer)', val: '4,800 XLM', status: 'RELEASED' },
    { id: 'CAQZ3HJK...11LMY', partner: 'Design Studio (Client)', val: '18,200 USDC', status: 'IN_DISPUTE' },
    { id: 'CAQZ7WQS...88VAA', partner: 'Rust Audits (Freelancer)', val: '30,000 XLM', status: 'DELIVERED' },
  ];

  const filteredBentoSearch = bentoSearchData.filter(item =>
    item.partner.toLowerCase().includes(bentoSearchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(bentoSearchQuery.toLowerCase())
  );

  const steps = [
    {
      title: 'Define Terms & Create Job',
      desc: 'Formulate milestones, delivery dates, and reward values. Both parties sign cryptographically.',
      icon: <Code className="w-5 h-5 text-violet-400" />
    },
    {
      title: 'Lock Funds in Soroban',
      desc: 'Client locks tokens inside a native, secure, non-custodial smart contract on Stellar.',
      icon: <LockKeyhole className="w-5 h-5 text-fuchsia-400" />
    },
    {
      title: 'Verify & Settle Payout',
      desc: 'Upon milestone verification or digital approval, locked funds release to the freelancer instantly.',
      icon: <Zap className="w-5 h-5 text-emerald-400" />
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      handle: 'sarahjenkins',
      quote: 'Locking 15,000 USDC in an EscrowX Soroban contract gave us and our freelancers 100% confidence. Settlements complete in seconds with practically zero overhead.',
      avatarInitials: 'SJ',
      gradient: 'from-violet-500 to-fuchsia-500'
    },
    {
      name: 'Alex Rivera',
      handle: 'alexrivera',
      quote: 'EscrowX solved my payment collection anxieties forever. No chasing invoices or waiting weeks. Once the milestone is submitted, smart contracts handle the rest.',
      avatarInitials: 'AR',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Marcus Thorne',
      handle: 'marcusthorne',
      quote: 'The decentralized arbitration pool resolved a milestone dispute for us in less than 2 hours. An incredibly fast, fair, and modern workflow.',
      avatarInitials: 'MT',
      gradient: 'from-fuchsia-500 to-pink-500'
    },
    {
      name: 'Sophia Liang',
      handle: 'sophial',
      quote: 'Building decentralized tech requires trustless tools. EscrowX is simple to use, has zero commission fees, and handles multi-milestone lockups beautifully.',
      avatarInitials: 'SL',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      name: 'David Miller',
      handle: 'davidm',
      quote: 'Sub-penny network fees on Stellar mean we can lock even small payments without worrying about transaction costs. Perfect for micro-contracting.',
      avatarInitials: 'DM',
      gradient: 'from-orange-500 to-yellow-500'
    },
    {
      name: 'Elena Rostova',
      handle: 'elenar',
      quote: 'Our agency moved all client escrow lockups to EscrowX. The UI is absolutely stunning, and transparent on-chain security makes onboarding clients a breeze.',
      avatarInitials: 'ER',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  const mockLogos = [
    { name: 'Stellar', svg: <svg className="w-24 h-6 fill-current text-neutral-500 hover:text-white transition-colors" viewBox="0 0 100 24" fill="none"><path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" fill="currentColor" /><path d="M11 6h2v12h-2zm-5 5h12v2H6z" fill="currentColor" /></svg> },
    { name: 'USDC', svg: <svg className="w-24 h-6 fill-current text-neutral-500 hover:text-white transition-colors" viewBox="0 0 100 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M12 7v10M9 9.5a2.5 2.5 0 0 1 5 0v1a2.5 2.5 0 0 1-5 0M10 13.5a2.5 2.5 0 0 0 5 0v1a2.5 2.5 0 0 0-5 0" stroke="currentColor" strokeWidth="1.5" /></svg> },
    { name: 'Rust', svg: <svg className="w-24 h-6 fill-current text-neutral-500 hover:text-white transition-colors" viewBox="0 0 100 24" fill="none"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 17.5a7.5 7.5 0 1 1 7.5-7.5 7.5 7.5 0 0 1-7.5 7.5z" fill="currentColor" /><path d="M12 7.5a4.5 4.5 0 1 0 4.5 4.5 4.5 0 0 0-4.5-4.5z" fill="currentColor" /><path d="M11 4.5h2V6h-2zm3.5.7l1.4 1.4-1 .7-1.4-1.4zm2.8 2.2l.7 1.8-1.5.5-.7-1.8z" fill="currentColor" /></svg> },
    { name: 'Vercel', svg: <svg className="w-24 h-6 fill-current text-neutral-500 hover:text-white transition-colors" viewBox="0 0 100 24" fill="none"><path d="M12 2L2 20h20L12 2z" fill="currentColor" /></svg> },
    { name: 'IPFS', svg: <svg className="w-24 h-6 fill-current text-neutral-500 hover:text-white transition-colors" viewBox="0 0 100 24" fill="none"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M12 2v20M3.34 7h17.32M3.34 17h17.32" stroke="currentColor" strokeWidth="1" /></svg> }
  ];

  // Spotlight mockup cursor tracking
  const [mockupMouse, setMockupMouse] = useState({ x: 162.143, y: 240.411 });
  const [mockupHovered, setMockupHovered] = useState(false);
  const mockupRef = useRef<HTMLDivElement>(null);
  const handleMockupMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mockupRef.current) return;
    const { left, top } = mockupRef.current.getBoundingClientRect();
    setMockupMouse({ x: e.clientX - left, y: e.clientY - top });
  };

  return (
    <div className="bg-[#0a0a0a] text-[#F5F5F7] font-sans overflow-x-hidden min-h-screen selection:bg-violet-500/20 selection:text-violet-400 relative" style={{ '--background': '0 0% 3.9%' } as React.CSSProperties}>

      {/* Background Interactive Primitives */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Particles
          className="absolute inset-0"
          quantity={90}
          staticity={60}
          ease={70}
          size={0.6}
          color="#8B5CF6"
        />

        {/* Writora-style Ellipse Radial Background Glow (slowly moving dark gradient) */}
        <motion.div
          className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.24),rgba(255,255,255,0))] bg-[#0a0a0a]"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.85, 1, 0.85],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Slow drifting background color meshes */}
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 blur-[120px]"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-[30%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-fuchsia-500/5 to-violet-500/5 blur-[150px]"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Navbar Container */}
      <header className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 px-6 ${isScrolled ? 'pt-3' : 'pt-6'
        }`}>
        <div className={`max-w-5xl mx-auto rounded-full border border-white/[0.05] bg-[#09090b]/50 backdrop-blur-xl transition-all duration-500 ${isScrolled ? 'px-6 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]' : 'px-8 py-4'
          } flex items-center justify-between`}>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="4" width="14" height="10" rx="2" stroke="white" strokeWidth="2" fill="none" />
                <path d="M6 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              EscrowX
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs font-medium text-neutral-400 hover:text-white transition-colors nav-link-underline">Features</a>
            <a href="#process" className="text-xs font-medium text-neutral-400 hover:text-white transition-colors nav-link-underline">The Process</a>
            <a href="#pricing" className="text-xs font-medium text-neutral-400 hover:text-white transition-colors nav-link-underline">Pricing</a>
            <a href="#testimonials" className="text-xs font-medium text-neutral-400 hover:text-white transition-colors nav-link-underline">Testimonials</a>
            <a href="#faq" className="text-xs font-medium text-neutral-400 hover:text-white transition-colors nav-link-underline">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <WalletButton className="border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/[0.12] text-white rounded-full text-xs py-1.5 px-4 font-bold" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative z-10 pt-36 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center justify-center text-center">

        {/* Glow Pill Badge */}
        <div className="flex w-full flex-col items-center justify-center mb-6" style={{ opacity: 1 }}>
          <button className="group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(240_5.9%_10%)_inset] transition-colors duration-200 cursor-pointer">
            <span>
              <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
            </span>
            <span className="backdrop absolute inset-[1px] rounded-full bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
            <span className="absolute inset-x-0 bottom-0 h-full w-full bg-gradient-to-tr from-violet-500/20 blur-md" />
            <span className="z-10 flex items-center justify-center gap-1.5 py-0.5 text-neutral-200 text-xs font-medium">
              ✨ Soroban Smart Contracts Live
              <ArrowRight className="ml-1 size-3.5 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 text-violet-400" />
            </span>
          </button>
        </div>

        {/* Title */}
        <h1 className="!leading-[1.12] w-full text-balance py-4 font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
          Decentralized Escrows With <br className="hidden md:block" />
          <span className="inline-block bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
            Smart Contracts
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 mb-10 max-w-xl text-balance text-sm sm:text-base md:text-lg text-neutral-400 tracking-tight font-light leading-relaxed">
          Secure digital contracting and milestone payouts via non-custodial Stellar Soroban vaults. Funds stay safely locked on-chain until verification signatures match.
        </p>

        {/* Preserved Action CTAs */}
        <div className="z-50 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md px-4">
          <button
            onClick={() => handleCTA('CLIENT')}
            className="w-full sm:w-auto px-7 py-3 rounded-lg bg-white text-black font-semibold text-sm hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer shadow-lg shadow-white/5"
          >
            Continue As Client
          </button>
          <button
            onClick={() => handleCTA('FREELANCER')}
            className="w-full sm:w-auto px-7 py-3 rounded-lg bg-zinc-900 border border-white/[0.08] hover:bg-zinc-800 text-white font-semibold text-sm active:scale-95 transition-all cursor-pointer"
          >
            Continue As Freelancer
          </button>
        </div>

        {/* Hero Mockup dashboard visualizer */}
        <div className="relative w-full bg-transparent px-2 pt-20 pb-12 md:py-24 max-w-5xl">
          <div className="gradient -translate-x-1/2 absolute inset-0 left-1/2 h-1/4 w-3/4 bg-gradient-to-tr from-violet-500/10 to-fuchsia-500/10 blur-[6rem] md:top-[15%] md:h-1/3"></div>

          <div className="-m-2 lg:-m-4 rounded-xl bg-opacity-50 p-2 ring-1 ring-white/10 backdrop-blur-3xl lg:rounded-2xl relative">
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]" style={{ "--border-beam-width": "1px" } as React.CSSProperties}>
              <div className="absolute aspect-square bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent animate-border-beam" style={{ width: "220px", offsetPath: "rect(0px auto auto 0px round 220px)", "--color-from": "#8B5CF6", "--color-to": "#EC4899", offsetDistance: "66.21%", animationDuration: "10s", animationTimingFunction: "linear", animationIterationCount: "infinite" } as React.CSSProperties}></div>
            </div>

            <div
              ref={mockupRef}
              onMouseMove={handleMockupMouseMove}
              onMouseEnter={() => setMockupHovered(true)}
              onMouseLeave={() => setMockupHovered(false)}
              className="group/spotlight p-5 md:p-6 bg-black/60 rounded-xl border border-white/[0.05] text-left relative overflow-hidden"
            >
              <div
                className={`pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-500 ${mockupHovered ? 'opacity-100' : 'opacity-0'}`}
                style={{ background: `radial-gradient(250px at ${mockupMouse.x}px ${mockupMouse.y}px, rgba(139, 92, 246, 0.05), transparent 80%)` }}
              />
              <div
                className={`pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-500 z-10 ${mockupHovered ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  padding: "1px",
                  mask: "linear-gradient(#fff, #fff) content-box exclude, linear-gradient(#fff, #fff)",
                  WebkitMask: "linear-gradient(#fff, #fff) content-box exclude, linear-gradient(#fff, #fff)",
                  background: `radial-gradient(208.333px at ${mockupMouse.x}px ${mockupMouse.y}px, rgba(139, 92, 246, 0.15), transparent 80%)`
                }}
              />

              <div className="relative z-20 h-full w-full">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse"></span>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400">SOROBAN STATE CORE</span>
                  </div>

                  <button
                    onClick={handleInspectRefresh}
                    className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-all group cursor-pointer"
                    title="Refresh State"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-violet-400 transition-colors ${isInspectorLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="space-y-4 mb-5">
                  <div className="flex items-center justify-between px-4 py-5 bg-white/[0.01] border border-white/[0.03] rounded-xl relative overflow-hidden">

                    <div className="flex flex-col items-center z-10">
                      <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-white/[0.06] flex items-center justify-center text-neutral-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] text-neutral-500 font-bold mt-1.5">Client</span>
                    </div>

                    <div className="flex-1 h-6 relative mx-2">
                      <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M 0 10 L 100 10" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" strokeDasharray="3 3"></path>
                        <motion.path
                          d="M 0 10 L 100 10"
                          stroke="url(#beam-glow-grad)"
                          strokeWidth="2"
                          fill="none"
                          initial={{ strokeDashoffset: 0 }}
                          animate={{ strokeDashoffset: -20 }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          style={{ strokeDasharray: "6, 10" }}
                        />
                        <defs>
                          <linearGradient id="beam-glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0"></stop>
                            <stop offset="50%" stopColor="#EC4899"></stop>
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    <div className="flex flex-col items-center z-10">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.15)] relative">
                        <LockKeyhole className="w-4 h-4" />
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-black rounded-full"></span>
                      </div>
                      <span className="text-[9px] text-violet-400 font-bold mt-1.5">Escrow Contract</span>
                    </div>

                    <div className="flex-1 h-6 relative mx-2">
                      <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M 0 10 L 100 10" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" strokeDasharray="3 3"></path>
                        <motion.path
                          d="M 0 10 L 100 10"
                          stroke="url(#beam-glow-grad2)"
                          strokeWidth="2"
                          fill="none"
                          initial={{ strokeDashoffset: 0 }}
                          animate={{ strokeDashoffset: -20 }}
                          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                          style={{ strokeDasharray: "8, 12" }}
                        />
                        <defs>
                          <linearGradient id="beam-glow-grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#EC4899" stopOpacity="0"></stop>
                            <stop offset="50%" stopColor="#8B5CF6"></stop>
                            <stop offset="100%" stopColor="#EC4899" stopOpacity="0"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    <div className="flex flex-col items-center z-10">
                      <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-white/[0.06] flex items-center justify-center text-neutral-400">
                        <Code className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] text-neutral-500 font-bold mt-1.5">Freelancer</span>
                    </div>

                  </div>
                </div>

                <div className="space-y-2.5 font-mono text-[11px] bg-black/40 border border-white/[0.03] p-4 rounded-xl relative">
                  <div className="flex justify-between items-center text-neutral-500 text-[9px] pb-1.5 border-b border-white/[0.04]">
                    <span>FIELD</span>
                    <span>VALUE</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 text-[9px]">CONTRACT ID</span>
                    <span className="text-neutral-300 flex items-center gap-1.5 cursor-pointer hover:text-white" onClick={() => handleCopyText(inspectorContract.id)}>
                      {inspectorContract.id}
                      <Copy className="w-3 h-3 text-neutral-500" />
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 text-[9px]">CLIENT</span>
                    <span className="text-neutral-300 truncate max-w-[140px]">{inspectorContract.client}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 text-[9px]">FREELANCER</span>
                    <span className="text-neutral-300 truncate max-w-[140px]">{inspectorContract.freelancer}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 text-[9px]">LOCKED ESCROW</span>
                    <span className="text-violet-400 font-bold">{inspectorContract.amount}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 text-[9px]">SOROBAN STATUS</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${inspectorContract.status === 'FUNDED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        inspectorContract.status === 'RELEASED' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                          inspectorContract.status === 'IN_DISPUTE' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                      }`}>{inspectorContract.status}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.01] border border-white/[0.02]">
                  <Terminal className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="text-[9px] font-mono text-neutral-400 truncate">log: state change detected • timestamp: {inspectorContract.timestamp}</span>
                </div>

              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Logo Cloud Section */}
      <section className="relative z-10 py-10 border-y border-white/[0.04] bg-black/10 backdrop-blur-3xl overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-8">
            SUPPORTING MULTIPLE LEDGER AND FRAMEWORK INTEGRATIONS
          </p>
          <Marquee pauseOnHover className="[--duration:20s] opacity-75">
            {mockLogos.map((logo) => (
              <div key={logo.name} className="mx-8 flex items-center justify-center">
                {logo.svg}
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
          <div className="relative inline-flex h-8 select-none overflow-hidden rounded-full p-[1px] focus:outline-none mb-2">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#8B5CF6_0%,#EC4899_50%,#8B5CF6_100%)]"></span>
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 font-medium text-xs text-white backdrop-blur-3xl">
              Features
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            Manage Escrows Like a Pro
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed font-light">
            EscrowX is a cutting-edge smart contract settlement suite that secures collaborative payouts in seconds.
          </p>
        </div>

        {/* Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">

          {/* Card 1: Create agreements (small) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] bg-black [box-shadow:0_-20px_80px_-20px_#ffffff05_inset] col-span-1 min-h-[340px] p-6">
            <div className="h-40 relative flex items-center justify-center border border-white/[0.04] bg-white/[0.01] rounded-xl p-4 overflow-hidden">
              {/* Form simulator */}
              <div className="w-full space-y-3 pointer-events-none">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">Escrow Valuation</label>
                <div className="relative">
                  <input
                    type="text"
                    value={`${bentoValuationInput} USDC`}
                    onChange={() => { }}
                    className="w-full bg-neutral-900 border border-white/[0.08] text-xs text-white rounded-lg p-2 pl-3 focus:outline-none"
                    placeholder="Enter valuation..."
                  />
                  <span className="absolute right-3 top-2 text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">0% Fee</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-neutral-400 px-1 pt-1">
                  <span>Smart Contract Lock:</span>
                  <span className="text-white font-bold">{bentoValuationInput} USDC</span>
                </div>
              </div>
            </div>

            <div className="group-hover:-translate-y-2 pointer-events-none z-10 flex flex-col gap-1 transition-all duration-300 mt-4">
              <Zap className="h-10 w-10 origin-left text-neutral-600 transition-all duration-300 ease-in-out group-hover:scale-75 text-violet-400" />
              <h3 className="font-semibold text-neutral-200 text-lg">Create Escrows</h3>
              <p className="text-neutral-400 text-xs font-light leading-relaxed">Setup milestone-based contracts that represent mutual payout agreements.</p>
            </div>

            <div className="absolute bottom-0 flex w-full translate-y-6 flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <a href="#process" className="inline-flex items-center text-xs font-bold text-violet-400 cursor-pointer">
                Learn more <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </a>
            </div>
            <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-white/[.01]"></div>
          </div>

          {/* Card 2: Search your escrows (large) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] bg-black [box-shadow:0_-20px_80px_-20px_#ffffff05_inset] col-span-1 lg:col-span-2 min-h-[340px] p-6">
            <div className="h-40 relative border border-white/[0.04] bg-white/[0.01] rounded-xl p-4 overflow-y-auto no-scrollbar">
              <div className="flex items-center gap-2 bg-neutral-900 border border-white/[0.08] px-3 py-1.5 rounded-lg mb-3">
                <Search className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <input
                  type="text"
                  value={bentoSearchQuery}
                  onChange={(e) => setBentoSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-xs text-white placeholder-neutral-500 focus:outline-none"
                  placeholder="Type to search smart contracts..."
                />
              </div>
              <div className="space-y-1.5">
                {filteredBentoSearch.map((escrow) => (
                  <div
                    key={escrow.id}
                    onClick={() => setSelectedBentoEscrow(escrow.id)}
                    className={`flex justify-between items-center p-2 rounded-md font-mono text-[10px] cursor-pointer transition-colors ${selectedBentoEscrow === escrow.id ? 'bg-violet-500/10 border border-violet-500/20 text-white' : 'bg-neutral-900/40 border border-white/[0.03] text-neutral-400 hover:bg-neutral-900'
                      }`}
                  >
                    <span>{escrow.id}</span>
                    <span className="truncate max-w-[120px] text-neutral-500">{escrow.partner}</span>
                    <span className="font-bold text-violet-400">{escrow.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="group-hover:-translate-y-2 pointer-events-none z-10 flex flex-col gap-1 transition-all duration-300 mt-4">
              <Search className="h-10 w-10 origin-left text-neutral-600 transition-all duration-300 ease-in-out group-hover:scale-75 text-violet-400" />
              <h3 className="font-semibold text-neutral-200 text-lg">On-Chain Search</h3>
              <p className="text-neutral-400 text-xs font-light leading-relaxed">Search through active, released, and dispute status escrows on the Stellar ledger instantly.</p>
            </div>

            <div className="absolute bottom-0 flex w-full translate-y-6 flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <a href="#process" className="inline-flex items-center text-xs font-bold text-violet-400 cursor-pointer">
                Learn more <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </a>
            </div>
            <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-white/[.01]"></div>
          </div>

          {/* Card 3: Connect your wallets/apps (large) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] bg-black [box-shadow:0_-20px_80px_-20px_#ffffff05_inset] col-span-1 lg:col-span-2 min-h-[340px] p-6">
            <div className="h-40 relative border border-white/[0.04] bg-white/[0.01] rounded-xl flex items-center justify-center p-4">
              {/* Wallet node graphics */}
              <div className="flex items-center justify-center gap-6 relative">
                <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-white/[0.06] flex items-center justify-center text-neutral-400 shadow-md">
                  <Wallet className="w-5 h-5 text-violet-400" />
                </div>
                <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-pulse rounded-full" />
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="4" width="14" height="10" rx="2" stroke="white" strokeWidth="2" fill="none" />
                    <path d="M6 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
                <div className="w-12 h-1 bg-gradient-to-r from-fuchsia-500 to-violet-500 animate-pulse rounded-full" />
                <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-white/[0.06] flex items-center justify-center text-neutral-400 shadow-md">
                  <Globe className="w-5 h-5 text-fuchsia-400" />
                </div>
              </div>
            </div>

            <div className="group-hover:-translate-y-2 pointer-events-none z-10 flex flex-col gap-1 transition-all duration-300 mt-4">
              <Globe className="h-10 w-10 origin-left text-neutral-600 transition-all duration-300 ease-in-out group-hover:scale-75 text-violet-400" />
              <h3 className="font-semibold text-neutral-200 text-lg">Connect Ledger Wallets</h3>
              <p className="text-neutral-400 text-xs font-light leading-relaxed">Seamless integration with Freighter, Albedo, and standard Stellar wallets for secure, stateless login and signatures.</p>
            </div>

            <div className="absolute bottom-0 flex w-full translate-y-6 flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <a href="#process" className="inline-flex items-center text-xs font-bold text-violet-400 cursor-pointer">
                Learn more <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </a>
            </div>
            <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-white/[.01]"></div>
          </div>

          {/* Card 4: Milestone Calendar (small) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] bg-black [box-shadow:0_-20px_80px_-20px_#ffffff05_inset] col-span-1 min-h-[340px] p-6">
            <div className="h-40 relative border border-white/[0.04] bg-white/[0.01] rounded-xl p-3 flex flex-col justify-center overflow-hidden">
              <div className="text-[10px] font-bold text-neutral-400 mb-2 flex justify-between">
                <span>June 2026</span>
                <span className="text-violet-400">Milestone Deadlines</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-[8px] text-center text-neutral-500 mb-1">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-[9px] text-center font-mono">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
                  const isMilestone = [8, 18, 27].includes(d);
                  return (
                    <span
                      key={d}
                      className={`h-4.5 flex items-center justify-center rounded ${isMilestone ? 'bg-violet-500 text-white font-bold shadow-md shadow-violet-500/20' : 'text-neutral-400'
                        }`}
                    >
                      {d}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="group-hover:-translate-y-2 pointer-events-none z-10 flex flex-col gap-1 transition-all duration-300 mt-4">
              <Calendar className="h-10 w-10 origin-left text-neutral-600 transition-all duration-300 ease-in-out group-hover:scale-75 text-violet-400" />
              <h3 className="font-semibold text-neutral-200 text-lg">Milestone Scheduler</h3>
              <p className="text-neutral-400 text-xs font-light leading-relaxed">Establish automated release deadlines and sync notifications with milestone checkpoints.</p>
            </div>

            <div className="absolute bottom-0 flex w-full translate-y-6 flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <a href="#process" className="inline-flex items-center text-xs font-bold text-violet-400 cursor-pointer">
                Learn more <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </a>
            </div>
            <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-white/[.01]"></div>
          </div>

        </div>
      </section>

      {/* The Process (How it Works) */}
      <section id="process" className="relative z-10 py-24 bg-neutral-950/20 border-y border-white/[0.04] px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
            <div className="relative inline-flex h-8 select-none overflow-hidden rounded-full p-[1px] focus:outline-none mb-2">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#8B5CF6_0%,#EC4899_50%,#8B5CF6_100%)]"></span>
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 font-medium text-xs text-white backdrop-blur-3xl">
                The Process
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Secure Payments Effortlessly
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed font-light">
              EscrowX removes contract risks by binding freelancer agreements directly to smart ledger execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {steps.map((s, idx) => (
              <SpotlightCard
                key={s.title}
                spotlightColor="rgba(139, 92, 246, 0.03)"
                borderColor="rgba(139, 92, 246, 0.12)"
                className="bg-black/60 p-6 flex flex-col justify-between h-56 group relative"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg border border-white/[0.06] bg-white/[0.01] flex items-center justify-center mb-4">
                    {s.icon}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{s.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">{s.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-30 text-white/20 group-hover:text-violet-400 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <div className="relative inline-flex h-8 select-none overflow-hidden rounded-full p-[1px] focus:outline-none mb-2">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#8B5CF6_0%,#EC4899_50%,#8B5CF6_100%)]"></span>
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 font-medium text-xs text-white backdrop-blur-3xl">
              Pricing
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            Simple Service Tiers
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed font-light">
            Enjoy next-to-zero transaction commissions and custom dispute arbitration pools.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex justify-center mb-16">
          <div className="bg-neutral-900 border border-white/[0.06] p-1 rounded-full flex gap-1">
            <button
              onClick={() => setPricingPeriod('monthly')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${pricingPeriod === 'monthly' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg' : 'text-neutral-400 hover:text-white'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPricingPeriod('yearly')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${pricingPeriod === 'yearly' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg' : 'text-neutral-400 hover:text-white'
                }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1: Basic */}
          <SpotlightCard
            spotlightColor="rgba(255, 255, 255, 0.02)"
            borderColor="rgba(255, 255, 255, 0.08)"
            className="p-8 bg-neutral-950/40 border border-white/[0.04] flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-neutral-200">Basic Escrow</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Perfect for simple one-off contracting agreements.</p>

              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-neutral-500 ml-1">/ transaction</span>
              </div>

              <div className="w-full h-[1px] bg-white/[0.06] my-6" />

              <ul className="space-y-3.5 text-xs text-neutral-400 font-light">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Standard 24h arbitration</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Up to 3 active contracts</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Markdown details support</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Community support</li>
              </ul>
            </div>

            <button
              onClick={() => handleCTA('CLIENT')}
              className="mt-8 w-full py-3 rounded-lg bg-zinc-900 border border-white/[0.08] hover:bg-zinc-800 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Get Started
            </button>
          </SpotlightCard>

          {/* Card 2: Pro (Highlighted Card) */}
          <SpotlightCard
            spotlightColor="rgba(139, 92, 246, 0.05)"
            borderColor="rgba(139, 92, 246, 0.2)"
            className="p-8 bg-black border border-violet-500/20 relative flex flex-col justify-between"
          >
            <BorderBeam size={200} duration={8} colorFrom="#8B5CF6" colorTo="#EC4899" />
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Pro Escrow</h3>
                <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">RECOMMENDED</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">Ideal for professional creators and growing agencies.</p>

              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">
                  {pricingPeriod === 'monthly' ? '$19.99' : '$14.99'}
                </span>
                <span className="text-xs text-neutral-500 ml-1">/ month</span>
              </div>

              <div className="w-full h-[1px] bg-white/[0.06] my-6" />

              <ul className="space-y-3.5 text-xs text-neutral-300 font-light">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Priority 2h arbitration pool</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Unlimited active contracts</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Automated Webhook alerts</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> On-chain reputation badge</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Priority discord assistance</li>
              </ul>
            </div>

            <button
              onClick={() => handleCTA('CLIENT')}
              className="mt-8 w-full py-3 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-violet-500/10"
            >
              Get Started
            </button>
          </SpotlightCard>

          {/* Card 3: Enterprise */}
          <SpotlightCard
            spotlightColor="rgba(255, 255, 255, 0.02)"
            borderColor="rgba(255, 255, 255, 0.08)"
            className="p-8 bg-neutral-950/40 border border-white/[0.04] flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-neutral-200">Custom Pool</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Built for high-scale Web3 enterprises and DAOs.</p>

              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">Custom</span>
                <span className="text-xs text-neutral-500 ml-1">/ bespoke</span>
              </div>

              <div className="w-full h-[1px] bg-white/[0.06] my-6" />

              <ul className="space-y-3.5 text-xs text-neutral-400 font-light">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Private arbiter select logic</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Custom payout token support</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Multi-signature smart keys</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Dedicated account manager</li>
              </ul>
            </div>

            <a
              href="mailto:team@escrowx.io"
              className="mt-8 w-full py-3 rounded-lg bg-zinc-900 border border-white/[0.08] hover:bg-zinc-800 text-white text-xs font-bold text-center transition-all block cursor-pointer"
            >
              Contact Team
            </a>
          </SpotlightCard>

        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
          <div className="relative inline-flex h-8 select-none overflow-hidden rounded-full p-[1px] focus:outline-none mb-2">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#8B5CF6_0%,#EC4899_50%,#8B5CF6_100%)]"></span>
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 font-medium text-xs text-white backdrop-blur-3xl">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            Trusted by the Web3 Community
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed font-light">
            Read positive feedback from freelancers and digital agencies securing agreements on-ledger.
          </p>
        </div>

        {/* Testimonials Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <SpotlightCard
              key={idx}
              spotlightColor="rgba(139, 92, 246, 0.02)"
              borderColor="rgba(139, 92, 246, 0.1)"
              className="p-6 bg-neutral-950/20 border border-white/[0.04] flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-violet-400 text-violet-400" />
                  ))}
                </div>
                <p className="text-xs text-neutral-300 italic leading-relaxed font-light">"{t.quote}"</p>
              </div>

              <div className="flex items-center gap-3 border-t border-white/[0.04] pt-4 mt-6">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xs font-black text-black shadow-inner`}>
                  {t.avatarInitials}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">{t.name}</h5>
                  <p className="text-[9px] text-neutral-500 font-mono">@{t.handle}</p>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-24 px-6 max-w-3xl mx-auto border-t border-white/[0.04]">
        <h2 className="text-3xl font-bold tracking-tight text-center text-white mb-16">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            { q: 'What is a Soroban smart contract?', a: 'Soroban is the native smart contract execution platform built on the Stellar network. It provides isolated, safe, Rust-based execution environments that hold deposits securely on-ledger without custodial intermediaries.' },
            { q: 'How does Freighter signature verification work?', a: 'When you authenticate with Freighter, your private keys sign a stateless server challenge. The server validates this cryptographically on-chain, securing your identity without credentials.' },
            { q: 'What happens in case of a dispute?', a: 'If a contract dispute is initiated, locked funds stay frozen in the ledger. Verified community arbiters examine IPFS logs and chat transcripts, casting votes to distribute payouts fairly based on evidence.' }
          ].map((item, idx) => {
            const isOpen = activeFAQ === idx;
            return (
              <SpotlightCard
                key={item.q}
                spotlightColor="rgba(139, 92, 246, 0.02)"
                borderColor="rgba(139, 92, 246, 0.08)"
                className="bg-neutral-950/20 border border-white/[0.05] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFAQ(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-xs font-bold text-white hover:bg-white/[0.01] transition-all cursor-pointer focus:outline-none"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-violet-400' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/[0.03] px-5 py-4 text-xs text-neutral-400 leading-relaxed font-light bg-black/20"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* Luxury Centered CTA Banner */}
      <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <div className="relative rounded-3xl border border-white/[0.08] bg-[#09090b]/80 overflow-hidden p-8 md:p-16 text-center">
          <BorderBeam size={250} duration={8} colorFrom="#8B5CF6" colorTo="#EC4899" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,#000000_100%)] z-0" />

          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Ready to Secure Your Next Milestone?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
              Connect your Stellar wallet, instantiate Soroban escrow lockups, and coordinate payments on-ledger with complete cryptographic certainty.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => handleCTA('CLIENT')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer shadow-lg"
              >
                Continue As Client
              </button>
              <button
                onClick={() => handleCTA('FREELANCER')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 border border-white/[0.08] hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-all cursor-pointer"
              >
                Continue As Freelancer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-neutral-950/80 border-t border-white/[0.04] py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="4" width="14" height="10" rx="2" stroke="white" strokeWidth="2" fill="none" />
                <path d="M6 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-white">EscrowX</span>
          </div>

          <p className="text-xs text-neutral-500 font-light">
            © 2026 EscrowX. Secure on-chain agreements. Built on Stellar Soroban Core.
          </p>

          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-violet-400 bg-violet-950/20 border border-violet-500/10 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            All smart contract vaults operational
          </div>
        </div>
      </footer>

    </div>
  );
}
