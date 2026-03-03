'use client';

import { Archive } from 'lucide-react';
import { EmptyStateProps } from '../types';

export function EmptyState({ archivedCardsLength }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
        <Archive className="h-6 w-6 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
        No archived cards
      </h3>
      <p className="text-slate-600 dark:text-slate-400">
        Cards you archive will appear here for easy restoration.
      </p>
    </div>
  );
}
