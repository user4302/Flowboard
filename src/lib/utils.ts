import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isAfter, isBefore, isToday, isPast, isFuture } from 'date-fns';

/**
 * Utility function for combining CSS classes
 * Merges clsx with tailwind-merge for better Tailwind CSS class handling
 * @param inputs - Class values to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a random unique ID
 * Creates a 22-character random string for unique identifiers
 * @returns Random ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Format a date in a readable format
 * @param date - Date to format
 * @returns Formatted date string (e.g., "Feb 25, 2026")
 */
export function formatDate(date: Date | undefined | null): string {
  if (!date) return '';
  return format(date, 'MMM d, yyyy');
}

/**
 * Format a date and time in a readable format
 * @param date - Date to format
 * @returns Formatted date-time string (e.g., "Feb 25, 2026 8:30 PM")
 */
export function formatDateTime(date: Date | undefined | null): string {
  if (!date) return '';
  return format(date, 'MMM d, yyyy h:mm a');
}

/**
 * Check if a card is overdue
 * @param card - Card object with due date
 * @returns True if card is overdue
 */
export function isCardOverdue(card: { dueDate?: Date }): boolean {
  if (!card.dueDate) return false;
  return isPast(card.dueDate) && !isToday(card.dueDate);
}

/**
 * Check if a card is due soon
 * @param card - Card object with due date
 * @param days - Number of days to consider "soon" (default: 3)
 * @returns True if card is due within specified days
 */
export function isCardDueSoon(card: { dueDate?: Date }, days: number = 3): boolean {
  if (!card.dueDate) return false;
  const now = new Date();
  const dueDate = card.dueDate;
  const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffInDays >= 0 && diffInDays <= days;
}

/**
 * Calculate checklist completion percentage
 * @param checklist - Array of checklist items with done status
 * @returns Percentage of completed items (0-100)
 */
export function getChecklistProgress(checklist: { done: boolean }[]): number {
  if (checklist.length === 0) return 0;
  const completed = checklist.filter(item => item.done).length;
  return Math.round((completed / checklist.length) * 100);
}

/**
 * Debounce function calls
 * Delays function execution until after specified wait time
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
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

/**
 * Reorder array by moving item from one index to another
 * @param array - Array to reorder
 * @param fromIndex - Source index
 * @param toIndex - Target index
 * @returns New reordered array
 */
export function reorderArray<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = Array.from(array);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Move array item from one array to another (or within the same array)
 * @param array - Source array
 * @param fromIndex - Source index
 * @param toIndex - Target index
 * @param targetArray - Optional target array (defaults to source array)
 * @returns Object with updated source and target arrays
 */
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

/**
 * Get initials from a name
 * @param name - Full name
 * @returns Initials (up to 2 characters)
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
}

/**
 * Get avatar color based on name
 * Uses consistent hash-based color selection
 * @param name - Name to generate color for
 * @returns Tailwind CSS color class
 */
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
