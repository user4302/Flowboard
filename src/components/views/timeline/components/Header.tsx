import { format, addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { cn } from '@/lib/utils';

/**
 * Timeline zoom level type
 * Defines the different zoom levels available for timeline view
 */
type ZoomLevel = 'day' | 'week' | '2weeks' | 'month' | 'year';

/**
 * Header component props interface
 * Defines the props for the timeline header controls
 */
interface HeaderProps {
  // Current date being displayed in timeline
  currentDate: Date;
  // Current zoom level
  zoomLevel: ZoomLevel;
  // Function to handle date changes
  onDateChange: (date: Date) => void;
  // Function to handle zoom level changes
  onZoomChange: (level: ZoomLevel) => void;
}

/**
 * Header component - Header controls for timeline view
 * Provides navigation, date display, and zoom controls
 * Supports keyboard shortcuts for quick zoom level changes
 */
export function Header({
  currentDate,
  zoomLevel,
  onDateChange,
  onZoomChange
}: HeaderProps) {
  /**
   * Handles date navigation based on current zoom level
   * @param direction - Navigation direction ('prev' or 'next')
   */
  const navigateDate = (direction: 'prev' | 'next') => {
    if (!currentDate || isNaN(currentDate.getTime())) {
      console.warn('Cannot navigate: Invalid current date');
      return;
    }

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
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      {/* Date navigation controls */}
      <div className="flex items-center justify-between w-96">
        {/* Previous date button */}
        <button
          onClick={() => navigateDate('prev')}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          ←
        </button>

        {/* Current date display with today button */}
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
            {currentDate && !isNaN(currentDate.getTime())
              ? format(currentDate, zoomLevel === 'year' ? 'yyyy' : 'MMMM yyyy')
              : 'Invalid Date'
            }
          </h2>
          <button
            onClick={() => onDateChange(new Date())}
            className="rounded-lg px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Today
          </button>
        </div>

        {/* Next date button */}
        <button
          onClick={() => navigateDate('next')}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          →
        </button>
      </div>

      {/* Zoom level controls */}
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
