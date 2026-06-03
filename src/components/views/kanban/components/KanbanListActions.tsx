'use client';

import { useState } from 'react';
import { InlineInput } from '@/components/ui';
import { CustomTooltip } from '@/components/ui/custom-tooltip';
import { useClipboardDetection } from '@/hooks/useClipboardDetection';
import { jsonToCardData } from '@/lib/cardJsonUtils';
import { cn } from '@/lib/utils';
import { CardJSON } from '@/lib/cardJsonUtils';
import { Upload, ClipboardPaste, Loader2 } from 'lucide-react';
import { useBoardStore } from '@/store';

interface KanbanListActionsProps {
  listId: string;
  onAddCard: (listId: string, title: string) => void;
  className?: string;
}

export function KanbanListActions({ listId, onAddCard, className }: KanbanListActionsProps) {
  const { boards, currentBoardId, createCardFromData } = useBoardStore();
  const currentBoard = boards.find(b => b.id === currentBoardId);
  const { getCardJSONFromClipboard } = useClipboardDetection();
  const [isPasting, setIsPasting] = useState(false);

  const handlePasteCardJSON = async (cardJSON: CardJSON) => {
    if (!currentBoard || !currentBoardId) return;

    try {
      const cardData = jsonToCardData(cardJSON, currentBoard.labels || [], currentBoard.members || []);
      createCardFromData(currentBoardId, listId, cardData);
    } catch (error) {
      console.error('Failed to create card from JSON:', error);
      alert('Failed to create card from JSON. Please check the format.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentBoard || !currentBoardId) return;

    try {
      const text = await file.text();
      const cardJSON = JSON.parse(text) as CardJSON;
      const cardData = jsonToCardData(cardJSON, currentBoard.labels || [], currentBoard.members || []);
      createCardFromData(currentBoardId, listId, cardData);
    } catch (error) {
      console.error('Failed to create card from uploaded file:', error);
      alert('Failed to create card from uploaded file. Please check the format.');
    }
    event.target.value = '';
  };

  return (
    <div className={cn("flex gap-2 p-2 pt-0 bg-transparent", className)}>
      <InlineInput
        placeholder="Enter card title..."
        addText="Add card"
        triggerText="Add a card"
        onAdd={(title) => onAddCard(listId, title)}
        iconOnly={true}
        tooltipText="Add a card"
      />

      <CustomTooltip text="Upload card">
        <button
          className={cn(
            "flex w-8 h-8 items-center justify-center rounded-xl transition-colors",
            "border border-slate-200 dark:border-slate-600",
            "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          )}
          onClick={() => document.getElementById(`card-upload-${listId}`)?.click()}
        >
          <Upload className="h-4 w-4" />
        </button>
      </CustomTooltip>

      <CustomTooltip text="Paste card from clipboard">
        <button
          className={cn(
            "ml-auto flex w-8 h-8 items-center justify-center rounded-xl transition-colors",
            isPasting
              ? "text-blue-400 bg-blue-50 border border-blue-200 dark:border-blue-800"
              : "text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 border border-blue-200 dark:border-blue-800"
          )}
          onClick={async () => {
            setIsPasting(true);
            try {
              const cardJSON = await getCardJSONFromClipboard();
              if (cardJSON) {
                handlePasteCardJSON(cardJSON);
              } else {
                alert('No valid card JSON found in clipboard.');
              }
            } catch (error) {
              console.error('Paste failed:', error);
              alert('Failed to paste card. Please try again.');
            } finally {
              setIsPasting(false);
            }
          }}
        >
          {isPasting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ClipboardPaste className="h-4 w-4" />
          )}
        </button>
      </CustomTooltip>

      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
        id={`card-upload-${listId}`}
      />
    </div>
  );
}
