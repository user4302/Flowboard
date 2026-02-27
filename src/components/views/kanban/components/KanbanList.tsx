'use client';

import { cn } from '@/lib/utils';
import { KanbanListHeader } from './KanbanListHeader';
import { KanbanCardsContainer } from './KanbanCardsContainer';
import { getFilteredCardCount } from '../utils/utils';

interface ListProps {
  list: any;
  members: any[];
  onAddCard: (listId: string, title: string) => void;
  onRenameList: (listId: string, newTitle: string) => void;
  onDeleteList: (listId: string) => void;
  searchTerm?: string;
  className?: string;
}

/**
 * KanbanList component - Renders a single kanban list with header and cards
 */
export function KanbanList({
  list,
  members,
  onAddCard,
  onRenameList,
  onDeleteList,
  searchTerm = '',
  className
}: ListProps) {

  const filteredCardCount = getFilteredCardCount(list, searchTerm);

  return (
    <div className={cn("flex w-80 flex-shrink-0 flex-col gap-3 h-full", className)}>
      <KanbanListHeader
        title={list.title}
        cardCount={filteredCardCount}
        onRename={(newTitle) => onRenameList(list.id, newTitle)}
        onDelete={() => onDeleteList(list.id)}
      />

      <KanbanCardsContainer
        cards={list.cards}
        listId={list.id}
        members={members}
        onAddCard={onAddCard}
        searchTerm={searchTerm}
      />
    </div>
  );
}
