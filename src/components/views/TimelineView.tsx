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
import { isSameDay, isSameWeek, isSameMonth, addDays, startOfDay } from 'date-fns';
import { useBoardStore, useUIStore } from '@/store';
import { TimelineHeader } from './timeline/components/TimelineHeader';
import { TimelineGrid } from './timeline/components/TimelineGrid';
import { IndividualCardSwimlane } from './timeline/components/IndividualCardSwimlane';
import { SubCardSwimlane } from './timeline/components/SubCardSwimlane';
import { useDateRange } from './timeline/hooks/useDateRange';
import { useTimelineKeyboardShortcuts } from './timeline/hooks/useTimelineKeyboardShortcuts';
import { calculateTimelineHeight, getCardPosition, getCardColor } from './timeline/utils/timelineUtils';

interface TimelineViewProps {
  boardId: string;
}

export function TimelineView({ boardId }: TimelineViewProps) {
  const { boards } = useBoardStore();
  const { searchTerm, openCardModal } = useUIStore();

  const board = boards.find((b) => b.id === boardId);
  if (!board) return null;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState<'day' | 'week' | '2weeks' | 'month' | 'year'>('week');

  // Generate date range based on zoom level and current date
  const dateRange = useDateRange(currentDate, zoomLevel);

  // Filter cards that have dates AND overlap with current date range
  const cardsWithDates = useMemo(() => {
    const allCards = board.lists.flatMap(list => list.cards);

    // First filter by search term
    const filtered = searchTerm
      ? allCards.filter(card =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : allCards;

    // Then filter to only show cards that overlap with current date range
    return filtered.filter(card => {
      const hasDates = card.startDate || card.dueDate;
      if (!hasDates) return false;

      const cardStart = startOfDay(card.startDate || new Date());
      const cardEnd = startOfDay(card.dueDate || addDays(cardStart, 7));
      const rangeStart = startOfDay(dateRange[0]);
      const rangeEnd = startOfDay(dateRange[dateRange.length - 1]);

      // Card overlaps if it starts before or during range AND ends after or during range
      return cardStart <= rangeEnd && cardEnd >= rangeStart;
    });
  }, [board.lists, searchTerm, dateRange]);

  // Create wrapper function for getCardPosition to match IndividualCardSwimlane expected signature
  const getCardPositionWrapper = useMemo(() => {
    return (card: any, allCards: any[], cardIndex: number) => {
      return getCardPosition(card, allCards, cardIndex, dateRange, zoomLevel);
    };
  }, [dateRange, zoomLevel]);

  // Add keyboard shortcuts for zoom levels
  useTimelineKeyboardShortcuts(setZoomLevel, setCurrentDate, zoomLevel);

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
              {/* Main swimlanes */}
              {board.lists.map((list) => {
                const listCards = cardsWithDates.filter(card => card.listId === list.id);

                return (
                  <div key={list.id}>
                    {/* Main swimlane header */}
                    <div className="flex border-b border-slate-100 dark:border-slate-800">
                      {/* List name */}
                      <div className="w-48 flex-shrink-0 p-3">
                        <h3 className="font-medium text-slate-900 dark:text-slate-100">
                          {list.title}
                        </h3>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {listCards.length} cards
                        </div>
                      </div>

                      {/* Timeline area header (empty, just for alignment) */}
                      <div className="flex-1 relative" style={{ minHeight: '48px' }}>
                        {/* This ensures timeline lines extend properly */}
                      </div>
                    </div>

                    {/* Sub-card swimlanes */}
                    {listCards.map((card, cardIndex) => (
                      <SubCardSwimlane
                        key={card.id}
                        card={card}
                        dateRange={dateRange}
                        zoomLevel={zoomLevel}
                        onOpenCardModal={openCardModal}
                        getCardPosition={getCardPositionWrapper}
                        getCardColor={getCardColor}
                        calculateTimelineHeight={calculateTimelineHeight}
                      />
                    ))}
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
