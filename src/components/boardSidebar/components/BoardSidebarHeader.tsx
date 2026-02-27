'use client';

import { LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui';

/**
 * BoardSidebarHeader component with app branding and mobile close button
 */
export function BoardSidebarHeader({
  onClose
}: {
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2">
        <LayoutGrid className="h-6 w-6 text-indigo-600" />
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Flowboard
        </h1>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onClose}
      >
        ×
      </Button>
    </div>
  );
}
