'use client';

import { User, MoreHorizontal } from 'lucide-react';
import { Card as CardType, User as UserType } from '@/lib/types';
import { useBoardStore } from '@/store';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardProps } from './types/TaskCard.types';
import { getCardMembers, getCardMetadata, getCardClasses, getCardTitleClasses } from './utils/TaskCardUtils';
import { useTaskModalCardActions } from '@/components/taskModal/hooks/useTaskModalCardActions';
import { TaskCardCardLabels } from './components/TaskCardCardLabels';
import { TaskCardCardMembers } from './components/TaskCardCardMembers';
import { TaskCardCardMeta } from './components/TaskCardCardMeta';
import { TaskCardCardCompletion } from './components/TaskCardCardCompletion';
import { CardContextMenu } from './components/CardContextMenu';
import { useCardContextMenu } from './hooks/useCardContextMenu';

export function TaskCard({ card, members, onClick }: CardProps) {
  const { boards, currentBoardId } = useBoardStore();
  const { handleCardClick, handleToggleCompleted } = useTaskModalCardActions();
  const { isOpen, position, handleContextMenu, handleButtonClick, closeContextMenu } = useCardContextMenu();

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
      onContextMenu={handleContextMenu}
    >
      {/* Slim colored labels at the top */}
      <TaskCardCardLabels
        labelIds={card.labelIds || []}
        labels={boardLabels}
      />

      {/* Title and completion radio */}
      <div className="flex items-start gap-2">
        <TaskCardCardCompletion
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
        <TaskCardCardMeta
          card={card}
          isOverdue={isOverdue}
          checklistProgress={checklistProgress}
        />

        {/* Members */}
        <TaskCardCardMembers members={cardMembers} />
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
            handleButtonClick(e, e.currentTarget);
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Context Menu */}
      <CardContextMenu
        card={card}
        isOpen={isOpen}
        onClose={closeContextMenu}
        position={position}
        onOpenCard={handleClick}
      />
    </div>
  );
}
