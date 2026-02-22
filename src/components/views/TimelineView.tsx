'use client';

import { useState, useMemo } from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear, isSameDay, isWithinInterval, addDays, addWeeks, addMonths, addYears, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useBoardStore, useUIStore } from '@/store';
import { cn } from '@/lib/utils';
import { Calendar, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface TimelineViewProps {
  boardId: string;
}

export function TimelineView({ boardId }: TimelineViewProps) {
  const { boards } = useBoardStore();
  const { searchTerm } = useUIStore();

  const board = boards.find((b) => b.id === boardId);
  if (!board) return null;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [year, setYear] = useState(new Date().getFullYear());

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
  const getCardPosition = (card: any) => {
    const cardStartDate = card.startDate || new Date();
    const cardEndDate = card.dueDate || addDays(cardStartDate, 7);

    let startIndex = dateRange.findIndex(date => isSameDay(date, cardStartDate));
    let endIndex = dateRange.findIndex(date => isSameDay(date, cardEndDate));

    // For day view, constrain cards within day boundary
    if (zoomLevel === 'day') {
      const dayStart = startOfDay(currentDate);
      const dayEnd = endOfDay(currentDate);

      // If card spans beyond the day, constrain it
      if (cardStartDate < dayStart) {
        startIndex = 0;
      }
      if (cardEndDate > dayEnd) {
        endIndex = dateRange.length - 1;
      }
    }

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

        {/* Year selector for year view */}
        {zoomLevel === 'year' && (
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => setYear(year - 1)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ←
            </button>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-center text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              min="2020"
              max="2030"
            />
            <button
              onClick={() => setYear(year + 1)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              →
            </button>
          </div>
        )}
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
                    <div className="flex-1 relative min-h-[60px]">
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
    </div>
  );
}
