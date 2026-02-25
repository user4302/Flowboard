import { useMemo } from 'react';
import { isSameDay, isSameWeek, isSameMonth, addDays } from 'date-fns';

/**
 * Timeline zoom level type
 * Defines the different zoom levels available for timeline view
 */
type ZoomLevel = 'day' | 'week' | '2weeks' | 'month' | 'year';

/**
 * Card position interface
 * Defines the position and dimensions of a card in the timeline
 */
interface CardPosition {
  // Horizontal position as percentage
  left: number;
  // Width as percentage
  width: number;
  // Vertical position in pixels
  top: number;
}

/**
 * usePositioning hook - Calculates card positioning in timeline view
 * Handles horizontal positioning, width calculation, and vertical stacking
 * Prevents card overlaps and manages cards outside visible range
 * 
 * @param card - Card to position
 * @param allCards - All cards in the list for overlap detection
 * @param cardIndex - Index of the current card
 * @param dateRange - Current visible date range
 * @param zoomLevel - Current zoom level
 * @returns Card position with left, width, and top values
 */
export function usePositioning(
  card: any,
  allCards: any[],
  cardIndex: number,
  dateRange: Date[],
  zoomLevel: ZoomLevel
): CardPosition {
  return useMemo(() => {
    // Get card start and end dates with fallbacks
    const cardStartDate = card.startDate || new Date();
    const cardEndDate = card.dueDate || addDays(cardStartDate, 7);

    // Find indices in date range for positioning
    let startIndex = -1;
    let endIndex = -1;

    // Find start and end indices based on zoom level
    switch (zoomLevel) {
      case 'day':
        startIndex = dateRange.findIndex(date => isSameDay(date, cardStartDate));
        endIndex = dateRange.findIndex(date => isSameDay(date, cardEndDate));
        break;
      case 'week':
        startIndex = dateRange.findIndex(date => isSameDay(date, cardStartDate));
        endIndex = dateRange.findIndex(date => isSameDay(date, cardEndDate));
        break;
      case 'month':
        startIndex = dateRange.findIndex(date => isSameWeek(date, cardStartDate));
        endIndex = dateRange.findIndex(date => isSameWeek(date, cardEndDate));
        break;
      case '2weeks':
        startIndex = dateRange.findIndex(date => isSameDay(date, cardStartDate));
        endIndex = dateRange.findIndex(date => isSameDay(date, cardEndDate));
        break;
      case 'year':
        startIndex = dateRange.findIndex(date => isSameMonth(date, cardStartDate));
        endIndex = dateRange.findIndex(date => isSameMonth(date, cardEndDate));
        break;
    }

    /**
     * Handle cards outside the visible range for all zoom levels
     */
    const rangeStart = dateRange[0];
    const rangeEnd = dateRange[dateRange.length - 1];

    /**
     * Initialize positioning values
     */
    let left = 0;
    let width = 5;
    let top = 0;

    /**
     * Special handling for day view - cards should stack vertically, not overlap horizontally
     */
    if (zoomLevel === 'day') {
      const today = dateRange[0]; // In day view, dateRange[0] is always the current day
      // For day view, all cards that include today should be positioned at the same horizontal position
      // but stacked vertically using the stacking logic below
      if (today >= cardStartDate && today <= cardEndDate) {
        // Cards that include today get full width and normal positioning
        left = 0;
        width = 100;
      } else if (cardEndDate < rangeStart) {
        // Cards entirely before today go on left edge as small indicators
        left = 0;
        width = 5;
      } else if (cardStartDate > rangeEnd) {
        // Cards entirely after today go on right edge as small indicators
        left = 95;
        width = 5;
      } else {
        // Fallback - small indicator
        left = 0;
        width = 5;
      }
    } else {
      /**
       * Logic for all other views: past cards on left edge, future cards on right edge
       */
      // If card is entirely before the visible range (in the past), collect on left edge
      if (cardEndDate < rangeStart) {
        left = 0; // Left edge
        width = 5;
      }
      // If card is entirely after the visible range (in the future), collect on right edge
      else if (cardStartDate > rangeEnd) {
        left = ((dateRange.length - 1) / dateRange.length) * 100; // Right edge
        width = 5;
      }
      // If card starts before but ends within range, start at left edge and span to end position
      else if (cardStartDate < rangeStart && endIndex >= 0) {
        left = 0; // Left edge
        width = ((endIndex + 1) / dateRange.length) * 100; // Span from start to end position
      }
      // If card starts within range but ends after, start at start position and span to right edge
      else if (cardEndDate > rangeEnd && startIndex >= 0) {
        left = (startIndex / dateRange.length) * 100; // Normal positioning
        width = ((dateRange.length - startIndex) / dateRange.length) * 100; // Span to right edge
      }
      // If card spans the entire visible range (starts before, ends after)
      else if (cardStartDate < rangeStart && cardEndDate > rangeEnd) {
        left = 0; // Left edge
        width = 100; // Full width
      } else {
        // Normal positioning for cards within range
        left = (startIndex / dateRange.length) * 100;
        width = ((endIndex - startIndex + 1) / dateRange.length) * 100;
      }
    }

    /**
     * Calculate vertical stacking position to prevent card overlaps
     */
    let stackLevel = 0;
    const cardHeight = 32; // h-8 = 32px
    const cardGap = 4; // gap between stacked cards
    const cardPositions: { [key: string]: number } = {}; // To store the assigned stack level for each card

    /**
     * Calculate stack level for the current card by checking overlaps with previous cards
     */
    allCards.slice(0, cardIndex + 1).forEach((currentCard, currentIndex) => {
      const currentCardStartDate = currentCard.startDate || new Date();
      const currentCardEndDate = currentCard.dueDate || addDays(currentCardStartDate, 7);

      let currentStackLevel = 0;
      let positionFound = false;

      /**
       * Try to find an available stack level that doesn't overlap
       */
      while (!positionFound) {
        let overlap = false;
        for (const existingCardId in cardPositions) {
          const existingCard = allCards.find(c => c.id === existingCardId);
          if (!existingCard) continue;

          const existingCardStartDate = existingCard.startDate || new Date();
          const existingCardEndDate = existingCard.dueDate || addDays(existingCardStartDate, 7);

          /**
           * Check for overlap in the current stack level
           */
          if (cardPositions[existingCardId] === currentStackLevel) {
            /**
             * Check if the date ranges actually overlap within the timeline's dateRange
             */
            let currentCardStartIdx = -1;
            let currentCardEndIdx = -1;
            let existingCardStartIdx = -1;
            let existingCardEndIdx = -1;

            /**
             * Find indices based on zoom level
             */
            switch (zoomLevel) {
              case 'day':
                currentCardStartIdx = dateRange.findIndex(date => isSameDay(date, currentCardStartDate));
                currentCardEndIdx = dateRange.findIndex(date => isSameDay(date, currentCardEndDate));
                existingCardStartIdx = dateRange.findIndex(date => isSameDay(date, existingCardStartDate));
                existingCardEndIdx = dateRange.findIndex(date => isSameDay(date, existingCardEndDate));
                break;
              case 'week':
                currentCardStartIdx = dateRange.findIndex(date => isSameDay(date, currentCardStartDate));
                currentCardEndIdx = dateRange.findIndex(date => isSameDay(date, currentCardEndDate));
                existingCardStartIdx = dateRange.findIndex(date => isSameDay(date, existingCardStartDate));
                existingCardEndIdx = dateRange.findIndex(date => isSameDay(date, existingCardEndDate));
                break;
              case 'month':
                currentCardStartIdx = dateRange.findIndex(date => isSameWeek(date, currentCardStartDate));
                currentCardEndIdx = dateRange.findIndex(date => isSameWeek(date, currentCardEndDate));
                existingCardStartIdx = dateRange.findIndex(date => isSameWeek(date, existingCardStartDate));
                existingCardEndIdx = dateRange.findIndex(date => isSameWeek(date, existingCardEndDate));
                break;
              case '2weeks':
                currentCardStartIdx = dateRange.findIndex(date => isSameDay(date, currentCardStartDate));
                currentCardEndIdx = dateRange.findIndex(date => isSameDay(date, currentCardEndDate));
                existingCardStartIdx = dateRange.findIndex(date => isSameDay(date, existingCardStartDate));
                existingCardEndIdx = dateRange.findIndex(date => isSameDay(date, existingCardEndDate));
                break;
              case 'year':
                currentCardStartIdx = dateRange.findIndex(date => isSameMonth(date, currentCardStartDate));
                currentCardEndIdx = dateRange.findIndex(date => isSameMonth(date, currentCardEndDate));
                existingCardStartIdx = dateRange.findIndex(date => isSameMonth(date, existingCardStartDate));
                existingCardEndIdx = dateRange.findIndex(date => isSameMonth(date, existingCardEndDate));
                break;
            }

            /**
             * Handle out-of-range indices - cards completely outside range should not overlap with each other
             */
            const start1 = currentCardStartIdx;
            const end1 = currentCardEndIdx;
            const start2 = existingCardStartIdx;
            const end2 = existingCardEndIdx;

            /**
             * Only check for overlap if both cards have valid indices within the visible range
             * Cards with -1 indices are outside the visible range and shouldn't overlap with each other
             */
            let shouldCheckOverlap = true;
            if (start1 < 0 || end1 < 0 || start2 < 0 || end2 < 0) {
              // At least one card is outside visible range - don't check overlap
              shouldCheckOverlap = false;
            }

            if (shouldCheckOverlap) {
              const start = Math.max(start1, start2);
              const end = Math.min(end1, end2);

              if (start <= end) {
                overlap = true;
                break;
              }
            }
          }
        }

        if (!overlap) {
          cardPositions[currentCard.id] = currentStackLevel;
          if (currentCard.id === card.id) {
            stackLevel = currentStackLevel;
          }
          positionFound = true;
        } else {
          currentStackLevel++;
        }
      }
    });

    /**
     * Calculate the final vertical position based on stack level
     */
    top = stackLevel * (cardHeight + cardGap);

    return { left, width, top };
  }, [card, allCards, cardIndex, dateRange, zoomLevel]);
}
