import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, setHours, setMinutes, isSameDay } from 'date-fns';
import { getStartOfLocalDay, getEndOfLocalDay } from '../../lib/dateUtils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  value?: Date | null;
  onChange: (date: Date) => void;
  isStartDate?: boolean;
  placeholder?: string;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * DateTimePicker component
 * A premium, dark-themed popover for date and time selection.
 */
export const DateTimePicker: React.FC<DateTimePickerProps> = ({ 
  value, 
  onChange, 
  isStartDate = true, 
  placeholder = "Select date & time",
  isOpen,
  onToggle
}) => {
  // Local state for immediate UI feedback
  const [viewDate, setViewDate] = useState(value || new Date());
  const [timeValue, setTimeValue] = useState(value ? format(value, 'HH:mm') : '12:00');
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  // Sync internal state when prop changes
  useEffect(() => {
    console.log('[DateTimePicker] Syncing from value prop:', value);
    if (value) {
      setViewDate(value);
      setTimeValue(format(value, 'HH:mm'));
    }
  }, [value]);

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current && popoverContentRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const height = popoverContentRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      const shouldOpenAbove = rect.bottom + height > viewportHeight && rect.top > height;

      setPopoverPosition({
        top: shouldOpenAbove 
          ? window.scrollY + rect.top - height - 8 
          : window.scrollY + rect.bottom + 8,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(viewDate),
    end: endOfMonth(viewDate),
  });

  const handleDateSelect = (date: Date) => {
    // Combine selected date with current time buffer
    const [hours, minutes] = timeValue.split(':').map(Number);
    const finalDate = setMinutes(setHours(date, hours), minutes);
    
    // Update local state AND parent state
    setViewDate(finalDate);
    onChange(finalDate);
  };

  const handleTimeChange = (newTime: string) => {
    setTimeValue(newTime);
    const dateToUpdate = value || viewDate || new Date();
    
    let finalDate;
    if (newTime === '') {
      finalDate = isStartDate ? getStartOfLocalDay(dateToUpdate) : getEndOfLocalDay(dateToUpdate);
    } else {
      const [hours, minutes] = newTime.split(':').map(Number);
      finalDate = setMinutes(setHours(dateToUpdate, hours), minutes);
    }
    
    // Update local state AND parent state
    setViewDate(finalDate);
    onChange(finalDate);
  };

  const displayValue = value ? format(value, 'MMM d, yyyy HH:mm') : placeholder;

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      >
        <span>{displayValue}</span>
        <CalendarIcon className="h-4 w-4 text-slate-500" />
      </button>

      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-50" 
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('.popover-content')) return;
            onToggle();
          }}
        >
          <div 
            ref={popoverContentRef}
            className="popover-content absolute z-[60] bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-4 rounded-lg shadow-xl border border-slate-300 dark:border-slate-700 w-72"
            style={{
              top: `${popoverPosition.top}px`,
              left: `${popoverPosition.left}px`,
            }}
          >
            {/* Calendar Grid */}
            <div className="calendar-header flex justify-between items-center mb-4">
              <button type="button" className="hover:text-indigo-500" onClick={() => setViewDate(subMonths(viewDate, 1))}>&lt;</button>
              <span className="font-semibold">{format(viewDate, 'MMMM yyyy')}</span>
              <button type="button" className="hover:text-indigo-500" onClick={() => setViewDate(addMonths(viewDate, 1))}>&gt;</button>
            </div>
            <div className="calendar-grid grid grid-cols-7 gap-1 text-center">
              {['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'].map((day, index) => (
                <div key={`${day}-${index}`} className="text-slate-500 dark:text-slate-400 text-xs">{day}</div>
              ))}
              {daysInMonth.map((day, index) => (
                <div 
                  key={`${day.toISOString()}-${index}`} 
                  className={cn(
                    "p-2 rounded cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700",
                    value && isSameDay(day, value) ? "bg-indigo-600 text-white" : ""
                  )}
                  onClick={() => handleDateSelect(day)}
                >
                  {format(day, 'd')}
                </div>
              ))}
            </div>
            
            {/* Time Selection */}
            <div className="time-picker mt-6 border-t border-slate-300 dark:border-slate-700 pt-4">
              <label className="text-sm text-slate-700 dark:text-slate-400 block mb-2">Time</label>
              <input 
                type="time" 
                value={timeValue}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
