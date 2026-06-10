'use client';

import { LayoutGrid, Calendar, List, Table, SlidersHorizontal } from 'lucide-react';
import { useUIStore } from '@/store';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const { currentView, setCurrentView, setShowFilterSheet } = useUIStore();
  
  console.log('MobileBottomNav: Rendering, currentView=', currentView);

  const navItems = [
    { id: 'kanban', icon: LayoutGrid, label: 'Kanban' },
    { id: 'timeline', icon: Calendar, label: 'Timeline' },
    { id: 'calendar', icon: List, label: 'Calendar' },
    { id: 'table', icon: Table, label: 'Table' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-[9999] flex h-16 w-full items-center justify-around border-t-4 border-yellow-400 bg-red-600 px-2 shadow-2xl">
      <div className="text-white font-bold text-lg">TEST NAV: {currentView}</div>
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          size="icon"
          className={cn(
            "flex flex-col gap-1 h-full w-full rounded-none text-xs",
            currentView === item.id ? "text-blue-600 dark:text-blue-400" : "text-slate-500"
          )}
          onClick={() => {
            setCurrentView(item.id as any);
          }}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="icon"
        className="flex flex-col gap-1 h-full w-full rounded-none text-xs text-slate-500"
        onClick={() => setShowFilterSheet(true)}
      >
        <SlidersHorizontal className="h-5 w-5" />
        Filter
      </Button>
    </nav>
  );
}