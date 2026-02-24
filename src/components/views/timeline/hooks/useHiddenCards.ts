import { useMemo } from 'react';
import { addDays } from 'date-fns';

/**
 * useHiddenCards hook - Calculates which cards are hidden outside the current date range
 * Separates cards into those before and after the visible timeline range
 * Optimized with useMemo to prevent unnecessary recalculations
 * 
 * @param listCards - Array of cards to filter
 * @param dateRange - Current visible date range
 * @returns Object with arrays of hidden cards before and after the range
 */
export function useHiddenCards(listCards: any[], dateRange: Date[]) {
  return useMemo(() => {
    // Early return if no date range is provided
    if (dateRange.length === 0) {
      return { hiddenCardsBefore: [], hiddenCardsAfter: [] };
    }

    // Get the start and end of the visible date range
    const rangeStart = dateRange[0];
    const rangeEnd = dateRange[dateRange.length - 1];

    // Filter cards that end before the visible range starts
    const hiddenCardsBefore = listCards.filter(card => {
      // Use due date if available, otherwise use start date + 7 days as fallback
      const cardEnd = card.dueDate || addDays(card.startDate || new Date(), 7);
      return cardEnd < rangeStart;
    });

    // Filter cards that start after the visible range ends
    const hiddenCardsAfter = listCards.filter(card => {
      // Use start date if available, otherwise use current date as fallback
      const cardStart = card.startDate || new Date();
      return cardStart > rangeEnd;
    });

    return { hiddenCardsBefore, hiddenCardsAfter };
  }, [listCards, dateRange]);
}
