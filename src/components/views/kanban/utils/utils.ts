/**
 * Filter cards based on search term
 * Searches in card titles and descriptions
 * @param cards - Array of cards to filter
 * @param searchTerm - Search term to filter by
 * @returns Filtered array of cards
 */
export const filterCards = (cards: any[], searchTerm: string = '') => {
  if (!searchTerm) return cards;
  return cards.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

/**
 * Get card count for a list after filtering
 * @param list - List object containing cards
 * @param searchTerm - Search term to filter by
 * @returns Filtered card count
 */
export const getFilteredCardCount = (list: any, searchTerm: string = '') => {
  return filterCards(list.cards, searchTerm).length;
};
