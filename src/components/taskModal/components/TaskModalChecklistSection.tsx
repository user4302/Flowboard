'use client';

import { useState } from 'react';
import { TaskModalMultiChecklistManager } from './TaskModalMultiChecklistManager';
import { Checklist, ChecklistItem } from '@/lib/types';
import { Button } from '@/components/ui';

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
    addChecklistItems: (checklistId: string, texts: string[]) => void;
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
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const handleSmartImport = (checklistId: string) => {
    if (importText.trim()) {
      const items = importText.split('\n').filter(line => line.trim() !== '');
      checklistHook.addChecklistItems(checklistId, items);
      setImportText('');
      setShowImport(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Checklists
        </label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowImport(!showImport)}
          className="text-xs"
        >
          {showImport ? 'Cancel Import' : 'Smart Import'}
        </Button>
      </div>

      {showImport && (
        <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <textarea
            className="w-full h-24 p-2 text-sm rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
            placeholder="Paste list of items here, separated by newlines..."
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <Button 
            className="mt-2 w-full" 
            size="sm"
            onClick={() => {
              if (checklists.length > 0) {
                handleSmartImport(checklists[0].id);
              } else {
                checklistHook.addChecklist('New Checklist');
                // The new checklist ID isn't available immediately. 
                // This simple implementation assumes one checklist exists or needs creation.
              }
            }}
          >
            Import Items
          </Button>
        </div>
      )}

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
