'use client';

import { EnhancedChecklistManager } from './EnhancedChecklistManager';
import { ChecklistItem } from '@/lib/types';

interface ModalChecklistSectionProps {
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

export function ModalChecklistSection({
  cardId,
  boardId,
  checklist,
  checklistHook
}: ModalChecklistSectionProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Checklist
      </label>
      <EnhancedChecklistManager
        cardId={cardId}
        boardId={boardId}
        checklist={checklist}
        checklistHook={checklistHook}
      />
    </div>
  );
}
