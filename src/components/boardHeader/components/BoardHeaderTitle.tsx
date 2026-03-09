'use client';

import { useBoardHeaderTitle } from '../hooks/useBoardHeaderTitle';
import { Board } from '@/lib/types';

interface BoardHeaderTitleProps {
  currentBoard: Board;
}

/**
 * BoardHeaderTitle component with inline editing capability
 * 
 * Provides:
 * - Click-to-edit functionality
 * - Keyboard shortcuts (Enter to save, Escape to cancel)
 * - Auto-focus when entering edit mode
 * - Visual feedback during editing
 */
export function BoardHeaderTitle({ currentBoard }: BoardHeaderTitleProps) {
  const {
    isEditingTitle,
    tempTitle,
    setTempTitle,
    handleTitleEdit,
    handleTitleSave,
    handleTitleKeyPress,
  } = useBoardHeaderTitle(currentBoard);

  return (
    <div className="flex items-center gap-2 truncate">
      {isEditingTitle ? (
        <input
          type="text"
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          onBlur={handleTitleSave}
          onKeyDown={handleTitleKeyPress}
          className="rounded-lg border border-slate-300 px-2 py-1 text-lg font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          autoFocus // Auto-focus when entering edit mode
        />
      ) : (
        <h1
          className="cursor-pointer text-lg font-semibold text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300 truncate"
          onClick={handleTitleEdit}
        >
          {currentBoard ? currentBoard.name : null}
        </h1>
      )}
    </div>
  );
}
