'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { cn } from '@/utils/cn';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const collapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      <div
        className={cn(
          'flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 w-full',
          collapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'
        )}
      >
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
