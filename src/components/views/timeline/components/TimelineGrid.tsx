import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

/**
 * Timeline zoom level type
 * Defines the different zoom levels available for timeline view
 */
type ZoomLevel = 'day' | 'week' | '2weeks' | 'month' | 'year';

/**
 * Grid component props interface
 * Defines the props for rendering the timeline grid
 */
interface GridProps {
  // Array of dates to display in the timeline
  dateRange: Date[];
  // Current zoom level for the timeline
  zoomLevel: ZoomLevel;
}

/**
 * Grid component - Renders the grid structure for timeline view
 * Displays date headers and grid lines based on zoom level
 * Provides visual structure for timeline navigation
 */
export function TimelineGrid({ dateRange, zoomLevel }: GridProps) {
  /**
   * Returns the display label for the current zoom level
   * @returns Human-readable zoom level name
   */
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

  /**
   * Returns the formatted date label based on zoom level
   * @param date - Date to format
   * @returns Formatted date string
   */
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
    <>
      {/* Date headers with zoom level indicator */}
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
                {zoomLevel === 'month' ? format(date, 'd') : getDateLabel(date)}
              </div>
              {/* Show month name only on first day of month */}
              {zoomLevel === 'month' && format(date, 'd') === '1' && (
                <div className="text-slate-400 dark:text-slate-500">
                  {format(date, 'MMM')}
                </div>
              )}
              {zoomLevel !== 'month' && index % 7 === 0 && (
                <div className="text-slate-400 dark:text-slate-500">
                  {format(date, zoomLevel === 'year' ? 'yyyy' : 'MMM')}
                </div>
              )}
              {/* Add quarter markers for year view */}
              {zoomLevel === 'year' && index % 3 === 0 && (
                <div className="text-xs text-slate-300 dark:text-slate-600 font-medium">
                  Q{Math.floor(index / 3) + 1}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Right-side empty space without horizontal border */}
        <div className="w-48 flex-shrink-0 border-l border-slate-200 dark:border-slate-700">
          {/* Empty space for consistency with listlanes */}
        </div>
      </div>

      {/* Vertical grid lines for timeline structure */}
      <div className="relative">
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
      </div>
    </>
  );
}
