import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, LayoutDashboard, Calendar } from 'lucide-react';
import { Sidebar } from '../layout/Sidebar';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, walletAddress, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] font-sans selection:bg-purple-500/30 selection:text-white flex">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main Content Area on the right */}
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        {/* Top header */}
        <header className="h-20 bg-white border-b border-[#E4E8F0] flex items-center justify-between px-8 sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[14px] font-black text-[#0F172A] tracking-tight">
                Good morning, {user?.name || 'johnn'} 👋 <span className="font-normal text-slate-500">{user?.role?.toLowerCase() || 'freelancer'}</span>
              </h2>
              <span className={`px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-white rounded-full bg-gradient-to-r ${
                user?.role === 'CLIENT' 
                  ? 'from-blue-500 to-indigo-600' 
                  : user?.role === 'FREELANCER' 
                  ? 'from-purple-500 to-pink-600' 
                  : 'from-red-500 to-orange-600'
              }`}>
                {user?.role || 'FREELANCER'}
              </span>
            </div>
            
            {/* Timeline / Date Component (Apple / Linear style) */}
            <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] mt-0.5 font-medium">
              <Calendar className="w-3 h-3 text-[#7C3AED] shrink-0" />
              <span>Today is {getFormattedDate()}</span>
              <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
              <span className="text-[#7C3AED] font-bold">Stellar Connected</span>
            </div>
          </div>

          {/* Network Badge (Testnet) */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-100 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
            Testnet
          </div>

          {/* Header right: Wallet address connected beside Testnet badge */}
          <div className="flex items-center gap-3">
            {walletAddress && (
              <div className="relative">
                <button
                  onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                  className="flex items-center gap-2 bg-[#FAFAFA] border border-[#E4E8F0] px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#334155] hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-mono text-[11px]">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                  <svg className="w-3 h-3 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showWalletDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E4E8F0] rounded-xl shadow-xl py-1.5 z-50 text-xs text-[#334155]">
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(walletAddress);
                        alert("Wallet address copied to clipboard!");
                        setShowWalletDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer font-semibold text-slate-700"
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
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 transition-colors flex items-center gap-2 border-t border-slate-100 cursor-pointer font-bold"
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
            
            {user && (
              <button
                onClick={() => {
                  logout();
                  navigate('/auth/login');
                }}
                title="Sign Out"
                className="p-2.5 rounded-xl bg-[#FAFAFA] border border-[#E4E8F0] hover:border-red-500/20 hover:bg-red-500/10 text-[#6B7280] hover:text-red-500 transition-all cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {/* Dashboard environment render */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
