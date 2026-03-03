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
import { startOfDay, addDays } from 'date-fns';
import { Card } from '@/lib/types';
import { useBoardStore, useUIStore } from '@/store';
import { filterCards } from '@/lib/filterUtils';
import { TimelineHeader, TimelineGrid, TimelineListLane, TimelineTooltip, useTimelineDateRange, useTimelineShortcuts, calculateTimelineHeight, getTaskPosition } from './timeline';

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
 * - Collapsible listlanes for each list
 * - Hidden cards indicators for out-of-range cards
 * - Card positioning with stacking for overlapping cards
 * - Keyboard shortcuts for navigation
 * - Responsive design with tooltips
 * 
 * @param boardId - ID of the board to display
 */
export function TimelineView({ boardId }: TimelineViewProps) {
  const { boards } = useBoardStore();
  const {
    searchTerm,
    selectedLabels,
    selectedMembers,
    showOverdue,
    showCompleted,
    priorityThreshold,
    dueDateFilter,
    openCardModal,
    getTimelineState,
    setTimelineCurrentDate,
    setTimelineZoomLevel,
    toggleTimelineLane
  } = useUIStore();

  // Get timeline state for this specific board
  const timelineState = getTimelineState(boardId);
  const { currentDate: timelineCurrentDate, zoomLevel: timelineZoomLevel, collapsedLanes: timelineCollapsedLanes } = timelineState;

  const board = boards.find((b) => b.id === boardId);

  // Component state - use persisted state directly from store
  const currentDate = useMemo(() => {
    try {
      const date = new Date(timelineCurrentDate);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid timeline date detected, using current date:', timelineCurrentDate);
        return new Date(); // Return fallback date, state update will be handled by useEffect
      }
      return date;
    } catch (error) {
      console.error('Error parsing timeline date:', error, timelineCurrentDate);
      return new Date(); // Return fallback date, state update will be handled by useEffect
    }
  }, [timelineCurrentDate]);

  // Handle invalid timeline date by resetting state
  useEffect(() => {
    try {
      const date = new Date(timelineCurrentDate);
      if (isNaN(date.getTime())) {
        console.warn('Invalid timeline date detected, resetting to current date:', timelineCurrentDate);
        setTimelineCurrentDate(boardId, new Date().toISOString());
      }
    } catch (error) {
      console.error('Error parsing timeline date:', error, timelineCurrentDate);
      setTimelineCurrentDate(boardId, new Date().toISOString());
    }
  }, [timelineCurrentDate, boardId, setTimelineCurrentDate]);

  const zoomLevel = timelineZoomLevel || 'week'; // Fallback to week if undefined
  const collapsedLanes = useMemo(() => new Set(timelineCollapsedLanes), [timelineCollapsedLanes]);
  const [hoveredTask, setHoveredTask] = useState<{ task: Card; position: 'before' | 'after'; x: number; y: number } | null>(null); // Track hovered task for tooltip

  // Generate date range based on zoom level and current date using custom hook
  const dateRange = useTimelineDateRange(currentDate, zoomLevel);

  /**
   * Filter and process cards for timeline display
   * 
   * This memoized function filters cards based on:
   * 1. Search term (title and description)
   * 2. Date requirements (must have start or due date)
   * 3. Overlap with current date range
   */
  const tasksWithDates = useMemo(() => {
    if (!board) return [];

    // Get all cards from all lists in the board
    const allCards = board.lists.flatMap(list => list.cards);

    // Filter using global filter options (reactive state)
    const filterOptions = {
      searchTerm,
      selectedLabels,
      selectedMembers,
      showOverdue,
      showCompleted,
      priorityThreshold,
      dueDateFilter
    };

    const filtered = filterCards(allCards, filterOptions, board.labels);

    // Then filter to only show cards that overlap with current date range
    return filtered.filter(card => {
      // Check if card has any date information
      const hasDates = card.startDate || card.dueDate;
      if (!hasDates) return false;

      const cardStartDate = card.startDate || new Date();
      const cardEndDate = card.dueDate || addDays(cardStartDate, 7);

      if (isNaN(cardStartDate.getTime()) || isNaN(cardEndDate.getTime())) {
        return false;
      }

      const cardStart = startOfDay(cardStartDate);
      const cardEnd = startOfDay(cardEndDate);
      const rangeStart = startOfDay(dateRange[0]);
      const rangeEnd = startOfDay(dateRange[dateRange.length - 1]);

      return cardStart <= rangeEnd && cardEnd >= rangeStart;
    });
  }, [
    board,
    searchTerm,
    selectedLabels,
    selectedMembers,
    showOverdue,
    showCompleted,
    priorityThreshold,
    dueDateFilter,
    dateRange
  ]);

  /**
   * Create wrapper function for getTaskPosition to match expected signature
   * 
   * This memoized wrapper ensures the getTaskPosition function receives
   * the current dateRange and zoomLevel parameters while maintaining
   * the expected signature for child components.
   */
  const getTaskPositionWrapper = useMemo(() => {
    return (card: Card, allCards: Card[], cardIndex: number) => {
      return getTaskPosition(card, allCards, cardIndex, dateRange, zoomLevel);
    };
  }, [dateRange, zoomLevel]);

  // Update store state when timeline state changes
  const handleDateChange = (date: Date | ((prev: Date) => Date)) => {
    if (date instanceof Date) {
      setTimelineCurrentDate(boardId, date.toISOString());
    } else {
      // Handle functional update: apply function to current date
      const newDate = date(new Date(timelineCurrentDate));
      setTimelineCurrentDate(boardId, newDate.toISOString());
    }
  };

  const handleZoomChange = (level: 'day' | 'week' | '2weeks' | 'month' | 'year') => {
    setTimelineZoomLevel(boardId, level);
  };

  // Initialize keyboard shortcuts for timeline navigation
  useTimelineShortcuts(handleZoomChange, handleDateChange, zoomLevel);

  // Early return after all hooks are called
  if (!board) return null;

  // Ensure date range is not empty
  if (dateRange.length === 0) {
    console.warn('Date range is empty, this will hide all cards');
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header with zoom controls */}
      <TimelineHeader
        currentDate={currentDate}
        zoomLevel={zoomLevel}
        onDateChange={handleDateChange}
        onZoomChange={handleZoomChange}
      />

      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-auto px-4 pb-4 absolute inset-0">
          <div className="min-w-[1200px]">
            {/* Date headers and grid lines */}
            <TimelineGrid dateRange={dateRange} zoomLevel={zoomLevel} />

            {/* Lists and tasks container */}
            <div className="relative">
              {board.lists.map((list) => {
                // Get tasks that belong to this list and are in current date range
                const listTasks = tasksWithDates.filter(task => task.listId === list.id);
                // Check if this tasklane is collapsed
                const isCollapsed = collapsedLanes.has(list.id);

                return (
                  <TimelineListLane
                    key={list.id}
                    boardId={boardId}
                    list={list}
                    listTasks={listTasks}
                    dateRange={dateRange}
                    zoomLevel={zoomLevel}
                    openCardModal={openCardModal}
                    toggleTimelineLane={toggleTimelineLane}
                    getTaskPosition={getTaskPositionWrapper}
                    calculateTimelineHeight={calculateTimelineHeight}
                    isCollapsed={isCollapsed}
                    setHoveredTask={setHoveredTask}
                    boardLabels={board.labels}
                  />
                );
              })}
            </div>

            {/* Empty state when no tasks with dates are found */}
            {tasksWithDates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-lg font-medium text-slate-600 dark:text-slate-400">
                  No tasks with dates found
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-500">
                  Add start or due dates to cards to see them in the timeline
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tooltip rendering for hovered mini tasks */}
      {hoveredTask && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: hoveredTask.x - 100, // Center the tooltip horizontally
            top: hoveredTask.y,
            transform: 'translateX(0)'
          }}
        >
          <TimelineTooltip task={hoveredTask.task} position={hoveredTask.position} boardLabels={board.labels} />
        </div>
      )}
    </div >
  );
}
