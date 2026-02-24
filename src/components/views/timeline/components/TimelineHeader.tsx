import { useState } from 'react';
import { format, addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

type ZoomLevel = 'day' | 'week' | '2weeks' | 'month' | 'year';

interface TimelineHeaderProps {
  currentDate: Date;
  zoomLevel: ZoomLevel;
  onDateChange: (date: Date) => void;
  onZoomChange: (level: ZoomLevel) => void;
}

export function TimelineHeader({
  currentDate,
  zoomLevel,
  onDateChange,
  onZoomChange
}: TimelineHeaderProps) {
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (zoomLevel) {
      case 'day':
        onDateChange(addDays(newDate, direction === 'next' ? 1 : -1));
        break;
      case 'week':
        onDateChange(addWeeks(newDate, direction === 'next' ? 1 : -1));
        break;
      case '2weeks':
        onDateChange(addWeeks(newDate, direction === 'next' ? 2 : -2));
        break;
      case 'month':
        onDateChange(addMonths(newDate, direction === 'next' ? 1 : -1));
        break;
      case 'year':
        onDateChange(addYears(newDate, direction === 'next' ? 1 : -1));
        break;
    }
  };

  return (
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
            {format(currentDate, zoomLevel === 'year' ? 'yyyy' : 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => onDateChange(new Date())}
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
          onClick={() => onZoomChange('day')}
          className={cn(
            'rounded-lg px-3 py-1 text-sm font-medium transition-colors',
            zoomLevel === 'day'
              ? 'bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          )}
          title="Day (Press 1)"
        >
          Day
        </button>
        <button
          onClick={() => onZoomChange('week')}
          className={cn(
            'rounded-lg px-3 py-1 text-sm font-medium transition-colors',
            zoomLevel === 'week'
              ? 'bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          )}
          title="Week (Press 2)"
        >
          Week
        </button>
        <button
          onClick={() => onZoomChange('2weeks')}
          className={cn(
            'rounded-lg px-3 py-1 text-sm font-medium transition-colors',
            zoomLevel === '2weeks'
              ? 'bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          )}
          title="2 Weeks (Press 3)"
        >
          2 Weeks
        </button>
        <button
          onClick={() => onZoomChange('month')}
          className={cn(
            'rounded-lg px-3 py-1 text-sm font-medium transition-colors',
            zoomLevel === 'month'
              ? 'bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          )}
          title="Month (Press 4)"
        >
          Month
        </button>
        <button
          onClick={() => onZoomChange('year')}
          className={cn(
            'rounded-lg px-3 py-1 text-sm font-medium transition-colors',
            zoomLevel === 'year'
              ? 'bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          )}
          title="Year (Press 5)"
        >
          Year
        </button>
      </div>
    </div>
  );
}
