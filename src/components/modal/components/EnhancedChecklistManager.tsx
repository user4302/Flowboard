'use client';

import { Trash2, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/ui';
import { ChecklistItem } from '@/lib/types';

interface EnhancedChecklistManagerProps {
  cardId: string;
  boardId: string;
  checklist: ChecklistItem[];
  checklistHook: {
    handleAddChecklistItem: () => void;
    handleToggleChecklistItem: (itemId: string, done: boolean) => void;
    handleDeleteChecklistItem: (itemId: string) => void;
    newChecklistItem: string;
    showNewChecklistInput: boolean;
    setNewChecklistItem: (value: string) => void;
    handleCancelNewItem: () => void;
    handleStartNewItem: () => void;
  };
}

export function EnhancedChecklistManager({
  cardId,
  boardId,
  checklist,
  checklistHook
}: EnhancedChecklistManagerProps) {
  // Don't render if we don't have valid IDs
  if (!cardId || !boardId) {
    return null;
  }

  return (
    <div className="space-y-2">
      {checklist?.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.done}
            onChange={(e) => checklistHook.handleToggleChecklistItem(item.id, e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
          />
          <span
            className={cn(
              'flex-1 text-sm',
              item.done && 'line-through text-slate-500 dark:text-slate-400'
            )}
          >
            {item.text}
          </span>
          <button
            type="button"
            onClick={() => checklistHook.handleDeleteChecklistItem(item.id)}
            className="text-slate-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {/* Add new item input field */}
      {checklistHook.showNewChecklistInput && (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Add new item..."
            value={checklistHook.newChecklistItem}
            onChange={(e) => checklistHook.setNewChecklistItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                checklistHook.handleAddChecklistItem();
              } else if (e.key === 'Escape') {
                checklistHook.handleCancelNewItem();
              }
            }}
            className="flex-1"
            autoFocus
          />
          <Button
            type="button"
            size="sm"
            onClick={checklistHook.handleAddChecklistItem}
            disabled={!checklistHook.newChecklistItem.trim()}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={checklistHook.handleCancelNewItem}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Add item button */}
      {!checklistHook.showNewChecklistInput && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={checklistHook.handleStartNewItem}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add item
        </Button>
      )}
    </div>
  );
}
