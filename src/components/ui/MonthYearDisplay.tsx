import { format } from 'date-fns';

/**
 * Props interface for MonthYearDisplay component
 */
interface MonthYearDisplayProps {
  /** Current date to display */
  currentDate: Date;
  /** Optional custom format string */
  formatString?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MonthYearDisplay component - Stable height month/year display
 * 
 * This component provides a consistent height display for month/year text
 * to prevent layout shifts when the date changes. It uses whitespace-nowrap
 * and maintains consistent dimensions.
 * 
 * Reused from TimelineHeader to ensure consistent behavior across views.
 */
export function MonthYearDisplay({ 
  currentDate, 
  formatString = 'MMMM yyyy',
  className = ''
}: MonthYearDisplayProps) {
  return (
    <h2 className={`
      text-lg font-semibold text-slate-900 dark:text-slate-100 
      whitespace-nowrap
      ${className}
    `}>
      {currentDate && !isNaN(currentDate.getTime())
        ? format(currentDate, formatString)
        : 'Invalid Date'
      }
    </h2>
  );
}
