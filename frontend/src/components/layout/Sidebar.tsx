'use client';

import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  PlusCircle,
  Gavel,
  BarChart2,
  Settings,
  Briefcase,
  CreditCard,
  Star,
  MessageSquare,
  LogOut,
  ClipboardList,
  Inbox,
  FileText,
  PackageOpen,
} from 'lucide-react';
import { truncateAddress } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const CLIENT_NAV = [
  { href: '/client/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/marketplace', label: 'Browse Marketplace', icon: Briefcase },
  { href: '/client/listings', label: 'My Listings', icon: ClipboardList },
  { href: '/client/hire-requests', label: 'Hire Requests', icon: Inbox },
  { href: '/client/applications', label: 'My Applications', icon: FileText },
  { href: '/delivery', label: 'Deliveries', icon: PackageOpen },
  { href: '/chat', label: 'Messages', icon: MessageSquare },
  { href: '/client/escrows', label: 'My Escrows', icon: Shield },
  { href: '/escrow/create', label: 'Create Escrows', icon: PlusCircle },
  { href: '/client/payments', label: 'Payments', icon: CreditCard },
  { href: '/client/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/client/settings', label: 'Settings', icon: Settings },
];

const FREELANCER_NAV = [
  { href: '/freelancer/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/marketplace', label: 'Browse Marketplace', icon: Briefcase },
  { href: '/freelancer/listings', label: 'My Listings', icon: ClipboardList },
  { href: '/freelancer/applications', label: 'My Applications', icon: FileText },
  { href: '/freelancer/hire-requests', label: 'Hire Requests', icon: Inbox },
  { href: '/delivery', label: 'Deliveries', icon: PackageOpen },
  { href: '/chat', label: 'Messages', icon: MessageSquare },
  { href: '/freelancer/payments', label: 'Earnings', icon: CreditCard },
  { href: '/freelancer/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/freelancer/settings', label: 'Settings', icon: Settings },
];

const ARBITRATOR_NAV = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/disputes', label: 'Disputes', icon: Gavel, badge: true },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

const ADMIN_NAV = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/disputes', label: 'Disputes', icon: Gavel, badge: true },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

import { useThemeStore } from '@/store/themeStore';
import { Sun, Moon } from 'lucide-react';

interface SidebarProps {
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isOpenOnMobile = false, onCloseMobile }: SidebarProps) {
  const { pathname } = useLocation();
  const { user, walletAddress, logout } = useAuthStore();
  const navigate = useNavigate();

  const navLinks = user?.role === 'FREELANCER'
    ? FREELANCER_NAV
    : user?.role === 'ARBITRATOR'
    ? ARBITRATOR_NAV
    : user?.role === 'ADMIN'
    ? ADMIN_NAV
    : CLIENT_NAV;

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full w-[240px] bg-card border-r border-border flex flex-col z-50 transition-all duration-300",
      "md:translate-x-0",
      isOpenOnMobile ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-border transition-colors duration-200 justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-[7px] bg-[#7C3AED] flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="4" width="14" height="10" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M6 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="white" strokeWidth="1.5"/>
              <circle cx="9" cy="9" r="1.5" fill="white"/>
              <path d="M9 10.5v1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[16px] font-bold text-text-primary tracking-tight">EscrowX</span>
        </Link>
        {/* Close mobile menu button */}
        <button 
          onClick={onCloseMobile} 
          className="p-1 rounded-md hover:bg-surface-elevated md:hidden cursor-pointer text-text-secondary hover:text-text-primary"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Role badge */}
      {user && (
        <div className="px-5 pt-4 pb-2">
          <span className={cn(
            'text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full',
            user.role === 'CLIENT' && 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
            user.role === 'FREELANCER' && 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
            user.role === 'ARBITRATOR' && 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
            user.role === 'ADMIN' && 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400',
          )}>
            {user.role}
          </span>
          <p className="text-xs font-semibold text-text-primary mt-1 truncate">{user.name || user.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              to={link.href}
              onClick={onCloseMobile}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-[#F5F3FF] dark:bg-purple-950/20 text-[#7C3AED] dark:text-[#9F7AEA] border-l-[3px] border-l-[#7C3AED] dark:border-l-[#9F7AEA] pl-[calc(0.75rem_-_3px)]'
                  : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive ? 'text-[#7C3AED] dark:text-[#9F7AEA]' : 'text-text-muted group-hover:text-text-secondary'
                )}
              />
              {link.label}
              {(link as any).badge && (
                <span className="ml-auto text-[10px] font-bold bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 px-1.5 py-0.5 rounded-[4px]">
                  !
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border transition-colors duration-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[8px] text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border border-red-500/20 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
