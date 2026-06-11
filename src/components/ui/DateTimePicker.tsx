import React, { useState, useRef, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, setHours, setMinutes } from 'date-fns';
import { getStartOfLocalDay, getEndOfLocalDay } from '../../lib/dateUtils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  value?: Date | null;
  onChange: (date: Date) => void;
  isStartDate?: boolean;
  placeholder?: string;
}

/**
 * DateTimePicker component
 * A premium, dark-themed popover for date and time selection.
 */
export const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange, isStartDate = true, placeholder = "Select date & time" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [time, setTime] = useState(value ? format(value, 'HH:mm') : '12:00');
  const [timeInteracted, setTimeInteracted] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handleDateSelect = (date: Date) => {
    let finalDate = date;
    if (timeInteracted || value) {
      const [hours, minutes] = time.split(':').map(Number);
      finalDate = setMinutes(setHours(finalDate, hours), minutes);
    } else {
      finalDate = isStartDate ? getStartOfLocalDay(finalDate) : getEndOfLocalDay(finalDate);
    }
    onChange(finalDate);
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (newTime === '') {
      setTimeInteracted(false);
      if (value) {
        // Reset to boundary default if time is cleared
        onChange(isStartDate ? getStartOfLocalDay(value) : getEndOfLocalDay(value));
      }
    } else {
      setTimeInteracted(true);
      if (value) {
        const [hours, minutes] = newTime.split(':').map(Number);
        onChange(setMinutes(setHours(value, hours), minutes));
      }
    }
  };

  const displayValue = value 
    ? format(value, timeInteracted || (value && format(value, 'HH:mm') !== '00:00' && format(value, 'HH:mm') !== '23:59') ? 'MMM d, yyyy HH:mm' : 'MMM d, yyyy') 
    : placeholder;

  return (
    <div className="relative w-full" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      >
        <span>{displayValue}</span>
        <CalendarIcon className="h-4 w-4 text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-4 rounded-lg shadow-xl border border-slate-300 dark:border-slate-700 w-72">
          {/* Calendar Grid */}
          <div className="calendar-header flex justify-between items-center mb-4">
            <button type="button" className="hover:text-indigo-500" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>&lt;</button>
            <span className="font-semibold">{format(currentDate, 'MMMM yyyy')}</span>
            <button type="button" className="hover:text-indigo-500" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>&gt;</button>
          </div>
          <div className="calendar-grid grid grid-cols-7 gap-1 text-center">
            {['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'].map((day, index) => (
              <div key={`${day}-${index}`} className="text-slate-500 dark:text-slate-400 text-xs">{day}</div>
            ))}
            {daysInMonth.map((day, index) => (
              <div 
                key={`${day.toISOString()}-${index}`} 
                className={`p-2 rounded cursor-pointer ${
                  value && day.toDateString() === value.toDateString() 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
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
              value={time}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      )}
    </div>
  );
};
