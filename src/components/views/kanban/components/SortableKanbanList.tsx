'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanList } from './KanbanList';

interface SortableKanbanListProps {
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
 * SortableKanbanList component - Wraps KanbanList with drag-and-drop functionality
 */
export function SortableKanbanList({
  list,
  members,
  onAddCard,
  onRenameList,
  onDeleteList,
  searchTerm = '',
  className,
  onMenuToggle,
  isAnyMenuOpen
}: SortableKanbanListProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="transition-transform duration-300 ease-in-out"
    >
      <KanbanList
        list={list}
        members={members}
        onAddCard={onAddCard}
        onRenameList={onRenameList}
        onDeleteList={onDeleteList}
        searchTerm={searchTerm}
        className={className}
        onMenuToggle={onMenuToggle}
        isAnyMenuOpen={isAnyMenuOpen}
        dragHandleProps={{
          attributes,
          listeners,
        }}
      />
    </div>
  );
}
