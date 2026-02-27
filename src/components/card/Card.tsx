'use client';

import { User, MoreHorizontal } from 'lucide-react';
import { Card as CardType, User as UserType } from '@/lib/types';
import { useBoardStore } from '@/store';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardProps } from './types/card.types';
import { getCardMembers, getCardMetadata, getCardClasses, getCardTitleClasses } from './utils/cardUtils';
import { useCardActions } from './hooks/useCardActions';
import { CardLabels } from './components/CardLabels';
import { CardMembers } from './components/CardMembers';
import { CardMeta } from './components/CardMeta';
import { CardCompletion } from './components/CardCompletion';

export function Card({ card, members, onClick }: CardProps) {
  const { boards, currentBoardId } = useBoardStore();
  const { handleCardClick, handleToggleCompleted } = useCardActions();

  const currentBoard = boards.find(b => b.id === currentBoardId);
  const boardLabels = currentBoard?.labels || [];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const cardMembers = getCardMembers(card, members);
  const { isOverdue, checklistProgress } = getCardMetadata(card);

  const handleClick = () => {
    handleCardClick(card.id, onClick);
  };

  const handleToggle = (e: React.MouseEvent) => {
    if (currentBoardId) {
      handleToggleCompleted(e, currentBoardId, card.id, card.completed);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={getCardClasses(isDragging, isOverdue, card.completed)}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      onClick={handleClick}
    >
      {/* Slim colored labels at the top */}
      <CardLabels
        labelIds={card.labelIds || []}
        labels={boardLabels}
      />

      {/* Title and completion radio */}
      <div className="flex items-start gap-2">
        <CardCompletion
          completed={card.completed}
          onToggle={handleToggle}
        />
        <h3 className={getCardTitleClasses(card.completed)}>
          {card.title}
        </h3>
      </div>

      {/* Description preview */}
      {card.description && (
        <p className="mb-3 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
          {card.description}
        </p>
      )}

      {/* Meta information */}
      <div className="flex items-center justify-between">
        <CardMeta
          card={card}
          isOverdue={isOverdue}
          checklistProgress={checklistProgress}
        />

        {/* Members */}
        <CardMembers members={cardMembers} />
      </div>

      {/* Hover actions */}
      <div className="mt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1">
          {cardMembers.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <User className="h-3 w-3" />
              <span>{cardMembers.length}</span>
            </div>
          )}
        </div>
        <button
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          onClick={(e) => {
            e.stopPropagation();
            // Open card menu
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
