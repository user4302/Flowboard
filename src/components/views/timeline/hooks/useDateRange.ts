import { useMemo } from 'react';
import { eachDayOfInterval, startOfDay, endOfDay, startOfWeek, endOfWeek, addWeeks, startOfMonth, endOfMonth, addMonths, startOfYear, endOfYear } from 'date-fns';

type ZoomLevel = 'day' | 'week' | '2weeks' | 'month' | 'year';

export function useDateRange(currentDate: Date, zoomLevel: ZoomLevel) {
  return useMemo(() => {
    let dates: Date[] = [];

    switch (zoomLevel) {
      case 'day':
        dates = eachDayOfInterval({
          start: startOfDay(currentDate),
          end: endOfDay(currentDate)
        });
        break;
      case 'week':
        dates = eachDayOfInterval({
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: endOfWeek(currentDate, { weekStartsOn: 1 })
        });
        break;
      case '2weeks':
        dates = eachDayOfInterval({
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: endOfWeek(addWeeks(currentDate, 1), { weekStartsOn: 1 })
        });
        break;
      case 'month':
        dates = eachDayOfInterval({
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        });
        break;
      case 'year':
        for (let i = 0; i < 12; i++) {
          dates.push(new Date(currentDate.getFullYear(), i, 1));
        }
        break;
    }

    return dates;
  }, [currentDate, zoomLevel]);
}
