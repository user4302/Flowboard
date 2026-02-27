'use client';

import { cn } from '@/lib/utils';
import { KanbanListHeader } from './KanbanListHeader';
import { KanbanCardsContainer } from './KanbanCardsContainer';
import { getFilteredCardCount, FilterOptions } from '@/lib/filterUtils';
import { useUIStore, useBoardStore } from '@/store';

interface ListProps {
  list: any;
  members: any[];
  onAddCard: (listId: string, title: string) => void;
  onRenameList: (listId: string, newTitle: string) => void;
  onDeleteList: (listId: string) => void;
  searchTerm?: string;
  className?: string;
  onMenuToggle?: (isOpen: boolean) => void;
  isAnyMenuOpen?: boolean;
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
  className,
  onMenuToggle,
  isAnyMenuOpen
}: ListProps) {
  // Get filter options from UI store
  const {
    searchTerm: globalSearchTerm,
    selectedLabels,
    selectedMembers,
    showCompleted,
    priorityThreshold,
    dueDateFilter
  } = useUIStore();

  const { boards, currentBoardId } = useBoardStore();
  const currentBoard = boards.find(b => b.id === currentBoardId);

  const filterOptions: FilterOptions = {
    searchTerm: globalSearchTerm || searchTerm,
    selectedLabels,
    selectedMembers,
    showCompleted,
    priorityThreshold,
    dueDateFilter
  };

  const filteredCardCount = getFilteredCardCount(list.cards, filterOptions, currentBoard?.labels || []);

  return (
    <div className={cn("flex w-80 flex-shrink-0 flex-col gap-3 h-full", className)}>
      <KanbanListHeader
        title={list.title}
        cardCount={filteredCardCount}
        onRename={(newTitle) => onRenameList(list.id, newTitle)}
        onDelete={() => onDeleteList(list.id)}
        onMenuToggle={onMenuToggle}
        isAnyMenuOpen={isAnyMenuOpen}
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
