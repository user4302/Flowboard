import { useMemo } from 'react';
import { eachDayOfInterval, startOfDay, endOfDay, startOfWeek, endOfWeek, addWeeks, startOfMonth, endOfMonth, addMonths, startOfYear, endOfYear } from 'date-fns';

/**
 * Timeline zoom level type
 * Defines the different zoom levels available for timeline view
 */
type ZoomLevel = 'day' | 'week' | '2weeks' | 'month' | 'year';

/**
 * useDateRange hook - Calculates date range based on current date and zoom level
 * Returns an array of dates to display in the timeline
 * Optimized with useMemo to prevent unnecessary recalculations
 * 
 * @param currentDate - Current date for timeline
 * @param zoomLevel - Current zoom level
 * @returns Array of dates for the timeline view
 */
export function useTimelineDateRange(currentDate: Date, zoomLevel: ZoomLevel) {
  return useMemo(() => {
    let dates: Date[] = [];

    // Validate zoom level
    const validZoomLevel = zoomLevel || 'week';

    switch (validZoomLevel) {
      case 'day':
        // Single day view
        dates = eachDayOfInterval({
          start: startOfDay(currentDate),
          end: endOfDay(currentDate)
        });
        break;
      case 'week':
        // Week view (Monday to Sunday)
        dates = eachDayOfInterval({
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: endOfWeek(currentDate, { weekStartsOn: 1 })
        });
        break;
      case '2weeks':
        // Two weeks view
        dates = eachDayOfInterval({
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: endOfWeek(addWeeks(currentDate, 1), { weekStartsOn: 1 })
        });
        break;
      case 'month':
        // Month view (all days in month)
        dates = eachDayOfInterval({
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        });
        break;
      case 'year':
        // Year view (first day of each month)
        for (let i = 0; i < 12; i++) {
          dates.push(new Date(currentDate.getFullYear(), i, 1));
        }
        break;
    }

    return dates;
  }, [currentDate, zoomLevel]);
}
