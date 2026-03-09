'use client';

import { TaskModalChecklistManager } from './TaskModalChecklistManager';
import { ChecklistItem } from '@/lib/types';

interface TaskModalChecklistSectionProps {
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
    setShowNewChecklistInput: (value: boolean) => void;
    handleCancelNewItem: () => void;
    handleStartNewItem: () => void;
    localChecklist: ChecklistItem[];
    syncChecklistToStore: () => void;
    resetChecklist: () => void;
  };
}

export function TaskModalChecklistSection({
  cardId,
  boardId,
  checklist,
  checklistHook
}: TaskModalChecklistSectionProps) {
  const completedItems = checklistHook.localChecklist.filter(item => item.done).length;
  const totalItems = checklistHook.localChecklist.length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Checklist
          </label>
          {totalItems > 0 && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {completedItems}/{totalItems} ({completionPercentage}%)
            </span>
          )}
        </div>

        {totalItems > 0 && (
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
            <div
              className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        )}
      </div>

      <TaskModalChecklistManager
        cardId={cardId}
        boardId={boardId}
        checklist={checklistHook.localChecklist}
        checklistHook={checklistHook}
      />
    </div>
  );
}
