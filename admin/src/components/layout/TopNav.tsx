'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleMobileSidebar } from '@/store/slices/uiSlice';
import { Bell, Search, ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';

import { ThemeToggle } from '@/components/ThemeToggle';

export function TopNav() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <header className="shrink-0 sticky top-0 z-30 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border-subtle)] h-16 flex items-center justify-between px-4 sm:px-6">
      {/* ─── Search & Mobile Menu ─── */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        {/* Hamburger Menu (Mobile Only) */}
        <button 
          onClick={() => dispatch(toggleMobileSidebar())}
          className="md:hidden p-2 -ml-2 rounded-lg text-muted hover:bg-[var(--color-highlight)] hover:text-heading transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-[var(--color-border)] rounded-lg 
                       placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                       transition-all duration-200"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-muted bg-cream rounded border border-[var(--color-border)]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* ─── Actions ─── */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        
        {/* Notifications */}
        <Link 
          href="/dashboard/notifications"
          className="relative p-2 rounded-lg text-muted hover:bg-[var(--color-highlight)] hover:text-heading transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-[var(--color-surface)]" />
        </Link>

        {/* Divider */}
        <div className="w-px h-8 bg-tamarind-100" />

        {/* Profile */}
        <Link 
          href="/dashboard/profile"
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[var(--color-highlight)] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {user?.name?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-heading leading-tight">{user?.name || 'Admin'}</p>
            <p className="text-[11px] text-muted capitalize">{user?.role?.replace('_', ' ') || 'Super Admin'}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
