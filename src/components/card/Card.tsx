'use client';

import { useState } from 'react';
import { Calendar, User, MessageSquare, CheckSquare, MoreHorizontal } from 'lucide-react';
import { Card as CardType, User as UserType } from '@/lib/types';
import { useBoardStore, useUIStore } from '@/store';
import { cn, formatDate, isCardOverdue, getChecklistProgress } from '@/lib/utils';

interface CardProps {
  card: CardType;
  members: UserType[];
  onClick: () => void;
}

export function Card({ card, members, onClick }: CardProps) {
  const { openCardModal } = useUIStore();
  const { updateCard, currentBoardId } = useBoardStore();
  const [isDragging, setIsDragging] = useState(false);

  const cardMembers = members.filter(member => card.members.includes(member.id));
  const isOverdue = isCardOverdue(card);
  const checklistProgress = getChecklistProgress(card.checklist);

  const handleClick = () => {
    onClick();
    openCardModal(card.id);
  };

  const handleToggleCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentBoardId) {
      updateCard(currentBoardId, card.id, { completed: !card.completed });
    }
  };

  return (
    <div
      className={cn(
        'group cursor-pointer rounded-xl bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] dark:bg-slate-800',
        isDragging && 'opacity-50 rotate-2',
        isOverdue && !card.completed && 'ring-2 ring-red-500',
        card.completed && 'ring-2 ring-green-500'
      )}
      onClick={handleClick}
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      {/* Labels */}
      {card.labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {card.labels.map((label) => (
            <div
              key={label.id}
              className={cn(
                'h-2 rounded-full px-2 py-1 text-xs font-medium text-white',
                label.color
              )}
            >
              {label.text}
            </div>
          ))}
        </div>
      )}

      {/* Title and completion radio */}
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={handleToggleCompleted}
          className={cn(
            'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            card.completed
              ? 'bg-indigo-600 border-indigo-600'
              : 'border-slate-300 hover:border-indigo-400 dark:border-slate-600'
          )}
        >
          {card.completed && (
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <h3 className={cn(
          'mb-2 text-sm font-medium text-slate-900 dark:text-slate-100 flex-1',
          card.completed && 'line-through opacity-60'
        )}>
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
        <div className="flex items-center gap-2">
          {/* Due date */}
          {card.dueDate && (
            <div
              className={cn(
                'flex items-center gap-1 rounded px-2 py-1 text-xs',
                isOverdue
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              )}
            >
              <Calendar className="h-3 w-3" />
              <span>{formatDate(card.dueDate)}</span>
            </div>
          )}

          {/* Checklist progress */}
          {card.checklist.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <CheckSquare className="h-3 w-3" />
              <span>{checklistProgress}%</span>
            </div>
          )}

          {/* Description indicator */}
          {card.description && (
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <MessageSquare className="h-3 w-3" />
            </div>
          )}
        </div>

        {/* Members */}
        {cardMembers.length > 0 && (
          <div className="flex -space-x-1">
            {cardMembers.slice(0, 3).map((member, index) => (
              <div
                key={member.id}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-xs font-medium text-white dark:border-slate-900"
                style={{ zIndex: 3 - index }}
              >
                {member.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
            ))}
            {cardMembers.length > 3 && (
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-xs font-medium text-slate-600 dark:border-slate-900 dark:bg-slate-600 dark:text-slate-300"
                style={{ zIndex: 0 }}
              >
                +{cardMembers.length - 3}
              </div>
            )}
          </div>
        )}
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
