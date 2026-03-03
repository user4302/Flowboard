'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, X } from 'lucide-react';
import { useClickOutside } from '@/hooks';
import { cn } from '@/lib/utils';
import { LabelManagerPosition } from '../types';

/**
 * Props for the DatePickerModal component
 */
interface DatePickerModalProps {
  /** Whether the date picker should be shown */
  show: boolean;
  /** Position where the date picker should appear */
  position: LabelManagerPosition;
  /** Current start date value */
  startDate?: Date;
  /** Current end date value */
  dueDate?: Date;
  /** Function to call when dates are updated */
  onDatesChange: (startDate?: Date, dueDate?: Date) => void;
  /** Function to call when the date picker should close */
  onClose: () => void;
}

/**
 * DatePickerModal component - Allows editing start and due dates for a card
 * 
 * Renders a modal with date input fields positioned next to the context menu
 * Uses click-outside detection to close when clicking outside
 */
export function DatePickerModal({
  show,
  position,
  startDate,
  dueDate,
  onDatesChange,
  onClose,
}: DatePickerModalProps) {
  const dateModalRef = useClickOutside<HTMLDivElement>(onClose);
  const isUpdatingRef = useRef(false);

  // Local state for form inputs
  const [localStartDate, setLocalStartDate] = useState<string>('');
  const [localDueDate, setLocalDueDate] = useState<string>('');

  // Initialize local state when props change
  useEffect(() => {
    // Use setTimeout to avoid calling setState synchronously
    const timeoutId = setTimeout(() => {
      if (startDate) {
        setLocalStartDate(startDate.toISOString().split('T')[0]);
      } else {
        setLocalStartDate('');
      }

      if (dueDate) {
        setLocalDueDate(dueDate.toISOString().split('T')[0]);
      } else {
        setLocalDueDate('');
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [startDate, dueDate]);

  const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const value = e.target.value;
    setLocalStartDate(value);

    if (value) {
      const newStartDate = new Date(value);
      onDatesChange(newStartDate, dueDate);
    } else {
      onDatesChange(undefined, dueDate);
    }

    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);
  }, [dueDate, onDatesChange]);

  const handleDueDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const value = e.target.value;
    setLocalDueDate(value);

    if (value) {
      const newDueDate = new Date(value);
      onDatesChange(startDate, newDueDate);
    } else {
      onDatesChange(startDate, undefined);
    }

    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);
  }, [startDate, onDatesChange]);

  // Early return after all hooks
  if (!show) {
    return null;
  }

  const handleClearDates = () => {
    setLocalStartDate('');
    setLocalDueDate('');
    onDatesChange(undefined, undefined);
  };

  const formatDateForDisplay = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return createPortal(
    <div
      ref={dateModalRef}
      className="fixed z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 p-4 w-80 pointer-events-auto"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Dates
          </h3>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Date Fields */}
      <div className="space-y-3">
        {/* Start Date */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={localStartDate}
            onChange={handleStartDateChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {startDate && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {formatDateForDisplay(startDate)}
            </p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={localDueDate}
            onChange={handleDueDateChange}
            min={localStartDate} // Due date can't be before start date
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {dueDate && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {formatDateForDisplay(dueDate)}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 dark:border-slate-600">
        <button
          onClick={handleClearDates}
          className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
        >
          Clear dates
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30"
        >
          Done
        </button>
      </div>
    </div>,
    document.body
  );
}
