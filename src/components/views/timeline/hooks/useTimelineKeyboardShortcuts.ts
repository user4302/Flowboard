import { useEffect } from 'react';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

type ZoomLevel = 'day' | 'week' | '2weeks' | 'month' | 'year';

export function useTimelineKeyboardShortcuts(
  setZoomLevel: (level: ZoomLevel) => void,
  setCurrentDate: (date: Date | ((prev: Date) => Date)) => void,
  zoomLevel: ZoomLevel
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle number keys when not typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case '1':
          setZoomLevel('day');
          break;
        case '2':
          setZoomLevel('week');
          break;
        case '3':
          setZoomLevel('2weeks');
          break;
        case '4':
          setZoomLevel('month');
          break;
        case '5':
          setZoomLevel('year');
          break;
        case 'ArrowLeft':
          setCurrentDate((prev: Date) => {
            switch (zoomLevel) {
              case 'day':
                return addDays(prev, -1);
              case 'week':
                return addDays(prev, -7);
              case '2weeks':
                return addDays(prev, -14);
              case 'month':
                return addMonths(prev, -1);
              case 'year':
                return addYears(prev, -1);
              default:
                return prev;
            }
          });
          break;
        case 'ArrowRight':
          setCurrentDate((prev: Date) => {
            switch (zoomLevel) {
              case 'day':
                return addDays(prev, 1);
              case 'week':
                return addDays(prev, 7);
              case '2weeks':
                return addDays(prev, 14);
              case 'month':
                return addMonths(prev, 1);
              case 'year':
                return addYears(prev, 1);
              default:
                return prev;
            }
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setZoomLevel, setCurrentDate, zoomLevel]);
}
