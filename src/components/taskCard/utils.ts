import { Card as CardType, User as UserType } from '@/lib/types';

export function getCardMembers(card: CardType, members: UserType[]): UserType[] {
  if (!card.members || card.members.length === 0) {
    return [];
  }

  return members.filter(member => card.members?.includes(member.id));
}

export function getCardMetadata(card: CardType) {
  const now = new Date();

  // Check if card is overdue
  const isOverdue = card.dueDate ? card.dueDate < now && !card.completed : false;

  // Calculate checklist progress
  const totalChecklistItems = card.checklists?.reduce((acc, checklist) => acc + checklist.items.length, 0) || 0;
  const completedChecklistItems = card.checklists?.reduce(
    (acc, checklist) => acc + checklist.items.filter(item => item.done).length,
    0
  ) || 0;
  const checklistProgress = totalChecklistItems > 0
    ? Math.round((completedChecklistItems / totalChecklistItems) * 100)
    : 0;

  return {
    isOverdue,
    checklistProgress,
    totalChecklistItems,
    completedChecklistItems
  };
}

export function getCardClasses(isDragging: boolean, isOverdue: boolean, completed: boolean) {
  const baseClasses = "group cursor-pointer rounded-xl bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] dark:bg-slate-800";

  const stateClasses = [
    isDragging && "opacity-50 rotate-2",
    isOverdue && !completed && "ring-2 ring-red-500",
    completed && "ring-2 ring-green-500"
  ].filter(Boolean).join(' ');

  return `${baseClasses} ${stateClasses}`;
}

export function getCardTitleClasses(completed: boolean) {
  const baseClasses = "text-sm font-medium text-slate-900 dark:text-slate-100";
  const completedClass = completed ? "line-through opacity-60" : "";

  return `${baseClasses} ${completedClass}`;
}

export function getDueDateClasses(completed: boolean, isOverdue: boolean) {
  const baseClasses = "flex items-center gap-1 text-xs";

  if (completed) {
    return `${baseClasses} text-slate-400 dark:text-slate-500 line-through`;
  }

  if (isOverdue) {
    return `${baseClasses} text-red-600 dark:text-red-400 font-medium`;
  }

  return `${baseClasses} text-slate-500 dark:text-slate-400`;
}
