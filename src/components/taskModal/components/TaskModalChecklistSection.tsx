'use client';

import { useState } from 'react';
import { TaskModalMultiChecklistManager } from './TaskModalMultiChecklistManager';
import { Checklist, ChecklistItem } from '@/lib/types';
import { Button } from '@/components/ui';

interface TaskModalChecklistSectionProps {
  cardId: string;
  boardId: string;
  checklistHook: {
    localChecklists: Checklist[];
    addChecklist: (name: string) => void;
    updateChecklist: (checklistId: string, updates: Partial<Checklist>) => void;
    removeChecklist: (checklistId: string) => void;
    addChecklistItem: (checklistId: string, text: string) => void;
    updateChecklistItem: (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
    removeChecklistItem: (checklistId: string, itemId: string) => void;
    addChecklistItems: (checklistId: string, texts: string[]) => void;
    reorderChecklistItems: (checklistId: string, fromIndex: number, toIndex: number) => void;
    syncChecklistToStore: (checklistsToSync: Checklist[]) => void;
    resetChecklist: () => void;
  };
}

export function TaskModalChecklistSection({
  cardId,
  boardId,
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
        checklists={checklistHook.localChecklists}
        onAddChecklist={checklistHook.addChecklist}
        onUpdateChecklist={checklistHook.updateChecklist}
        onRemoveChecklist={checklistHook.removeChecklist}
        onAddChecklistItem={checklistHook.addChecklistItem}
        onUpdateChecklistItem={checklistHook.updateChecklistItem}
        onRemoveChecklistItem={checklistHook.removeChecklistItem}
        onAddChecklistItems={checklistHook.addChecklistItems}
        onReorderChecklistItems={checklistHook.reorderChecklistItems}
      />
    </div>
  );
}
