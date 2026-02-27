import { filterCards as filterCardsEnhanced, getFilteredCardCount as getFilteredCardCountEnhanced, FilterOptions } from '@/lib/filterUtils';

/**
 * @deprecated Use filterCards from @/lib/filterUtils instead
 * Filter cards based on search term
 * Searches in card titles and descriptions
 * @param cards - Array of cards to filter
 * @param searchTerm - Search term to filter by
 * @returns Filtered array of cards
 */
export const filterCards = (cards: any[], searchTerm: string = '') => {
  const options: FilterOptions = {
    searchTerm,
    selectedLabels: [],
    selectedMembers: [],
    showCompleted: 'all',
    priorityThreshold: 0,
    dueDateFilter: 'all'
  };
  return filterCardsEnhanced(cards, options);
};

/**
 * @deprecated Use getFilteredCardCount from @/lib/filterUtils instead
 * Get card count for a list after filtering
 * @param list - List object containing cards
 * @param searchTerm - Search term to filter by
 * @returns Filtered card count
 */
export const getFilteredCardCount = (list: any, searchTerm: string = '') => {
  const options: FilterOptions = {
    searchTerm,
    selectedLabels: [],
    selectedMembers: [],
    showCompleted: 'all',
    priorityThreshold: 0,
    dueDateFilter: 'all'
  };
  return getFilteredCardCountEnhanced(list.cards, options);
};
