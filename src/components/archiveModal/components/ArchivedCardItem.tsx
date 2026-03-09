'use client';

import { RotateCcw, Trash2, Calendar } from 'lucide-react';
import { ArchivedCardItemProps } from '../types';
import { List } from '@/lib/types';

export function ArchivedCardItem({
  archivedCard,
  onUnarchive,
  onPermanentlyDelete,
  isProcessing,
  currentBoard,
  formatDate,
}: ArchivedCardItemProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
            {archivedCard.card.title}
          </h4>
          {archivedCard.card.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
              {archivedCard.card.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Archived {formatDate(archivedCard.archivedAt)}</span>
            </div>
            <div>
              From: {currentBoard?.lists.find((l: List) => l.id === archivedCard.originalListId)?.title || 'Unknown list'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onUnarchive(archivedCard.id)}
            disabled={isProcessing}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="h-3 w-3" />
            Restore
          </button>
          <button
            onClick={() => onPermanentlyDelete(archivedCard.id, archivedCard.card.title)}
            disabled={isProcessing}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
