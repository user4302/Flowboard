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
import { MiniCardTooltip } from './timeline/components/MiniCardTooltip';
import { useDateRange } from './timeline/hooks/useDateRange';
import { useTimelineKeyboardShortcuts } from './timeline/hooks/useTimelineKeyboardShortcuts';
import { useHiddenCards } from './timeline/hooks/useHiddenCards';
import { calculateTimelineHeight, getCardPosition, getCardColor } from './timeline/utils/timelineUtils';

/**
 * Props interface for TimelineView component
 */
interface TimelineViewProps {
  /** ID of the board to display */
  boardId: string;
}

/**
 * TimelineView Component
 * 
 * A comprehensive timeline visualization component that displays cards from a board
 * on a horizontal timeline with multiple zoom levels and advanced features.
 * 
 * Features:
 * - Multiple zoom levels (Day, Week, 2 Weeks, Month, Year)
 * - Collapsible swimlanes for each list
 * - Hidden cards indicators for out-of-range cards
 * - Card positioning with stacking for overlapping cards
 * - Keyboard shortcuts for navigation
 * - Responsive design with tooltips
 * 
 * @param boardId - ID of the board to display
 */
export function TimelineView({ boardId }: TimelineViewProps) {
  const { boards } = useBoardStore();
  const { searchTerm, openCardModal } = useUIStore();

  const board = boards.find((b) => b.id === boardId);
  if (!board) return null;

  // Component state
  const [currentDate, setCurrentDate] = useState(new Date()); // Currently focused date
  const [zoomLevel, setZoomLevel] = useState<'day' | 'week' | '2weeks' | 'month' | 'year'>('week'); // Current zoom level
  const [collapsedLanes, setCollapsedLanes] = useState<Set<string>>(new Set()); // Track collapsed swimlanes
  const [hoveredCard, setHoveredCard] = useState<{ card: any; position: 'before' | 'after'; x: number; y: number } | null>(null); // Track hovered card for tooltip

  // Generate date range based on zoom level and current date using custom hook
  const dateRange = useDateRange(currentDate, zoomLevel);

  /**
   * Filter and process cards for timeline display
   * 
   * This memoized function filters cards based on:
   * 1. Search term (title and description)
   * 2. Date requirements (must have start or due date)
   * 3. Overlap with current date range
   */
  const cardsWithDates = useMemo(() => {
    // Get all cards from all lists in the board
    const allCards = board.lists.flatMap(list => list.cards);

    // First apply search filter if search term exists
    const filtered = searchTerm
      ? allCards.filter(card =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : allCards;

    // Then filter to only show cards that overlap with current date range
    // A card overlaps if it starts before or during range AND ends after or during range
    return filtered.filter(card => {
      // Check if card has any date information
      const hasDates = card.startDate || card.dueDate;
      if (!hasDates) return false;

      // Normalize dates to start of day for consistent comparison
      const cardStart = startOfDay(card.startDate || new Date());
      const cardEnd = startOfDay(card.dueDate || addDays(cardStart, 7));
      const rangeStart = startOfDay(dateRange[0]);
      const rangeEnd = startOfDay(dateRange[dateRange.length - 1]);

      // Card overlaps if it starts before or during range AND ends after or during range
      return cardStart <= rangeEnd && cardEnd >= rangeStart;
    });
  }, [board.lists, searchTerm, dateRange]);

  /**
   * Create wrapper function for getCardPosition to match expected signature
   * 
   * This memoized wrapper ensures the getCardPosition function receives
   * the current dateRange and zoomLevel parameters while maintaining
   * the expected signature for child components.
   */
  const getCardPositionWrapper = useMemo(() => {
    return (card: any, allCards: any[], cardIndex: number) => {
      return getCardPosition(card, allCards, cardIndex, dateRange, zoomLevel);
    };
  }, [dateRange, zoomLevel]);

  /**
   * Toggle collapse state for a swimlane
   * 
   * @param listId - ID of the list to toggle
   */
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

  // Initialize keyboard shortcuts for timeline navigation
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

      {/* Timeline container with scroll */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-auto p-4 absolute inset-0">
          <div className="min-w-[1200px]">
            {/* Date headers and grid lines */}
            <TimelineGrid dateRange={dateRange} zoomLevel={zoomLevel} />

            {/* Lists and cards container */}
            <div className="relative">
              {/* Main swimlanes - one for each list */}
              {board.lists.map((list) => {
                // Get cards that belong to this list and are in current date range
                const listCards = cardsWithDates.filter(card => card.listId === list.id);
                // Check if this swimlane is collapsed
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
                              ▶ {/* Chevron indicator */}
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
                          // Calculate hidden cards once for the entire list
                          (() => {
                            const { hiddenCardsBefore, hiddenCardsAfter } = useHiddenCards(list.cards, dateRange);
                            return listCards.map((card, cardIndex) => (
                              <SubCardSwimlane
                                key={card.id}
                                card={card}
                                dateRange={dateRange}
                                zoomLevel={zoomLevel}
                                onOpenCardModal={openCardModal}
                                getCardPosition={getCardPositionWrapper}
                                getCardColor={getCardColor}
                                calculateTimelineHeight={calculateTimelineHeight}
                                hiddenCardsBefore={hiddenCardsBefore}
                                hiddenCardsAfter={hiddenCardsAfter}
                              />
                            ));
                          })()
                        ) : (
                          // Check if the original list has any cards at all
                          list.cards.length > 0 ? (
                            // Show empty swimlane if list has cards but none in current range
                            <div className="flex border-b border-slate-50 dark:border-slate-700">
                              {/* Left-side space for past hidden cards */}
                              <div className="w-48 flex-shrink-0 p-3 border-r border-slate-100 dark:border-slate-700">
                                <div className="flex flex-wrap gap-1">
                                  {list.cards.map((card) => {
                                    // Calculate card date boundaries
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
                                            // Calculate tooltip position relative to card element
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
                                    // Calculate card date boundaries
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
                                            // Calculate tooltip position relative to card element
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

            {/* Empty state when no cards with dates are found */}
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

      {/* Tooltip rendering for hovered mini cards */}
      {hoveredCard && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: hoveredCard.x - 100, // Center the tooltip horizontally
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
