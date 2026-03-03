'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from '@/components/taskCard';
import { InlineInput } from '@/components/ui';
import { filterCards, FilterOptions } from '@/lib/filterUtils';
import { useUIStore, useBoardStore } from '@/store';
import { useClipboardDetection } from '@/hooks/useClipboardDetection';
import { jsonToCardData } from '@/lib/cardJsonUtils';
import { cn } from '@/lib/utils';

interface KanbanCardsContainerProps {
  cards: any[];
  listId: string;
  members: any[];
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

  // Smart paste detection
  const { hasValidCardJSON, getCardJSONFromClipboard } = useClipboardDetection();

  const filterOptions: FilterOptions = {
    searchTerm: globalSearchTerm || searchTerm,
    selectedLabels,
    selectedMembers,
    showCompleted,
    priorityThreshold,
    dueDateFilter
  };

  const filteredCards = filterCards(cards, filterOptions, currentBoard?.labels || []);

  const handlePasteCardJSON = async (cardJSON: any) => {
    if (!currentBoard || !currentBoardId) return;

    try {
      // Convert JSON to card data format
      const cardData = jsonToCardData(cardJSON, currentBoard.labels || [], currentBoard.members || []);

      // Create card from data
      const newCard = createCardFromData(currentBoardId, listId, cardData);

      if (newCard) {
        console.log('Card created from JSON:', newCard);
      }
    } catch (error) {
      console.error('Failed to create card from JSON:', error);
      alert('Failed to create card from JSON. Please check the format.');
    }
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

      <InlineInput
        placeholder="Enter card title..."
        addText="Add card"
        triggerText="Add a card"
        onAdd={(title) => onAddCard(listId, title)}
        enableSmartPaste={hasValidCardJSON}
        onPasteCardJSON={handlePasteCardJSON}
      />
    </div>
  );
}
