'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

/**
 * Inline board creation form component
 * Provides input field and action buttons for creating new boards
 */
export function BoardCreationForm({ 
  onCreateBoard,
  onCancel
}: {
  onCreateBoard: (name: string) => void;
  onCancel: () => void;
}) {
  const [boardName, setBoardName] = useState('');

  const handleSubmit = () => {
    if (boardName.trim()) {
      onCreateBoard(boardName.trim());
      setBoardName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onCancel();
      setBoardName('');
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      onCancel();
      setBoardName('');
    }, 200);
  };

  return (
    <div className="mb-3 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
      <input
        type="text"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        onKeyDown={handleKeyPress}
        onBlur={handleBlur}
        placeholder="Board name..."
        className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        autoFocus
      />
      <div className="mt-2 flex gap-2">
        <Button size="sm" onClick={handleSubmit}>
          Add
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onCancel();
            setBoardName('');
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
