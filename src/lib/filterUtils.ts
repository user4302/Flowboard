import { Card, Label, User } from '@/lib/types';
import { isCardOverdue, formatDate } from '@/lib/utils';

export interface FilterOptions {
  searchTerm: string;
  selectedLabels: string[];
  selectedMembers: string[];
  showCompleted: 'all' | 'completed' | 'incomplete';
  priorityThreshold: number | null;
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week' | 'month';
}

/**
 * Enhanced filter function for cards with comprehensive filtering options
 * Filters by:
 * - Search term (title, description, labels)
 * - Selected labels
 * - Selected members
 * - Completion status
 * - Priority
 * - Due date
 */
export const filterCards = (
  cards: Card[],
  options: FilterOptions,
  boardLabels: Label[] = []
): Card[] => {
  return cards.filter((card) => {
    // Search term filtering
    if (options.searchTerm) {
      const searchLower = options.searchTerm.toLowerCase();
      const titleMatch = card.title.toLowerCase().includes(searchLower);
      const descriptionMatch = card.description?.toLowerCase().includes(searchLower) || false;

      // Check label text matches
      const cardLabels = boardLabels.filter(label => card.labelIds.includes(label.id));
      const labelMatch = cardLabels.some(label =>
        label.text.toLowerCase().includes(searchLower)
      );

      if (!titleMatch && !descriptionMatch && !labelMatch) {
        return false;
      }
    }

    // Label filtering
    if (options.selectedLabels.length > 0) {
      const hasSelectedLabel = options.selectedLabels.some(labelId =>
        card.labelIds.includes(labelId)
      );
      if (!hasSelectedLabel) return false;
    }

    // Member filtering
    if (options.selectedMembers.length > 0) {
      const hasSelectedMember = options.selectedMembers.some(memberId =>
        card.members.includes(memberId)
      );
      if (!hasSelectedMember) return false;
    }

    // Completion status filtering
    if (options.showCompleted === 'completed' && !card.completed) {
      return false;
    }
    if (options.showCompleted === 'incomplete' && card.completed) {
      return false;
    }

    // Priority filtering (Threshold-based)
    if (options.priorityThreshold !== null) {
      if (!card.priority || card.priority < options.priorityThreshold) {
        return false;
      }
    }

    // Due date filtering
    if (options.dueDateFilter !== 'all') {
      if (!card.dueDate) {
        // If filtering by due date but card has no due date, exclude it
        return false;
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today.getTime());
      const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      switch (options.dueDateFilter) {
        case 'overdue':
          if (!isCardOverdue(card)) return false;
          break;
        case 'today':
          const cardDate = new Date(card.dueDate.getFullYear(), card.dueDate.getMonth(), card.dueDate.getDate());
          if (cardDate.getTime() !== today.getTime()) return false;
          break;
        case 'week':
          if (card.dueDate < weekStart || card.dueDate > weekEnd) return false;
          break;
        case 'month':
          if (card.dueDate < monthStart || card.dueDate > monthEnd) return false;
          break;
      }
    }

    return true;
  });
};

/**
 * Get card count for a list after filtering
 */
export const getFilteredCardCount = (
  cards: Card[],
  options: FilterOptions,
  boardLabels: Label[] = []
): number => {
  return filterCards(cards, options, boardLabels).length;
};

/**
 * Get all unique priorities from cards
 */
export const getAvailablePriorities = (cards: Card[]): number[] => {
  const priorities = cards
    .map(card => card.priority)
    .filter((priority): priority is number => priority !== undefined);
  return [...new Set(priorities)].sort((a, b) => b - a); // Sort descending (high to low)
};

/**
 * Get all unique members from cards
 */
export const getAvailableMembers = (cards: Card[], boardMembers: User[]): User[] => {
  const memberIds = cards.flatMap(card => card.members);
  const uniqueMemberIds = [...new Set(memberIds)];
  return boardMembers.filter(member => uniqueMemberIds.includes(member.id));
};

/**
 * Get all unique labels from cards
 */
export const getAvailableLabels = (cards: Card[], boardLabels: Label[]): Label[] => {
  const labelIds = cards.flatMap(card => card.labelIds);
  const uniqueLabelIds = [...new Set(labelIds)];
  return boardLabels.filter(label => uniqueLabelIds.includes(label.id));
};

/**
 * Check if any filters are active
 */
export const hasActiveFilters = (options: FilterOptions): boolean => {
  return !!(
    options.searchTerm ||
    options.selectedLabels.length > 0 ||
    options.selectedMembers.length > 0 ||
    options.showCompleted !== 'all' ||
    options.priorityThreshold !== null ||
    options.dueDateFilter !== 'all'
  );
};

/**
 * Get filter summary text
 */
export const getFilterSummary = (
  cards: Card[],
  options: FilterOptions,
  boardLabels: Label[] = []
): string => {
  const filteredCount = filterCards(cards, options, boardLabels).length;
  const totalCount = cards.length;

  if (!hasActiveFilters(options)) {
    return `${totalCount} cards`;
  }

  return `${filteredCount} of ${totalCount} cards`;
};
