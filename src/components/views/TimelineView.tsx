/*
 * Zoom Level Selection Rationale:
 * 
 * Previous zoom levels (Day, Week, Month, Quarter, Year) had awkward jumps
 * and Quarter was rarely useful for day-to-day project management.
 * 
 * New zoom levels provide better granularity progression:
 * - Day: Detailed hourly view for daily planning
 * - Week: 7-day view for weekly sprints and planning
 * - 2 Weeks: Bi-weekly view for two-week sprints (common in agile)
 * - Month: Monthly view for milestone tracking
 * - Year: High-level yearly roadmap with quarter markers
 * 
 * This progression offers more useful intermediate steps while maintaining
 * the same overall range from detailed daily work to strategic yearly planning.
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear, isSameDay, isSameWeek, isSameMonth, isWithinInterval, addDays, addWeeks, addMonths, addYears, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useBoardStore, useUIStore } from '@/store';
import { cn, formatDate } from '@/lib/utils';
import { Calendar, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { TimelineHeader } from './timeline/components/TimelineHeader';
import { TimelineGrid } from './timeline/components/TimelineGrid';
import { TimelineCard } from './timeline/components/TimelineCard';
import { HiddenCardsIndicator } from './timeline/components/HiddenCardsIndicator';

interface TimelineViewProps {
  boardId: string;
}

// Helper function to calculate timeline height based on card stacking
const calculateTimelineHeight = (cards: any[], dateRange: Date[]) => {
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

export function TimelineView({ boardId }: TimelineViewProps) {
  const { boards } = useBoardStore();
  const { searchTerm, openCardModal } = useUIStore();

  const board = boards.find((b) => b.id === boardId);
  if (!board) return null;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState<'day' | 'week' | '2weeks' | 'month' | 'year'>('week');

  // Generate date range based on zoom level and current date
  const dateRange = useMemo(() => {
    let dates: Date[] = [];

    switch (zoomLevel) {
      case 'day':
        dates = eachDayOfInterval({
          start: startOfDay(currentDate),
          end: endOfDay(currentDate)
        });
        break;
      case 'week':
        // For week view, show the 7 days of the week starting Monday
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1 = Monday
        for (let i = 0; i < 7; i++) {
          dates.push(addDays(weekStart, i));
        }
        break;
      case 'month':
        // For month view, show all individual days in the month
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        let currentDay = monthStart;
        while (currentDay <= monthEnd) {
          dates.push(currentDay);
          currentDay = addDays(currentDay, 1);
        }
        break;
      case '2weeks':
        // For 2 weeks view, show 14 days side by side
        const twoWeeksStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1 = Monday
        for (let i = 0; i < 14; i++) {
          dates.push(addDays(twoWeeksStart, i));
        }
        break;
      case 'year':
        // For year view, show all 12 months
        for (let i = 0; i < 12; i++) {
          dates.push(new Date(currentDate.getFullYear(), i, 1));
        }
        break;
      default:
        // Default to month view
        const defaultMonthStart = startOfMonth(currentDate);
        const defaultMonthEnd = endOfMonth(currentDate);
        let defaultWeek = startOfWeek(defaultMonthStart);
        while (defaultWeek <= defaultMonthEnd) {
          dates.push(defaultWeek);
          defaultWeek = addWeeks(defaultWeek, 1);
        }
    }

    return dates;
  }, [currentDate, zoomLevel]);

  // Filter cards that have dates
  const cardsWithDates = useMemo(() => {
    const allCards = board.lists.flatMap(list => list.cards);
    const filtered = searchTerm
      ? allCards.filter(card =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : allCards;

    // Show all cards with dates (revert to original behavior)
    return filtered.filter(card => card.startDate || card.dueDate);
  }, [board.lists, searchTerm]);

  // Calculate card position and width on timeline
  const getCardPosition = (card: any, allCards: any[], cardIndex: number) => {
    const cardStartDate = card.startDate || new Date();
    const cardEndDate = card.dueDate || addDays(cardStartDate, 7);

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

    // Handle cards outside the visible range for all zoom levels
    const rangeStart = dateRange[0];
    const rangeEnd = dateRange[dateRange.length - 1];

    let left = 0;
    let width = 5;

    // Special handling for day view - cards should stack vertically, not overlap horizontally
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
      // Logic for all views: past cards on left edge, future cards on right edge
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

    // Calculate vertical stacking position using the same logic as height calculation
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
            const start1 = currentCardStartIdx;
            const end1 = currentCardEndIdx;
            const start2 = existingCardStartIdx;
            const end2 = existingCardEndIdx;

            // Only check for overlap if both cards have valid indices within the visible range
            // Cards with -1 indices are outside the visible range and shouldn't overlap with each other
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

    const top = 8 + (stackLevel * (cardHeight + cardGap)); // Start 8px from top, add card height + gap for each level

    return {
      left: `${left}%`,
      width: `${Math.max(width, 2)}%`,
      top: `${top}px`
    };
  };

  const getCardColor = (card: any) => {
    if (card.labels.length > 0) {
      return card.labels[0].color.replace('bg-', '').replace('-500', '');
    }
    return 'slate';
  };

  // Add keyboard shortcuts for zoom levels
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle number keys when not typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case '1':
          setZoomLevel('day');
          break;
        case '2':
          setZoomLevel('week');
          break;
        case '3':
          setZoomLevel('2weeks');
          break;
        case '4':
          setZoomLevel('month');
          break;
        case '5':
          setZoomLevel('year');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);


  const getZoomLabel = () => {
    switch (zoomLevel) {
      case 'day': return 'Day';
      case 'week': return 'Week';
      case '2weeks': return '2 Weeks';
      case 'month': return 'Month';
      case 'year': return 'Year';
      default: return 'Week';
    }
  };

  const getDateLabel = (date: Date) => {
    switch (zoomLevel) {
      case 'day':
        return format(date, 'MMM d, yyyy');
      case 'week':
        return format(date, 'EEE d'); // Shows day name and date
      case '2weeks':
        return format(date, 'EEE d'); // Shows day name and date
      case 'month':
        return format(date, 'MMM d');
      case 'year':
        return format(date, 'MMM');
      default:
        return format(date, 'MMM d');
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header with zoom controls */}
      <TimelineHeader
        currentDate={currentDate}
        zoomLevel={zoomLevel}
        onDateChange={setCurrentDate}
        onZoomChange={setZoomLevel}
      />

      {/* Timeline */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-auto p-4 absolute inset-0">
          <div className="min-w-[1200px]">
            {/* Date headers and grid lines */}
            <TimelineGrid dateRange={dateRange} zoomLevel={zoomLevel} />

            {/* Lists and cards */}
            <div className="relative">
              {board.lists.map((list, listIndex) => {
                const listCards = cardsWithDates.filter(card => card.listId === list.id);

                if (listCards.length === 0) {
                  return null;
                }

                // Calculate hidden cards for this specific list and determine position
                const rangeStart = dateRange[0];
                const rangeEnd = dateRange[dateRange.length - 1];
                const hiddenCardsBefore = listCards.filter(card => {
                  const cardEnd = card.dueDate || addDays(card.startDate || new Date(), 7);
                  return cardEnd < rangeStart;
                });
                const hiddenCardsAfter = listCards.filter(card => {
                  const cardStart = card.startDate || new Date();
                  return cardStart > rangeEnd;
                });

                return (
                  <div key={list.id} className="flex border-b border-slate-100 dark:border-slate-800">
                    {/* List name */}
                    <div className="w-48 flex-shrink-0 p-3">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">
                        {list.title}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {listCards.length} cards
                      </div>
                    </div>

                    {/* Timeline area */}
                    <div
                      className="flex-1 relative"
                      style={{
                        minHeight: `${calculateTimelineHeight(listCards, dateRange)}px`
                      }}
                    >
                      {/* Hidden cards indicator for this swimlane */}
                      <HiddenCardsIndicator
                        listId={list.id}
                        hiddenCardsBefore={hiddenCardsBefore}
                        hiddenCardsAfter={hiddenCardsAfter}
                        onOpenCardModal={openCardModal}
                      />

                      {/* Cards */}
                      {listCards.map((card, cardIndex) => (
                        <TimelineCard
                          key={card.id}
                          card={card}
                          allCards={listCards}
                          cardIndex={cardIndex}
                          dateRange={dateRange}
                          zoomLevel={zoomLevel}
                          onOpenCardModal={openCardModal}
                          getCardPosition={getCardPosition}
                          getCardColor={getCardColor}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty state */}
            {cardsWithDates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-lg font-medium text-slate-600 dark:text-slate-400">
                  No cards with dates found
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-500">
                  Add start or due dates to cards to see them in the timeline
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}
