'use client';

import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { useBoardStore, useUIStore } from '@/store';
import { filterCards } from '@/lib/filterUtils';
import { cn } from '@/lib/utils';

/**
 * CalendarView component props interface
 * Defines the props for the calendar view component
 */
interface CalendarViewProps {
  // ID of the board to display
  boardId: string;
}

/**
 * CalendarView component - Displays board cards in a calendar format
 * Shows cards with due dates in a monthly calendar layout
 * Supports month navigation and search filtering
 */
export function CalendarView({ boardId }: CalendarViewProps) {
  // Store hooks for board data and UI state
  const { boards } = useBoardStore();
  const {
    searchTerm,
    selectedLabels,
    selectedMembers,
    showOverdue,
    showCompleted,
    priorityThreshold,
    dueDateFilter,
    openCardModal
  } = useUIStore();

  // Find the current board
  const board = boards.find((b) => b.id === boardId);
  if (!board) return null;

  // Local state for current month navigation
  const [currentMonth, setCurrentMonth] = useState(new Date());

  /**
   * Generate calendar days for the current month
   * Uses useMemo to prevent unnecessary recalculations
   */
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  /**
   * Filter cards that have due dates and apply search filtering
   * Returns only cards with due dates for calendar display
   */
  const cardsWithDueDates = useMemo(() => {
    const allCards = board.lists.flatMap(list => list.cards);

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
    return filtered.filter(card => card.dueDate);
  }, [board.lists, board.labels, searchTerm, selectedLabels, selectedMembers, showOverdue, showCompleted, priorityThreshold, dueDateFilter]);

  /**
   * Get cards for a specific calendar day
   * Filters cards by due date matching the given day
   * @param day - Calendar day to check
   * @returns Array of cards due on the given day
   */
  const getCardsForDay = (day: Date) => {
    return cardsWithDueDates.filter(card =>
      card.dueDate && isSameDay(card.dueDate, day)
    );
  };

  /**
   * Navigate to previous or next month
   * @param direction - Navigation direction
   */
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  /**
   * Handle card click to open modal
   * @param cardId - ID of the clicked card
   */
  const handleCardClick = (cardId: string) => {
    openCardModal(cardId);
  };

  // Week day headers for calendar grid
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex h-full flex-col">
      {/* Calendar header with navigation controls */}
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center gap-4">
          {/* Previous month button */}
          <button
            onClick={() => navigateMonth('prev')}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ←
          </button>
          {/* Current month display */}
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          {/* Next month button */}
          <button
            onClick={() => navigateMonth('next')}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            →
          </button>
        </div>
        {/* Today button for quick navigation */}
        <button
          onClick={() => setCurrentMonth(new Date())}
          className="rounded-lg px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          Today
        </button>
      </div>

      {/* Calendar grid layout */}
      <div className="flex-1 overflow-auto p-4">
        <div className="min-w-[800px]">
          {/* Week day headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
            {weekDays.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: calendarDays[0].getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="min-h-[100px] border-r border-b border-slate-100 p-2 dark:border-slate-800" />
            ))}

            {/* Actual calendar days with cards */}
            {calendarDays.map(day => {
              const dayCards = getCardsForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'min-h-[100px] border-r border-b border-slate-100 p-2 dark:border-slate-800',
                    isToday && 'bg-indigo-50 dark:bg-indigo-900/20'
                  )}
                >
                  {/* Day number */}
                  <div className={cn(
                    'mb-1 text-sm font-medium',
                    isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                  )}>
                    {format(day, 'd')}
                  </div>

                  {/* Cards for this day */}
                  <div className="space-y-1">
                    {dayCards.slice(0, 3).map(card => (
                      <div
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className={cn(
                          'truncate rounded px-1 py-0.5 text-xs cursor-pointer transition-colors',
                          (card.labelIds?.length ?? 0) > 0 && board.labels.find(l => l.id === card.labelIds![0])
                            ? board.labels.find(l => l.id === card.labelIds![0])!.color.replace('-500', '-100') + ' text-' + board.labels.find(l => l.id === card.labelIds![0])!.color.replace('bg-', '').replace('-500', '-700')
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                        )}
                        title={card.title}
                      >
                        {card.title}
                      </div>
                    ))}

                    {/* Show count for additional cards */}
                    {dayCards.length > 3 && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        +{dayCards.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary section with card count */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {cardsWithDueDates.length} cards with due dates this month
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-indigo-100 dark:bg-indigo-900/30"></div>
              <span className="text-slate-600 dark:text-slate-400">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
