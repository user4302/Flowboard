'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

interface AddListButtonProps {
  onAddList: (title: string) => void;
  className?: string;
}

/**
 * AddListButton component - Handles new list creation with inline input
 */
export function AddListButton({ onAddList, className }: AddListButtonProps) {
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState('');

  const handleAddList = () => {
    if (title.trim()) {
      onAddList(title.trim());
      setTitle('');
      setShowInput(false);
    }
  };

  const handleCancel = () => {
    setShowInput(false);
    setTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddList();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      handleCancel();
    }, 200);
  };

  if (showInput) {
    return (
      <div className={cn("w-80 flex-shrink-0", className)}>
        <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <Input
            placeholder="Enter list title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddList}>
              Add list
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      className={cn(
        "flex h-fit w-80 flex-shrink-0 items-center gap-2 rounded-xl p-3 text-left text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300",
        className
      )}
      onClick={() => setShowInput(true)}
    >
      <Plus className="h-4 w-4" />
      <span>Add another list</span>
    </button>
  );
}
