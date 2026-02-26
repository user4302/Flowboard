'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

interface AddCardButtonProps {
  listId: string;
  onAddCard: (listId: string, title: string) => void;
  className?: string;
}

/**
 * AddCardButton component - Handles new card creation with inline input
 */
export function AddCardButton({ listId, onAddCard, className }: AddCardButtonProps) {
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState('');

  const handleAddCard = () => {
    if (title.trim()) {
      onAddCard(listId, title.trim());
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
      handleAddCard();
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
      <div className={cn("rounded-xl border border-slate-200 p-3 dark:border-slate-700", className)}>
        <Input
          placeholder="Enter card title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="mb-2"
          autoFocus
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleAddCard}>
            Add card
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
    );
  }

  return (
    <button
      className={cn(
        "flex items-center gap-2 rounded-xl p-3 text-left text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300",
        className
      )}
      onClick={() => setShowInput(true)}
    >
      <Plus className="h-4 w-4" />
      <span>Add a card</span>
    </button>
  );
}
