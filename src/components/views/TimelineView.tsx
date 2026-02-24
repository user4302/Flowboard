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

// Helper function to calculate hidden cards for a specific card
const calculateHiddenCards = (allCards: any[], currentCard: any, dateRange: Date[]) => {
  const rangeStart = dateRange[0];
  const rangeEnd = dateRange[dateRange.length - 1];

  const hiddenBefore = allCards.filter(card => {
    if (card.id === currentCard.id) return false;
    const cardEnd = card.dueDate || addDays(card.startDate || new Date(), 7);
    return cardEnd < rangeStart;
  });

  const hiddenAfter = allCards.filter(card => {
    if (card.id === currentCard.id) return false;
    const cardStart = card.startDate || new Date();
    return cardStart > rangeEnd;
  });

  return { hiddenBefore, hiddenAfter };
};

// Styled tooltip component
const MiniCardTooltip = ({ card, position }: { card: any; position: 'before' | 'after' }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="absolute z-50 bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 min-w-[200px] pointer-events-none">
      <div className="font-medium text-sm mb-1">{card.title}</div>
      {card.description && (
        <div className="text-xs text-slate-300 mb-2 line-clamp-2">
          {card.description.length > 60 ? card.description.substring(0, 60) + '...' : card.description}
        </div>
      )}
      <div className="text-xs text-slate-400 space-y-1">
        {card.startDate && (
          <div>Start: {formatDate(new Date(card.startDate))}</div>
        )}
        {card.dueDate && (
          <div>Due: {formatDate(new Date(card.dueDate))}</div>
        )}
        <div className="text-xs italic text-slate-500">
          {position === 'before' ? 'Before current view' : 'After current view'}
        </div>
      </div>
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {card.labels.map((label: any, index: number) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 rounded-full ${label.color}`}
            >
              {label.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

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
  const [collapsedLanes, setCollapsedLanes] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<{ card: any; position: 'before' | 'after'; x: number; y: number } | null>(null);

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

  // Toggle collapse state for a lane
  const toggleLaneCollapse = (listId: string) => {
    setCollapsedLanes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(listId)) {
        newSet.delete(listId);
      } else {
        newSet.add(listId);
      }
      return newSet;
    });
  };

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
                const isCollapsed = collapsedLanes.has(list.id);

                return (
                  <div key={list.id} className="border-2 border-slate-200 dark:border-slate-700 rounded-lg mb-4 overflow-hidden">
                    {/* Main swimlane header - visually distinct with collapse toggle */}
                    <div
                      className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => toggleLaneCollapse(list.id)}
                    >
                      <div className="flex">
                        {/* List name with collapse chevron */}
                        <div className="w-48 flex-shrink-0 p-3">
                          <div className="flex items-center gap-2">
                            <div className={`transform transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}>
                              ▶
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                {list.title}
                              </h3>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {listCards.length} cards
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Timeline area header (empty, just for alignment) */}
                        <div className="flex-1 relative" style={{ minHeight: '48px' }}>
                          {/* This ensures timeline lines extend properly */}
                        </div>

                        {/* Right-side empty space without horizontal border */}
                        <div className="w-48 flex-shrink-0 border-l border-slate-200 dark:border-slate-700">
                          {/* Empty space for consistency with child lanes */}
                        </div>
                      </div>
                    </div>

                    {/* Sub-card swimlanes within this parent container - collapsible */}
                    {!isCollapsed && (
                      <div className="bg-white dark:bg-slate-900">
                        {listCards.length > 0 ? (
                          // Show actual cards if they exist in current range
                          listCards.map((card, cardIndex) => {
                            const { hiddenBefore, hiddenAfter } = calculateHiddenCards(cardsWithDates, card, dateRange);
                            return (
                              <SubCardSwimlane
                                key={card.id}
                                card={card}
                                dateRange={dateRange}
                                zoomLevel={zoomLevel}
                                onOpenCardModal={openCardModal}
                                getCardPosition={getCardPositionWrapper}
                                getCardColor={getCardColor}
                                calculateTimelineHeight={calculateTimelineHeight}
                                hiddenCardsBefore={hiddenBefore}
                                hiddenCardsAfter={hiddenAfter}
                              />
                            );
                          })
                        ) : (
                          // Check if the original list has any cards at all
                          list.cards.length > 0 ? (
                            // Show empty swimlane if list has cards but none in current range
                            <div className="flex border-b border-slate-50 dark:border-slate-700">
                              {/* Left-side space for past hidden cards */}
                              <div className="w-48 flex-shrink-0 p-3 border-r border-slate-100 dark:border-slate-700">
                                <div className="flex flex-wrap gap-1">
                                  {list.cards.map((card) => {
                                    const cardStart = card.startDate || new Date();
                                    const cardEnd = card.dueDate || addDays(cardStart, 7);
                                    const rangeStart = dateRange[0];
                                    const rangeEnd = dateRange[dateRange.length - 1];

                                    // Show card in left side only if it's before current range
                                    if (cardEnd < rangeStart) {
                                      return (
                                        <div
                                          key={card.id}
                                          className={`w-6 h-6 rounded cursor-pointer hover:opacity-80 transition-opacity bg-${getCardColor(card)}-500 relative`}
                                          title={`${card.title} (Before current view)`}
                                          onClick={() => openCardModal(card.id)}
                                          onMouseEnter={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setHoveredCard({
                                              card,
                                              position: 'before',
                                              x: rect.left + rect.width / 2,
                                              y: rect.bottom + 8
                                            });
                                          }}
                                          onMouseLeave={() => setHoveredCard(null)}
                                        />
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              </div>

                              {/* Empty timeline area */}
                              <div
                                className="flex-1 relative border-b border-slate-50 dark:border-slate-700 flex items-center justify-center"
                                style={{ minHeight: '60px' }}
                              >
                                <div className="text-slate-400 dark:text-slate-500 text-sm italic">
                                  All cards are outside current date range
                                </div>
                              </div>

                              {/* Right-side space for future hidden cards */}
                              <div className="w-48 flex-shrink-0 p-3 border-l border-slate-100 dark:border-slate-700">
                                <div className="flex flex-wrap gap-1">
                                  {list.cards.map((card) => {
                                    const cardStart = card.startDate || new Date();
                                    const cardEnd = card.dueDate || addDays(cardStart, 7);
                                    const rangeStart = dateRange[0];
                                    const rangeEnd = dateRange[dateRange.length - 1];

                                    // Show card in right side only if it's after current range
                                    if (cardStart > rangeEnd) {
                                      return (
                                        <div
                                          key={card.id}
                                          className={`w-6 h-6 rounded cursor-pointer hover:opacity-80 transition-opacity bg-${getCardColor(card)}-500 relative`}
                                          title={`${card.title} (After current view)`}
                                          onClick={() => openCardModal(card.id)}
                                          onMouseEnter={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setHoveredCard({
                                              card,
                                              position: 'after',
                                              x: rect.left + rect.width / 2,
                                              y: rect.bottom + 8
                                            });
                                          }}
                                          onMouseLeave={() => setHoveredCard(null)}
                                        />
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Show truly empty swimlane if list has no cards at all
                            <div className="flex border-b border-slate-50 dark:border-slate-700">
                              {/* Left-side space */}
                              <div className="w-48 flex-shrink-0 p-3 border-r border-slate-100 dark:border-slate-700">
                                <div className="text-xs text-slate-400 dark:text-slate-500 text-center italic">
                                  No cards in list
                                </div>
                              </div>

                              {/* Empty timeline area */}
                              <div
                                className="flex-1 relative border-b border-slate-50 dark:border-slate-700 flex items-center justify-center"
                                style={{ minHeight: '60px' }}
                              >
                                <div className="text-slate-400 dark:text-slate-500 text-sm italic">
                                  Add cards to this list to see them here
                                </div>
                              </div>

                              {/* Right-side space */}
                              <div className="w-48 flex-shrink-0 p-3 border-l border-slate-100 dark:border-slate-700">
                                {/* Empty */}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
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

      {/* Tooltip rendering */}
      {hoveredCard && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: hoveredCard.x - 100, // Center the tooltip
            top: hoveredCard.y,
            transform: 'translateX(0)'
          }}
        >
          <MiniCardTooltip card={hoveredCard.card} position={hoveredCard.position} />
        </div>
      )}
    </div >
  );
}
