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
import { TimelineSwimlane } from './timeline/components/TimelineSwimlane';
import { HiddenCardsIndicator } from './timeline/components/HiddenCardsIndicator';
import { useDateRange } from './timeline/hooks/useDateRange';
import { useTimelinePositioning } from './timeline/hooks/useTimelinePositioning';

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
  const dateRange = useDateRange(currentDate, zoomLevel);

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
              {board.lists.map((list) => {
                const listCards = cardsWithDates.filter(card => card.listId === list.id);

                if (listCards.length === 0) {
                  return null;
                }

                return (
                  <TimelineSwimlane
                    key={list.id}
                    list={list}
                    listCards={listCards}
                    dateRange={dateRange}
                    zoomLevel={zoomLevel}
                    onOpenCardModal={openCardModal}
                    getCardColor={getCardColor}
                    calculateTimelineHeight={calculateTimelineHeight}
                  >
                    {listCards.map((card, cardIndex) => (
                      <TimelineCard
                        key={card.id}
                        card={card}
                        allCards={listCards}
                        cardIndex={cardIndex}
                        dateRange={dateRange}
                        zoomLevel={zoomLevel}
                        onOpenCardModal={openCardModal}
                        getCardColor={getCardColor}
                      />
                    ))}
                  </TimelineSwimlane>
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
