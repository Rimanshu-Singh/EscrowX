'use client';

import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Plus, Menu, Sun, Moon, BookOpen } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useThemeStore } from '@/store/themeStore';
import { OnboardingGuide, openOnboardingGuide } from '@/components/shared/OnboardingGuide';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  showNewEscrow?: boolean;
}

export function AppLayout({ children, title, showNewEscrow = true }: AppLayoutProps) {
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="flex min-h-screen min-w-0 bg-surface text-text-primary transition-colors duration-200">
        <Sidebar isOpenOnMobile={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

        {/* Backdrop for mobile */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)} 
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
        )}

        {/* Main content */}
        <main className="ml-0 flex min-h-screen min-w-0 flex-1 flex-col md:ml-[240px]">
          {/* Top header */}
          <header className="sticky top-0 z-30 flex h-16 min-w-0 items-center justify-between gap-2 border-b border-border bg-card px-3 transition-colors duration-200 sm:px-4 md:px-6">
            <div className="flex min-w-0 items-center">
              {/* Hamburger menu button for mobile */}
              <button 
                onClick={() => setMobileMenuOpen(true)} 
                className="-ml-1 mr-2 grid size-10 shrink-0 place-items-center rounded-lg text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary md:hidden cursor-pointer"
                title="Open Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <h1 className="max-w-[96px] truncate text-[14px] font-bold tracking-tight text-text-primary sm:max-w-none sm:text-[17px]">{title}</h1>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              {/* Theme Toggle Button */}
              <button
                onClick={openOnboardingGuide}
                title="Open EscrowX guide"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-[8px] px-2.5 py-2 text-xs font-bold text-text-secondary transition-all hover:bg-surface-elevated hover:text-text-primary"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden lg:inline">Learn</span>
              </button>

              <button
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                className="grid size-10 place-items-center rounded-[8px] text-text-secondary transition-all hover:bg-surface-elevated hover:text-text-primary cursor-pointer"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <button className="relative hidden size-10 place-items-center rounded-[8px] text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary sm:grid">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#5B6BF8]" />
              </button>

              {showNewEscrow && (
                <Link
                  to="/escrow/new"
                  className="inline-flex size-10 items-center justify-center rounded-[10px] bg-[#5B6BF8] text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#4757E8] hover:shadow-md hover:shadow-[#5B6BF8]/20 hover:-translate-y-px sm:h-auto sm:w-auto sm:px-3.5 sm:py-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1.5">New Escrow</span>
                </Link>
              )}
            </div>
          </header>

          {/* Page content */}
          <div className="min-w-0 flex-1 p-3 sm:p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
      <OnboardingGuide />
    </div>
  );
}
