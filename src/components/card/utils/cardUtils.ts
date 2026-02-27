import { Card as CardType, User as UserType, Label } from '@/lib/types';
import { cn, formatDate, isCardOverdue, getChecklistProgress } from '@/lib/utils';

/**
 * Filters members assigned to a specific card
 */
export const getCardMembers = (card: CardType, members: UserType[]): UserType[] => {
  return members.filter(member => card.members.includes(member.id));
};

/**
 * Gets labels assigned to a specific card
 */
export const getCardLabels = (card: CardType, labels: Label[]): Label[] => {
  if (!card.labelIds?.length) return [];
  return labels.filter(label => card.labelIds.includes(label.id));
};

/**
 * Calculates card metadata including overdue status and checklist progress
 */
export const getCardMetadata = (card: CardType) => {
  const isOverdue = isCardOverdue(card);
  const checklistProgress = getChecklistProgress(card.checklist);
  
  return {
    isOverdue,
    checklistProgress,
    hasDescription: Boolean(card.description),
    hasChecklist: card.checklist.length > 0,
    hasDueDate: Boolean(card.dueDate),
    memberCount: card.members.length,
    labelCount: card.labelIds?.length || 0
  };
};

/**
 * Gets CSS classes for card styling based on state
 */
export const getCardClasses = (isDragging: boolean, isOverdue: boolean, completed: boolean) => {
  return cn(
    'group cursor-pointer rounded-xl bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] dark:bg-slate-800',
    isDragging && 'opacity-50 rotate-2',
    isOverdue && !completed && 'ring-2 ring-red-500',
    completed && 'ring-2 ring-green-500'
  );
};

/**
 * Gets CSS classes for card title based on completion state
 */
export const getCardTitleClasses = (completed: boolean) => {
  return cn(
    'mb-2 text-sm font-medium text-slate-900 dark:text-slate-100 flex-1',
    completed && 'line-through opacity-60'
  );
};

/**
 * Gets CSS classes for completion toggle button
 */
export const getCompletionToggleClasses = (completed: boolean) => {
  return cn(
    'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
    completed
      ? 'bg-indigo-600 border-indigo-600'
      : 'border-slate-300 hover:border-indigo-400 dark:border-slate-600'
  );
};

/**
 * Gets CSS classes for due date display
 */
export const getDueDateClasses = (completed: boolean, isOverdue: boolean) => {
  return cn(
    'flex items-center gap-1 rounded px-2 py-1 text-xs',
    completed
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      : isOverdue
        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
        : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
  );
};
