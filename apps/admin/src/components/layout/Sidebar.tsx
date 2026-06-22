'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleSidebar, closeMobileSidebar } from '@/store/slices/uiSlice';
import { navigation } from '@/constants/navigation';
import { cn } from '@/utils/cn';
import { ChevronLeft, Heart } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const collapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);
  const mobileOpen = useSelector((state: RootState) => state.ui.sidebarMobileOpen);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => dispatch(closeMobileSidebar())} 
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-[var(--color-surface)] dark:bg-sidebar-bg border-r border-[var(--color-border)] dark:border-tamarind-800/30 transition-all duration-300 ease-out flex flex-col',
          collapsed ? 'md:w-[72px]' : 'md:w-[260px]',
          mobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0'
        )}
      >
      {/* ─── Logo ─── */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[var(--color-border)] dark:border-tamarind-800/20 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Heart className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-display font-bold text-heading dark:text-white tracking-wide truncate">
              ThankU
            </h1>
            <p className="text-[10px] text-muted dark:text-sidebar-muted tracking-widest uppercase">Admin Panel</p>
          </div>
        )}
      </div>

      {/* ─── Navigation ─── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navigation.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.15em] uppercase text-muted dark:text-sidebar-muted">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary/10 text-primary-700 dark:bg-primary/15 dark:text-primary-300'
                          : 'text-body hover:bg-[var(--color-highlight)] hover:text-heading dark:text-sidebar-text dark:hover:bg-sidebar-hover dark:hover:text-white',
                        collapsed && 'justify-center px-0'
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={cn('w-5 h-5 shrink-0', isActive && 'text-primary-600 dark:text-primary-400')} />
                      {!collapsed && (
                        <>
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ─── Collapse Toggle ─── */}
      <div className="hidden md:block px-2 py-3 border-t border-[var(--color-border)] dark:border-tamarind-800/20 shrink-0">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm transition-colors',
            'text-body hover:bg-[var(--color-highlight)] hover:text-heading dark:text-sidebar-text dark:hover:bg-sidebar-hover dark:hover:text-white',
            collapsed && 'justify-center px-0'
          )}
        >
          <ChevronLeft className={cn('w-5 h-5 transition-transform duration-300', collapsed && 'rotate-180')} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
    </>
  );
}
