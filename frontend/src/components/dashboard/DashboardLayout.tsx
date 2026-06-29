import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { LogOut, LayoutDashboard, Calendar, Menu, Sun, Moon } from 'lucide-react';
import { Sidebar } from '../layout/Sidebar';

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
      <div className="min-h-screen bg-surface text-text-primary font-sans selection:bg-purple-500/30 selection:text-white flex transition-colors duration-200">
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
        <div className="flex-1 md:ml-[240px] ml-0 flex flex-col min-h-screen">
          {/* Top header */}
          <header className="md:h-20 h-16 bg-card border-b border-border flex items-center justify-between md:px-8 px-4 sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all duration-200">
            <div className="flex items-center">
              {/* Hamburger menu button for mobile */}
              <button 
                onClick={() => setMobileMenuOpen(true)} 
                className="p-2 -ml-2 mr-3 rounded-lg hover:bg-surface-elevated md:hidden cursor-pointer text-text-secondary hover:text-text-primary transition-colors"
                title="Open Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex flex-col justify-center">
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
                  <span className="text-[15px] font-bold text-text-primary tracking-tight sm:hidden">
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
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/30 text-[#7C3AED] border border-purple-100 dark:border-purple-900/30 text-[10px] font-extrabold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
              Testnet
            </div>

            {/* Header right: Wallet address connected beside Testnet badge */}
            <div className="flex items-center gap-3">
              {walletAddress && (
                <div className="relative">
                  <button
                    onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                    className="flex items-center gap-2 bg-surface border border-border px-3 md:px-3.5 py-2 md:py-2.5 rounded-xl text-xs font-bold text-text-primary hover:bg-surface-elevated transition-colors shadow-xs cursor-pointer"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-mono text-[11px] hidden sm:inline">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                    <span className="font-mono text-[11px] sm:hidden">
                      {walletAddress.slice(0, 3)}...{walletAddress.slice(-3)}
                    </span>
                    <svg className="w-3 h-3 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showWalletDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-1.5 z-50 text-xs text-text-primary">
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
                className="p-2 md:p-2.5 rounded-xl bg-surface border border-border hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-all cursor-pointer"
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
                  className="p-2 md:p-2.5 rounded-xl bg-surface border border-border hover:border-red-500/20 hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-all cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 md:p-8 p-4">
            {/* Dashboard environment render */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
