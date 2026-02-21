import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isAfter, isBefore, isToday, isPast, isFuture } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatDate(date: Date | undefined | null): string {
  if (!date) return '';
  return format(date, 'MMM d, yyyy');
}

export function formatDateTime(date: Date | undefined | null): string {
  if (!date) return '';
  return format(date, 'MMM d, yyyy h:mm a');
}

export function isCardOverdue(card: { dueDate?: Date }): boolean {
  if (!card.dueDate) return false;
  return isPast(card.dueDate) && !isToday(card.dueDate);
}

export function isCardDueSoon(card: { dueDate?: Date }, days: number = 3): boolean {
  if (!card.dueDate) return false;
  const now = new Date();
  const dueDate = card.dueDate;
  const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffInDays >= 0 && diffInDays <= days;
}

export function getChecklistProgress(checklist: { done: boolean }[]): number {
  if (checklist.length === 0) return 0;
  const completed = checklist.filter(item => item.done).length;
  return Math.round((completed / checklist.length) * 100);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function reorderArray<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = Array.from(array);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

export function moveArrayItem<T>(
  array: T[],
  fromIndex: number,
  toIndex: number,
  targetArray?: T[]
): { source: T[]; target: T[] } {
  const sourceResult = Array.from(array);
  const [removed] = sourceResult.splice(fromIndex, 1);
  
  const targetResult = targetArray ? Array.from(targetArray) : sourceResult;
  targetResult.splice(toIndex, 0, removed);
  
  return {
    source: sourceResult,
    target: targetResult,
  };
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
}

export function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-teal-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}
