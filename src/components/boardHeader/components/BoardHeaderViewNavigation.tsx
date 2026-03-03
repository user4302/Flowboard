'use client';

import { VIEWS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { LayoutGrid, CalendarDays, Calendar } from 'lucide-react';

interface BoardHeaderViewNavigationProps {
  currentView: string;
  onViewChange: (viewId: string) => void;
}

/**
 * BoardHeaderViewNavigation component for switching between different board views
 * 
 * Displays tabs for each available view with icons and active state styling
 */
export function BoardHeaderViewNavigation({ currentView, onViewChange }: BoardHeaderViewNavigationProps) {
  // Icon mapping for views
  const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'LayoutGrid': LayoutGrid,
    'CalendarDays': CalendarDays,
    'Calendar': Calendar,
  };

  return (
    <div className="flex items-center gap-2">
      {VIEWS.map((view) => {
        const Icon = iconMap[view.icon] || LayoutGrid;
        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              currentView === view.id
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{view.name}</span>
          </button>
        );
      })}
    </div>
  );
}
