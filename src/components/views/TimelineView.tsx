'use client';

import { useState, useMemo } from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear, isSameDay, isWithinInterval, addDays, addWeeks, addMonths, addYears, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useBoardStore, useUIStore } from '@/store';
import { cn } from '@/lib/utils';
import { Calendar, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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
  const [zoomLevel, setZoomLevel] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');

  // Generate date range based on zoom level and current date
  const dateRange = useMemo(() => {
    let start: Date;
    let end: Date;

    switch (zoomLevel) {
      case 'day':
        start = startOfDay(currentDate);
        end = endOfDay(currentDate);
        break;
      case 'week':
        start = startOfWeek(currentDate);
        end = endOfWeek(currentDate);
        break;
      case 'month':
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
        break;
      case 'quarter':
        start = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3, 1);
        end = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3 + 3, 0);
        break;
      case 'year':
        start = startOfYear(currentDate);
        end = endOfYear(currentDate);
        break;
      default:
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
    }

    return eachDayOfInterval({ start, end });
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

    let startIndex = dateRange.findIndex(date => isSameDay(date, cardStartDate));
    let endIndex = dateRange.findIndex(date => isSameDay(date, cardEndDate));

    // Handle cards outside the visible range for all zoom levels
    const rangeStart = dateRange[0];
    const rangeEnd = dateRange[dateRange.length - 1];

    let left = 0;
    let width = 5;

    // Special handling for day view - opposite edge collection
    if (zoomLevel === 'day') {
      // If card is entirely before the current day (in the past), collect on left edge
      if (cardEndDate < rangeStart) {
        left = 0; // Position at the left edge
      }
      // If card is entirely after the current day (in the future), collect on right edge
      else if (cardStartDate > rangeEnd) {
        left = 95; // Position near the right edge (95% from left)
      }

      // Adjust width for 'day' view: full width if current day is within card's duration, else a small indicator
      const today = dateRange[0]; // In day view, dateRange[0] is always the current day
      // Check if today is within the card's date range (inclusive)
      if (today >= cardStartDate && today <= cardEndDate) {
        // If the current day is within the card's duration, make it full width
        width = 100;
      } else {
        // Otherwise, make it a small indicator
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
      // If card starts before but ends within range, start at left edge
      else if (cardStartDate < rangeStart && endIndex >= 0) {
        left = 0; // Left edge
      }
      // If card starts within range but ends after, end at right edge
      else if (cardEndDate > rangeEnd && startIndex >= 0) {
        left = (startIndex / dateRange.length) * 100; // Normal positioning
        width = ((endIndex - startIndex + 1) / dateRange.length) * 100; // Normal width
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
            const currentCardStartIdx = dateRange.findIndex(date => isSameDay(date, currentCardStartDate));
            const currentCardEndIdx = dateRange.findIndex(date => isSameDay(date, currentCardEndDate));
            const existingCardStartIdx = dateRange.findIndex(date => isSameDay(date, existingCardStartDate));
            const existingCardEndIdx = dateRange.findIndex(date => isSameDay(date, existingCardEndDate));

            // Handle out-of-range indices
            const start1 = Math.max(0, currentCardStartIdx);
            const end1 = Math.max(0, currentCardEndIdx);
            const start2 = Math.max(0, existingCardStartIdx);
            const end2 = Math.max(0, existingCardEndIdx);

            const start = Math.max(start1, start2);
            const end = Math.min(end1, end2);

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

  const navigateDate = (direction: 'prev' | 'next') => {
    switch (zoomLevel) {
      case 'day':
        setCurrentDate(prev => addDays(prev, direction === 'next' ? 1 : -1));
        break;
      case 'week':
        setCurrentDate(prev => addWeeks(prev, direction === 'next' ? 1 : -1));
        break;
      case 'month':
        setCurrentDate(prev => addMonths(prev, direction === 'next' ? 1 : -1));
        break;
      case 'quarter':
        setCurrentDate(prev => addMonths(prev, direction === 'next' ? 3 : -3));
        break;
      case 'year':
        setCurrentDate(prev => addYears(prev, direction === 'next' ? 1 : -1));
        break;
    }
  };

  const getZoomLabel = () => {
    switch (zoomLevel) {
      case 'day': return 'Day';
      case 'week': return 'Week';
      case 'month': return 'Month';
      case 'quarter': return 'Quarter';
      case 'year': return 'Year';
      default: return 'Month';
    }
  };

  const getDateLabel = (date: Date) => {
    switch (zoomLevel) {
      case 'day':
        return format(date, 'MMM d, yyyy');
      case 'week':
        return format(date, 'MMM d, yyyy');
      case 'month':
        return format(date, 'MMM d');
      case 'quarter':
        return format(date, 'MMM yyyy');
      case 'year':
        return format(date, 'yyyy');
      default:
        return format(date, 'MMM d');
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header with zoom controls */}
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center justify-between w-96">
          <button
            onClick={() => navigateDate('prev')}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ←
          </button>

          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {format(currentDate, zoomLevel === 'year' ? 'yyyy' : zoomLevel === 'quarter' ? 'QQQ yyyy' : 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="rounded-lg px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Today
            </button>
          </div>

          <button
            onClick={() => navigateDate('next')}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            →
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel('day')}
            className={cn(
              'rounded-lg px-3 py-1 text-sm font-medium transition-colors',
              zoomLevel === 'day'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            Day
          </button>
          <button
            onClick={() => setZoomLevel('week')}
            className={cn(
              'rounded-lg px-3 py-1 text-sm font-medium transition-colors',
              zoomLevel === 'week'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            Week
          </button>
          <button
            onClick={() => setZoomLevel('month')}
            className={cn(
              'rounded-lg px-3 py-1 text-sm font-medium transition-colors',
              zoomLevel === 'month'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            Month
          </button>
          <button
            onClick={() => setZoomLevel('quarter')}
            className={cn(
              'rounded-lg px-3 py-1 text-sm font-medium transition-colors',
              zoomLevel === 'quarter'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            Quarter
          </button>
          <button
            onClick={() => setZoomLevel('year')}
            className={cn(
              'rounded-lg px-3 py-1 text-sm font-medium transition-colors',
              zoomLevel === 'year'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            Year
          </button>
        </div>

      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-auto p-4 absolute inset-0">
          <div className="min-w-[1200px]">
            {/* Date headers */}
            <div className="sticky top-0 z-10 flex border-b-2 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              <div className="w-48 flex-shrink-0 p-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {getZoomLabel()}
                </div>
              </div>
              <div className="flex-1 flex">
                {dateRange.map((date, index) => (
                  <div
                    key={date.toISOString()}
                    className={cn(
                      'flex-1 border-l border-slate-200 p-2 text-center text-xs',
                      index % 7 === 0 && 'border-l-2 border-slate-300',
                      'dark:border-slate-700 dark:border-l-slate-600'
                    )}
                  >
                    <div className="text-slate-500 dark:text-slate-400">
                      {getDateLabel(date)}
                    </div>
                    {index % 7 === 0 && (
                      <div className="text-slate-400 dark:text-slate-500">
                        {format(date, zoomLevel === 'year' ? 'yyyy' : 'MMM')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Lists and cards */}
            <div className="relative">
              {board.lists.map((list, listIndex) => {
                const listCards = cardsWithDates.filter(card => card.listId === list.id);

                if (listCards.length === 0) return null;

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
                      {/* Grid lines */}
                      {dateRange.map((date, index) => (
                        <div
                          key={date.toISOString()}
                          className={cn(
                            'absolute top-0 bottom-0 border-l border-slate-100',
                            index % 7 === 0 && 'border-l-2 border-slate-200',
                            'dark:border-slate-800 dark:border-l-slate-700'
                          )}
                          style={{
                            left: `${(index / dateRange.length) * 100}%`,
                            width: `${100 / dateRange.length}%`
                          }}
                        />
                      ))}

                      {/* Cards */}
                      {listCards.map((card, cardIndex) => {
                        const position = getCardPosition(card, listCards, cardIndex);
                        const color = getCardColor(card);

                        return (
                          <div
                            key={card.id}
                            className={cn(
                              'absolute h-8 rounded-md px-2 py-1 text-xs font-medium text-white shadow-sm cursor-pointer transition-all hover:shadow-md hover:z-10',
                              `bg-${color}-500`
                            )}
                            style={position}
                            title={card.title}
                            onClick={() => openCardModal(card.id)}
                          >
                            <div className="truncate">{card.title}</div>
                          </div>
                        );
                      })}
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
    </div>
  );
}
