'use client';

import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Plus, Menu, Sun, Moon } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useThemeStore } from '@/store/themeStore';

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
      <div className="min-h-screen bg-surface text-text-primary flex transition-colors duration-200">
        <Sidebar isOpenOnMobile={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

        {/* Backdrop for mobile */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)} 
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
        )}

        {/* Main content */}
        <main className="flex-1 md:ml-[240px] ml-0 flex flex-col min-h-screen">
          {/* Top header */}
          <header className="h-16 bg-card border-b border-border flex items-center justify-between md:px-6 px-4 sticky top-0 z-30 transition-colors duration-200">
            <div className="flex items-center">
              {/* Hamburger menu button for mobile */}
              <button 
                onClick={() => setMobileMenuOpen(true)} 
                className="p-2 -ml-2 mr-3 rounded-lg hover:bg-surface-elevated md:hidden cursor-pointer text-text-secondary hover:text-text-primary transition-colors"
                title="Open Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <h1 className="text-[15px] sm:text-[17px] font-bold text-text-primary tracking-tight truncate max-w-[140px] sm:max-w-none">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                className="p-2 rounded-[8px] hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-all cursor-pointer"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <button className="relative p-2 rounded-[8px] hover:bg-surface-elevated transition-colors text-text-secondary hover:text-text-primary">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#5B6BF8]" />
              </button>

              {showNewEscrow && (
                <Link
                  to="/escrow/new"
                  className="inline-flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-3.5 sm:py-2 rounded-[10px] bg-[#5B6BF8] text-white text-sm font-semibold hover:bg-[#4757E8] transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-[#5B6BF8]/20 hover:-translate-y-px"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1.5">New Escrow</span>
                </Link>
              )}
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 md:p-6 p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
