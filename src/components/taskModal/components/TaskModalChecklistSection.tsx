'use client';

import { TaskModalMultiChecklistManager } from './TaskModalMultiChecklistManager';
import { Checklist, ChecklistItem } from '@/lib/types';

interface TaskModalChecklistSectionProps {
  cardId: string;
  boardId: string;
  checklists: Checklist[];
  checklistHook: {
    addChecklist: (name: string) => void;
    updateChecklist: (checklistId: string, updates: Partial<Checklist>) => void;
    removeChecklist: (checklistId: string) => void;
    addChecklistItem: (checklistId: string, text: string) => void;
    updateChecklistItem: (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
    removeChecklistItem: (checklistId: string, itemId: string) => void;
    syncChecklistToStore: () => void;
    resetChecklist: () => void;
  };
}

export function TaskModalChecklistSection({
  cardId,
  boardId,
  checklists,
  checklistHook
}: TaskModalChecklistSectionProps) {
  return (
    <div>
      <div className="mb-3">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Checklists
        </label>
      </div>

      <TaskModalMultiChecklistManager
        cardId={cardId}
        boardId={boardId}
        checklists={checklists}
        onAddChecklist={checklistHook.addChecklist}
        onUpdateChecklist={checklistHook.updateChecklist}
        onRemoveChecklist={checklistHook.removeChecklist}
        onAddChecklistItem={checklistHook.addChecklistItem}
        onUpdateChecklistItem={checklistHook.updateChecklistItem}
        onRemoveChecklistItem={checklistHook.removeChecklistItem}
      />
    </div>
  );
}
