import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, setHours, setMinutes } from 'date-fns';
import { getStartOfLocalDay, getEndOfLocalDay } from '../../lib/dateUtils';

interface DateTimePickerProps {
  value?: Date | null;
  onChange: (date: Date) => void;
  isStartDate?: boolean;
}

/**
 * DateTimePicker component
 * A premium, dark-themed popover for date and time selection.
 */
export const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange, isStartDate = true }) => {
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [time, setTime] = useState(format(value || new Date(), 'HH:mm'));
  const [timeInteracted, setTimeInteracted] = useState(false);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handleDateSelect = (date: Date) => {
    let finalDate = date;
    if (timeInteracted) {
      const [hours, minutes] = time.split(':').map(Number);
      finalDate = setMinutes(setHours(finalDate, hours), minutes);
    } else {
      finalDate = isStartDate ? getStartOfLocalDay(finalDate) : getEndOfLocalDay(finalDate);
    }
    onChange(finalDate);
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    setTimeInteracted(true);
    if (value) {
        const [hours, minutes] = newTime.split(':').map(Number);
        onChange(setMinutes(setHours(value, hours), minutes));
    }
  };

  return (
    <div className="datetime-picker-container bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-4 rounded-lg shadow-xl border border-slate-300 dark:border-slate-700 w-72">
      {/* Calendar Grid */}
      <div className="calendar-header flex justify-between items-center mb-4">
        <button className="hover:text-indigo-500" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>&lt;</button>
        <span className="font-semibold">{format(currentDate, 'MMMM yyyy')}</span>
        <button className="hover:text-indigo-500" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>&gt;</button>
      </div>
      <div className="calendar-grid grid grid-cols-7 gap-1 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-slate-500 dark:text-slate-400 text-xs">{day}</div>
        ))}
        {daysInMonth.map(day => (
          <div 
            key={day.toISOString()} 
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
  );
};
