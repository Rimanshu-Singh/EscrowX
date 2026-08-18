import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { LogOut, Calendar, Menu, Sun, Moon, BookOpen } from 'lucide-react';
import { Sidebar } from '../layout/Sidebar';
import { OnboardingGuide, openOnboardingGuide } from '../shared/OnboardingGuide';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, walletAddress, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="flex min-h-screen min-w-0 bg-surface font-sans text-text-primary selection:bg-purple-500/30 selection:text-white transition-colors duration-200">
        {/* Sidebar on the left */}
        <Sidebar isOpenOnMobile={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

        {/* Backdrop for mobile */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)} 
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
        )}

        {/* Main Content Area on the right */}
        <div className="ml-0 flex min-h-screen min-w-0 flex-1 flex-col md:ml-[240px]">
          {/* Top header */}
          <header className="sticky top-0 z-30 flex h-16 min-w-0 items-center justify-between gap-2 border-b border-border bg-card px-3 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all duration-200 sm:px-4 md:h-20 md:px-8">
            <div className="flex min-w-0 items-center">
              {/* Hamburger menu button for mobile */}
              <button 
                onClick={() => setMobileMenuOpen(true)} 
                className="-ml-1 mr-2 grid size-10 shrink-0 place-items-center rounded-lg text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary md:hidden cursor-pointer"
                title="Open Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex min-w-0 flex-col justify-center">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[14px] font-black text-text-primary tracking-tight hidden sm:block">
                    Good morning, {user?.name || 'johnn'} 👋 <span className="font-normal text-slate-500">{user?.role?.toLowerCase() || 'freelancer'}</span>
                  </h2>
                  <span className={`px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-white rounded-full bg-gradient-to-r hidden sm:inline-flex ${
                    user?.role === 'CLIENT' 
                      ? 'from-blue-500 to-indigo-600' 
                      : user?.role === 'FREELANCER' 
                      ? 'from-purple-500 to-pink-600' 
                      : 'from-red-500 to-orange-600'
                  }`}>
                    {user?.role || 'FREELANCER'}
                  </span>
                  <span className="max-w-[84px] truncate text-[15px] font-bold tracking-tight text-text-primary sm:hidden">
                    EscrowX
                  </span>
                </div>
                
                {/* Timeline / Date Component (Apple / Linear style) */}
                <div className="flex items-center gap-1.5 text-[10px] text-text-secondary mt-0.5 font-medium hidden sm:flex">
                  <Calendar className="w-3 h-3 text-[#7C3AED] shrink-0" />
                  <span>Today is {getFormattedDate()}</span>
                  <span className="w-0.5 h-0.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
                  <span className="text-[#7C3AED] font-bold">Stellar Connected</span>
                </div>
              </div>
            </div>

            {/* Network Badge (Testnet) */}
            <div className="hidden items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7C3AED] dark:border-purple-900/30 dark:bg-purple-950/30 md:flex">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
              Testnet
            </div>

            {/* Header right: Wallet address connected beside Testnet badge */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
              <button
                onClick={openOnboardingGuide}
                title="Open EscrowX guide"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border bg-surface px-2.5 py-2 text-xs font-bold text-text-secondary transition-all hover:bg-surface-elevated hover:text-text-primary"
              >
                <BookOpen size={16} />
                <span className="hidden lg:inline">Learn</span>
              </button>

              {walletAddress && (
                <div className="relative">
                  <button
                    onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                    className="flex min-h-10 max-w-[86px] items-center gap-1.5 rounded-xl border border-border bg-surface px-2 py-2 text-xs font-bold text-text-primary shadow-xs transition-colors hover:bg-surface-elevated sm:max-w-none sm:gap-2 sm:px-3 md:px-3.5 md:py-2.5 cursor-pointer"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="hidden font-mono text-[11px] sm:inline">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                    <span className="truncate font-mono text-[11px] sm:hidden">
                      {walletAddress.slice(0, 3)}...{walletAddress.slice(-3)}
                    </span>
                    <svg className="w-3 h-3 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showWalletDropdown && (
                    <div className="absolute right-0 z-50 mt-2 w-[min(12rem,calc(100vw-1.5rem))] rounded-xl border border-border bg-card py-1.5 text-xs text-text-primary shadow-xl">
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(walletAddress);
                          alert("Wallet address copied to clipboard!");
                          setShowWalletDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-surface-elevated transition-colors flex items-center gap-2 cursor-pointer font-semibold text-text-primary"
                      >
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                        Copy Wallet Address
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          navigate('/auth/login');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 transition-colors flex items-center gap-2 border-t border-border cursor-pointer font-bold"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Disconnect Wallet
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-text-secondary transition-all hover:bg-surface-elevated hover:text-text-primary md:size-11 cursor-pointer"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              
              {user && (
                <button
                  onClick={() => {
                    logout();
                    navigate('/auth/login');
                  }}
                  title="Sign Out"
                  className="hidden size-10 place-items-center rounded-xl border border-border bg-surface text-text-muted transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-500 sm:grid md:size-11 cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </header>

          {/* Main Content Area */}
          <div className="min-w-0 flex-1 p-3 sm:p-4 md:p-8">
            {/* Dashboard environment render */}
            {children}
          </div>
        </div>
      </div>
      <OnboardingGuide />
    </div>
  );
};

export default DashboardLayout;
