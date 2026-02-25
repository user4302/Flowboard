import { isSameDay, isSameWeek, isSameMonth, addDays } from 'date-fns';
import { normalizeForDisplay } from '@/lib/dateUtils';

// Helper function to calculate timeline height based on card stacking
export const calculateTimelineHeight = (cards: any[], dateRange: Date[]) => {
  if (cards.length === 0) return 60;

  const cardHeight = 32; // h-8 = 32px
  const cardGap = 4; // gap between stacked cards
  const padding = 16; // 8px top + 8px bottom

  let maxStackLevel = 0;
  const cardPositions: { [key: string]: number } = {}; // To store the assigned stack level for each card

  cards.forEach((card) => {
    const cardStartDate = card.startDate || new Date();
    const cardEndDate = card.dueDate || addDays(cardStartDate, 7);

    let stackLevel = 0;
    let positionFound = false;

    // Try to find an available stack level
    while (!positionFound) {
      let overlap = false;
      for (const existingCardId in cardPositions) {
        const existingCard = cards.find(c => c.id === existingCardId);
        if (!existingCard) continue;

        const existingCardStartDate = existingCard.startDate || new Date();
        const existingCardEndDate = existingCard.dueDate || addDays(existingCardStartDate, 7);

        // Check for overlap in the current stack level
        if (cardPositions[existingCardId] === stackLevel) {
          // Check if the date ranges actually overlap within the timeline's dateRange
          const cardStartIdx = dateRange.findIndex(date => isSameDay(date, cardStartDate));
          const cardEndIdx = dateRange.findIndex(date => isSameDay(date, cardEndDate));
          const existingCardStartIdx = dateRange.findIndex(date => isSameDay(date, existingCardStartDate));
          const existingCardEndIdx = dateRange.findIndex(date => isSameDay(date, existingCardEndDate));

          const start = Math.max(cardStartIdx, existingCardStartIdx);
          const end = Math.min(cardEndIdx, existingCardEndIdx);

          if (start <= end) {
            overlap = true;
            break;
          }
        }
      }

      if (!overlap) {
        cardPositions[card.id] = stackLevel;
        positionFound = true;
      } else {
        stackLevel++;
      }
    }

    maxStackLevel = Math.max(maxStackLevel, stackLevel);
  });

  return padding + ((maxStackLevel + 1) * (cardHeight + cardGap));
};

// Helper function to find date indices for day view
const findDayIndices = (dateRange: Date[], cardStartDate: Date, cardEndDate: Date) => {
  const startIndex = dateRange.findIndex(date => isSameDay(date, cardStartDate));
  const endIndex = dateRange.findIndex(date => isSameDay(date, cardEndDate));
  return { startIndex, endIndex };
};

// Helper function to find date indices for week view
const findWeekIndices = (dateRange: Date[], cardStartDate: Date, cardEndDate: Date) => {
  const startIndex = dateRange.findIndex(date => isSameDay(date, cardStartDate));
  const endIndex = dateRange.findIndex(date => isSameDay(date, cardEndDate));
  return { startIndex, endIndex };
};

// Helper function to find date indices for 2-week view
const findTwoWeekIndices = (dateRange: Date[], cardStartDate: Date, cardEndDate: Date) => {
  const startIndex = dateRange.findIndex(date => isSameDay(date, cardStartDate));
  const endIndex = dateRange.findIndex(date => isSameDay(date, cardEndDate));
  return { startIndex, endIndex };
};

// Helper function to find date indices for month view
const findMonthIndices = (dateRange: Date[], cardStartDate: Date, cardEndDate: Date) => {
  const startIndex = dateRange.findIndex(date => isSameWeek(date, cardStartDate));
  const endIndex = dateRange.findIndex(date => isSameWeek(date, cardEndDate));
  return { startIndex, endIndex };
};

// Helper function to find date indices for year view
const findYearIndices = (dateRange: Date[], cardStartDate: Date, cardEndDate: Date) => {
  const startIndex = dateRange.findIndex(date => isSameMonth(date, cardStartDate));
  const endIndex = dateRange.findIndex(date => isSameMonth(date, cardEndDate));
  return { startIndex, endIndex };
};

// Helper function to calculate horizontal position and width
const calculateHorizontalPosition = (
  cardStartDate: Date,
  cardEndDate: Date,
  dateRange: Date[],
  startIndex: number,
  endIndex: number,
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year'
) => {
  const rangeStart = dateRange[0];
  const rangeEnd = dateRange[dateRange.length - 1];

  let left = 0;
  let width = 5;

  // Special handling for day view - cards should stack vertically, not overlap horizontally
  if (zoomLevel === 'day') {
    left = 0;
    width = 100;
  } else {
    // Logic for all views: past cards on left edge, future cards on right edge

    // If card is entirely after the visible range (in the future), collect on right edge
    if (cardEndDate > rangeEnd && startIndex >= 0) {
      left = (startIndex / dateRange.length) * 100; // Normal positioning
      // If endIndex is -1 (not found), calculate width based on days from start to range end
      let daysSpanned;
      if (endIndex === -1) {
        // Card ends beyond visible range, span to end of range
        daysSpanned = dateRange.length - startIndex;
      } else {
        daysSpanned = endIndex - startIndex + 1;
      }
      left = (startIndex / dateRange.length) * 100;
      width = (daysSpanned / dateRange.length) * 100;
    }
    // If card is entirely after the visible range (in the future), collect on right edge
    else if (cardStartDate > rangeEnd) {
      left = ((dateRange.length - 1) / dateRange.length) * 100; // Right edge
      width = 5;
    }
    // If card is entirely before the visible range (in the past), collect on left edge
    else if (cardEndDate < rangeStart) {
      left = 0; // Left edge
      width = 5;
    }
    // If card starts before but ends within range, start at left edge and span to end position
    else if (cardStartDate < rangeStart && endIndex >= 0) {
      left = 0; // Left edge
      // Calculate width based on actual card duration, not just visible portion
      const cardDuration = Math.ceil((cardEndDate.getTime() - cardStartDate.getTime()) / (1000 * 60 * 60 * 24));
      const dayWidth = 100 / dateRange.length; // Width of one day in percentage
      width = Math.min(cardDuration * dayWidth, ((endIndex + 1) / dateRange.length) * 100);
    }
    // If card starts within range but ends after, start at start position and span to right edge
    else if (cardEndDate > rangeEnd && startIndex >= 0) {
      left = (startIndex / dateRange.length) * 100; // Normal positioning
      // If endIndex is -1 (not found), calculate width based on days from start to range end
      if (endIndex === -1) {
        // Card ends beyond visible range, span to end of range
        const daysSpanned = dateRange.length - startIndex;
        left = (startIndex / dateRange.length) * 100;
        width = (daysSpanned / dateRange.length) * 100;
      } else {
        const daysSpanned = endIndex - startIndex + 1;
        left = (startIndex / dateRange.length) * 100;
        width = (daysSpanned / dateRange.length) * 100;
      }
    }
    // If card spans the entire visible range (starts before, ends after)
    else if (cardStartDate < rangeStart && cardEndDate > rangeEnd) {
      left = 0; // Left edge
      width = 100; // Full width
    } else {
      // Normal positioning for cards within range
      let daysSpanned;
      if (endIndex === -1) {
        // Card ends beyond visible range, span to end of range
        daysSpanned = dateRange.length - startIndex;
      } else {
        daysSpanned = endIndex - startIndex + 1;
      }

      left = (startIndex / dateRange.length) * 100;
      width = (daysSpanned / dateRange.length) * 100;
    }
  }

  return { left, width };
};

// Helper function to calculate vertical stacking position
const calculateVerticalPosition = (
  card: any,
  allCards: any[],
  cardIndex: number,
  dateRange: Date[],
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year'
) => {
  let stackLevel = 0;
  const cardHeight = 32; // h-8 = 32px
  const cardGap = 4; // gap between stacked cards
  const cardPositions: { [key: string]: number } = {}; // To store the assigned stack level for each card

  // Calculate stack level for the current card
  allCards.slice(0, cardIndex + 1).forEach((currentCard, currentIndex) => {
    const currentCardStartDate = currentCard.startDate || new Date();
    const currentCardEndDate = currentCard.dueDate || addDays(currentCardStartDate, 7);

    let currentStackLevel = 0;
    let positionFound = false;

    // Try to find an available stack level
    while (!positionFound) {
      let overlap = false;
      for (const existingCardId in cardPositions) {
        const existingCard = allCards.find(c => c.id === existingCardId);
        if (!existingCard) continue;

        const existingCardStartDate = existingCard.startDate || new Date();
        const existingCardEndDate = existingCard.dueDate || addDays(existingCardStartDate, 7);

        // Check for overlap in the current stack level
        if (cardPositions[existingCardId] === currentStackLevel) {
          // Check if the date ranges actually overlap within the timeline's dateRange
          let currentCardStartIdx = -1;
          let currentCardEndIdx = -1;
          let existingCardStartIdx = -1;
          let existingCardEndIdx = -1;

          // Find indices based on zoom level
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

          // Handle out-of-range indices - cards completely outside range should not overlap
          if (currentCardStartIdx === -1 || currentCardEndIdx === -1 || existingCardStartIdx === -1 || existingCardEndIdx === -1) {
            continue;
          }

          const start = Math.max(currentCardStartIdx, existingCardStartIdx);
          const end = Math.min(currentCardEndIdx, existingCardEndIdx);

          if (start <= end) {
            overlap = true;
            break;
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

  const top = 8 + (stackLevel * (cardHeight + cardGap)); // Start 8px from top, add card height + gap for each level
  return top;
};

// Calculate day view task positioning
const calculateDayPosition = (
  card: any,
  allCards: any[],
  cardIndex: number,
  dateRange: Date[],
  cardStartDate: Date,
  cardEndDate: Date
) => {
  const { startIndex, endIndex } = findDayIndices(dateRange, cardStartDate, cardEndDate);
  const { left, width } = calculateHorizontalPosition(cardStartDate, cardEndDate, dateRange, startIndex, endIndex, 'day');
  const top = calculateVerticalPosition(card, allCards, cardIndex, dateRange, 'day');

  return {
    left: `${left}%`,
    width: `${Math.max(width, 2)}%`,
    top: `${top}px`
  };
};

// Calculate week view task positioning
const calculateWeekPosition = (
  card: any,
  allCards: any[],
  cardIndex: number,
  dateRange: Date[],
  cardStartDate: Date,
  cardEndDate: Date
) => {
  const { startIndex, endIndex } = findWeekIndices(dateRange, cardStartDate, cardEndDate);
  const { left, width } = calculateHorizontalPosition(cardStartDate, cardEndDate, dateRange, startIndex, endIndex, 'week');
  const top = calculateVerticalPosition(card, allCards, cardIndex, dateRange, 'week');

  return {
    left: `${left}%`,
    width: `${Math.max(width, 2)}%`,
    top: `${top}px`
  };
};

// Calculate 2-week view task positioning
const calculateTwoWeekPosition = (
  card: any,
  allCards: any[],
  cardIndex: number,
  dateRange: Date[],
  cardStartDate: Date,
  cardEndDate: Date
) => {
  const { startIndex, endIndex } = findTwoWeekIndices(dateRange, cardStartDate, cardEndDate);
  const { left, width } = calculateHorizontalPosition(cardStartDate, cardEndDate, dateRange, startIndex, endIndex, '2weeks');
  const top = calculateVerticalPosition(card, allCards, cardIndex, dateRange, '2weeks');

  return {
    left: `${left}%`,
    width: `${Math.max(width, 2)}%`,
    top: `${top}px`
  };
};

// Calculate month view task positioning
const calculateMonthPosition = (
  card: any,
  allCards: any[],
  cardIndex: number,
  dateRange: Date[],
  cardStartDate: Date,
  cardEndDate: Date
) => {
  const { startIndex, endIndex } = findMonthIndices(dateRange, cardStartDate, cardEndDate);
  const { left, width } = calculateHorizontalPosition(cardStartDate, cardEndDate, dateRange, startIndex, endIndex, 'month');
  const top = calculateVerticalPosition(card, allCards, cardIndex, dateRange, 'month');

  return {
    left: `${left}%`,
    width: `${Math.max(width, 2)}%`,
    top: `${top}px`
  };
};

// Calculate year view task positioning
const calculateYearPosition = (
  card: any,
  allCards: any[],
  cardIndex: number,
  dateRange: Date[],
  cardStartDate: Date,
  cardEndDate: Date
) => {
  const { startIndex, endIndex } = findYearIndices(dateRange, cardStartDate, cardEndDate);
  const { left, width } = calculateHorizontalPosition(cardStartDate, cardEndDate, dateRange, startIndex, endIndex, 'year');
  const top = calculateVerticalPosition(card, allCards, cardIndex, dateRange, 'year');

  return {
    left: `${left}%`,
    width: `${Math.max(width, 2)}%`,
    top: `${top}px`
  };
};

// Calculate card position and width on timeline
export const getTaskPosition = (card: any, allCards: any[], cardIndex: number, dateRange: Date[], zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year') => {
  // Use normalizeForDisplay to ensure dates are properly handled
  const cardStartDate = normalizeForDisplay(card.startDate) || new Date();
  const cardEndDate = normalizeForDisplay(card.dueDate) || addDays(cardStartDate, 7);

  // Validate dates - be more permissive
  if (isNaN(cardStartDate.getTime())) {
    console.warn('Invalid card start date detected, using fallback:', card.startDate);
    return { left: '0%', width: '100%', top: '8px' }; // Fallback position
  }

  if (isNaN(cardEndDate.getTime())) {
    console.warn('Invalid card end date detected, using fallback:', card.dueDate);
    return { left: '0%', width: '100%', top: '8px' }; // Fallback position
  }

  // Delegate to the appropriate handler based on zoom level
  switch (zoomLevel) {
    case 'day':
      return calculateDayPosition(card, allCards, cardIndex, dateRange, cardStartDate, cardEndDate);
    case 'week':
      return calculateWeekPosition(card, allCards, cardIndex, dateRange, cardStartDate, cardEndDate);
    case '2weeks':
      return calculateTwoWeekPosition(card, allCards, cardIndex, dateRange, cardStartDate, cardEndDate);
    case 'month':
      return calculateMonthPosition(card, allCards, cardIndex, dateRange, cardStartDate, cardEndDate);
    case 'year':
      return calculateYearPosition(card, allCards, cardIndex, dateRange, cardStartDate, cardEndDate);
    default:
      // Fallback to day view if zoom level is unrecognized
      return calculateDayPosition(card, allCards, cardIndex, dateRange, cardStartDate, cardEndDate);
  }
};

// Get card color based on labels
export const getTaskColor = (card: any) => {
  if (card.labels.length > 0) {
    return card.labels[0].color.replace('bg-', '').replace('-500', '');
  }
  return 'slate';
};
