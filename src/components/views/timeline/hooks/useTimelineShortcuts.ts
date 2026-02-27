import { useEffect } from 'react';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

/**
 * Timeline zoom level type
 * Defines the different zoom levels available for timeline view
 */
type ZoomLevel = 'day' | 'week' | '2weeks' | 'month' | 'year';

/**
 * useShortcuts hook - Handles keyboard shortcuts for timeline navigation
 * Provides number keys for zoom levels and arrow keys for date navigation
 * Automatically cleans up event listeners on unmount
 * 
 * @param setZoomLevel - Function to change zoom level
 * @param setCurrentDate - Function to change current date
 * @param zoomLevel - Current zoom level
 */
export function useTimelineShortcuts(
  setZoomLevel: (level: ZoomLevel) => void,
  setCurrentDate: (date: Date | ((prev: Date) => Date)) => void,
  zoomLevel: ZoomLevel
) {
  useEffect(() => {
    /**
     * Handles keyboard press events for timeline navigation
     * @param event - Keyboard event
     */
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle number keys when not typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        // Number keys 1-5 for zoom levels
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
        // Arrow keys for date navigation
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

    // Add event listener and return cleanup function
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setZoomLevel, setCurrentDate, zoomLevel]);
}
