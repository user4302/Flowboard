'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';
import { TaskCard } from '@/components/taskCard';
import { InlineInput } from '@/components/ui';
import { CustomTooltip } from '@/components/ui/custom-tooltip';
import { filterCards, FilterOptions } from '@/lib/filterUtils';
import { useUIStore, useBoardStore } from '@/store';
import { useClipboardDetection } from '@/hooks/useClipboardDetection';
import { jsonToCardData } from '@/lib/cardJsonUtils';
import { cn } from '@/lib/utils';
import { Card, User } from '@/lib/types';
import { CardJSON } from '@/lib/cardJsonUtils';
import { Upload, Plus, ClipboardPaste, Loader2 } from 'lucide-react';

interface KanbanCardsContainerProps {
  cards: Card[];
  listId: string;
  members: User[];
  onAddCard: (listId: string, title: string) => void;
  searchTerm?: string;
  className?: string;
}

/**
 * KanbanCardsContainer component - Displays cards with sorting and add card functionality
 */
export function KanbanCardsContainer({
  cards,
  listId,
  members,
  onAddCard,
  searchTerm = '',
  className
}: KanbanCardsContainerProps) {
  const { setNodeRef } = useDroppable({
    id: listId,
  });

  // Get filter options from UI store
  const {
    searchTerm: globalSearchTerm,
    selectedLabels,
    selectedMembers,
    showCompleted,
    priorityThreshold,
    dueDateFilter
  } = useUIStore();

  const { boards, currentBoardId, createCardFromData } = useBoardStore();
  const currentBoard = boards.find(b => b.id === currentBoardId);

  // Smart paste detection - removed for performance
  const { getCardJSONFromClipboard } = useClipboardDetection();
  const [isPasting, setIsPasting] = useState(false);

  const filterOptions: FilterOptions = {
    searchTerm: globalSearchTerm || searchTerm,
    selectedLabels,
    selectedMembers,
    showCompleted,
    priorityThreshold,
    dueDateFilter
  };

  // Memoize filtered cards to prevent excessive re-renders
  const filteredCards = useMemo(() => {
    return filterCards(cards, filterOptions, currentBoard?.labels || []);
  }, [cards, filterOptions, currentBoard?.labels]);

  const handlePasteCardJSON = async (cardJSON: CardJSON) => {
    if (!currentBoard || !currentBoardId) return;

    try {
      // Convert JSON to card data format
      const cardData = jsonToCardData(cardJSON, currentBoard.labels || [], currentBoard.members || []);

      // Create card from data
      const newCard = createCardFromData(currentBoardId, listId, cardData);

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

      // Convert JSON to card data format
      const cardData = jsonToCardData(cardJSON, currentBoard.labels || [], currentBoard.members || []);

      // Create card from data
      const newCard = createCardFromData(currentBoardId, listId, cardData);

    } catch (error) {
      console.error('Failed to create card from uploaded file:', error);
      alert('Failed to create card from uploaded file. Please check the format.');
    }

    // Reset the file input
    event.target.value = '';
  };

  return (
    <div
      ref={setNodeRef}
      className={cn("flex flex-1 flex-col gap-2 min-h-[100px]", className)}
    >
      <SortableContext items={filteredCards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        {filteredCards.map((card) => (
          <TaskCard
            key={card.id}
            card={card}
            members={members}
            onClick={() => { }}
          />
        ))}
      </SortableContext>

      <div className="flex gap-2">
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

        {/* Paste button - always visible, validates on click */}
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
                  // Show user-friendly error for invalid clipboard content
                  alert('No valid card JSON found in clipboard. Please copy a card first using "Copy JSON" from the card menu.');
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
      </div>

      {/* Hidden file input for upload */}
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
