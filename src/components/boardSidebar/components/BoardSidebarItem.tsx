'use client';

import { LayoutGrid, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Board } from '../types';

/**
 * BoardSidebarItem component
 * Displays board information with selection and deletion functionality
 */
export function BoardSidebarItem({
  board,
  isActive,
  onSelect,
  onDelete
}: {
  board: Board;
  isActive: boolean;
  onSelect: (boardId: string) => void;
  onDelete: (boardId: string, boardName: string) => void;
}) {
  return (
    <div className="relative group">
      <button
        onClick={() => onSelect(board.id)}
        className={cn(
          'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
          isActive
            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <LayoutGrid className="h-4 w-4 flex-shrink-0" />
            <span className="truncate" title={board.name}>{board.name}</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {board.lists.length} lists • {board.members.length} members
        </div>
      </button>

      {/* Delete button - Positioned outside the main button, shows on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(board.id, board.name);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex-shrink-0"
        title={`Delete ${board.name}`}
      >
        <Trash2 className="h-3 w-3 text-slate-400 hover:text-red-600" />
      </button>
    </div>
  );
}
