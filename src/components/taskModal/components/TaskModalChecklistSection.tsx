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
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Checklist
      </label>
      <TaskModalChecklistManager
        cardId={cardId}
        boardId={boardId}
        checklist={checklistHook.localChecklist}
        checklistHook={checklistHook}
      />
    </div>
  );
}
