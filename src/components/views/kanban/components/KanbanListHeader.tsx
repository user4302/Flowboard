'use client';

import { cn } from '@/lib/utils';

interface ListHeaderProps {
  title: string;
  cardCount: number;
  className?: string;
}

/**
 * KanbanListHeader component - Displays list title and card count
 */
export function KanbanListHeader({ title, cardCount, className }: ListHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h3 className="font-medium text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {cardCount}
      </span>
    </div>
  );
}
