'use client';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from '@/components/card';
import { InlineInput } from '@/components/ui';
import { filterCards } from '../utils/utils';
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

  const filteredCards = filterCards(cards, searchTerm);

  return (
    <div className={cn("flex flex-1 flex-col gap-2", className)}>
      <SortableContext items={filteredCards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        {filteredCards.map((card) => (
          <Card
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
      />
    </div>
  );
}
