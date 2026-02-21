'use client';

import { useState, useMemo } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, isSameDay, isWithinInterval } from 'date-fns';
import { useBoardStore, useUIStore } from '@/store';
import { cn } from '@/lib/utils';

interface TimelineViewProps {
  boardId: string;
}

export function TimelineView({ boardId }: TimelineViewProps) {
  const { boards } = useBoardStore();
  const { searchTerm } = useUIStore();

  const board = boards.find((b) => b.id === boardId);
  if (!board) return null;

  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate date range for the current month + next 2 months
  const dateRange = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(addMonths(currentMonth, 2));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Filter cards that have dates
  const cardsWithDates = useMemo(() => {
    const allCards = board.lists.flatMap(list => list.cards);
    const filtered = searchTerm
      ? allCards.filter(card =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : allCards;

    return filtered.filter(card => card.startDate || card.dueDate);
  }, [board.lists, searchTerm]);

  // Calculate card position and width on timeline
  const getCardPosition = (card: any) => {
    const startDate = card.startDate || new Date(); // Default to today if no start date
    const dueDate = card.dueDate || addMonths(startDate, 1); // Default to 1 month if no due date

    const startIndex = dateRange.findIndex(date => isSameDay(date, startDate));
    const endIndex = dateRange.findIndex(date => isSameDay(date, dueDate));

    const left = startIndex >= 0 ? (startIndex / dateRange.length) * 100 : 0;
    const width = endIndex >= 0 ? ((endIndex - startIndex + 1) / dateRange.length) * 100 : 5;

    return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
  };

  const getCardColor = (card: any) => {
    if (card.labels.length > 0) {
      return card.labels[0].color.replace('bg-', '').replace('-500', '');
    }
    return 'slate';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => addMonths(prev, direction === 'next' ? 1 : -1));
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header with month navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ←
          </button>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {format(currentMonth, 'MMMM yyyy')} - {format(addMonths(currentMonth, 2), 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            →
          </button>
        </div>
        <button
          onClick={() => setCurrentMonth(new Date())}
          className="rounded-lg px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          Today
        </button>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto p-4">
        <div className="min-w-[1200px]">
          {/* Date headers */}
          <div className="sticky top-0 z-10 flex border-b-2 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="w-48 flex-shrink-0 p-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              Lists / Cards
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
                    {format(date, 'd')}
                  </div>
                  {index % 7 === 0 && (
                    <div className="text-slate-400 dark:text-slate-500">
                      {format(date, 'MMM')}
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
                  <div className="flex-1 relative min-h-[60px]">
                    {/* Grid lines */}
                    {dateRange.map((date, index) => (
                      <div
                        key={date.toISOString()}
                        className={cn(
                          'absolute top-0 bottom-0 border-l border-slate-100',
                          index % 7 === 0 && 'border-l border-slate-200',
                          'dark:border-slate-800 dark:border-l-slate-700'
                        )}
                        style={{ left: `${(index / dateRange.length) * 100}%`, width: `${100 / dateRange.length}%` }}
                      />
                    ))}

                    {/* Cards */}
                    {listCards.map((card) => {
                      const position = getCardPosition(card);
                      const color = getCardColor(card);

                      return (
                        <div
                          key={card.id}
                          className={cn(
                            'absolute top-2 h-8 rounded-md px-2 py-1 text-xs font-medium text-white shadow-sm cursor-pointer transition-all hover:shadow-md hover:z-10',
                            `bg-${color}-500`
                          )}
                          style={position}
                          title={card.title}
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
  );
}
