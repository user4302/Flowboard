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
      return { hiddenTasksBefore: [], hiddenTasksAfter: [] };
    }

    // Get the start and end of the visible date range
    const rangeStart = dateRange[0];
    const rangeEnd = dateRange[dateRange.length - 1];

    // Filter cards that end before the visible range starts
    const hiddenTasksBefore = listCards.filter(card => {
      // Dates are already Date objects from localStorage conversion
      const cardStartDate = card.startDate || new Date();
      const cardEndDate = card.dueDate || addDays(cardStartDate, 7);

      // Validate dates
      if (isNaN(cardStartDate.getTime()) || isNaN(cardEndDate.getTime())) {
        return false; // Skip cards with invalid dates
      }

      return cardEndDate < rangeStart;
    });

    // Filter cards that start after the visible range ends
    const hiddenTasksAfter = listCards.filter(card => {
      // Dates are already Date objects from localStorage conversion
      const cardStart = card.startDate || new Date();

      // Validate dates
      if (isNaN(cardStart.getTime())) {
        return false; // Skip cards with invalid dates
      }

      return cardStart > rangeEnd;
    });

    return { hiddenTasksBefore, hiddenTasksAfter };
  }, [listCards, dateRange]);
}
