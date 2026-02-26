import { useMemo } from 'react';
import { addDays } from 'date-fns';
import { Card } from '@/lib/types';

/**
 * useHiddenTasks hook - Calculates which tasks are hidden outside the current date range
 * Separates tasks into those before and after the visible timeline range
 * Optimized with useMemo to prevent unnecessary recalculations
 * 
 * @param listTasks - Array of tasks to filter
 * @param dateRange - Current visible date range
 * @returns Object with arrays of hidden tasks before and after the range
 */
export function useHiddenTasks(listTasks: Card[], dateRange: Date[]) {
  return useMemo(() => {
    // Early return if no date range is provided
    if (dateRange.length === 0) {
      return { hiddenTasksBefore: [], hiddenTasksAfter: [] };
    }

    // Get the start and end of the visible date range
    const rangeStart = dateRange[0];
    const rangeEnd = dateRange[dateRange.length - 1];

    // Filter tasks that end before the visible range starts
    const hiddenTasksBefore = listTasks.filter(task => {
      // Dates are already Date objects from localStorage conversion
      const taskStartDate = task.startDate || new Date();
      const taskEndDate = task.dueDate || addDays(taskStartDate, 7);

      // Validate dates
      if (isNaN(taskStartDate.getTime()) || isNaN(taskEndDate.getTime())) {
        return false; // Skip tasks with invalid dates
      }

      return taskEndDate < rangeStart;
    });

    // Filter tasks that start after the visible range ends
    const hiddenTasksAfter = listTasks.filter(task => {
      // Dates are already Date objects from localStorage conversion
      const taskStart = task.startDate || new Date();

      // Validate dates
      if (isNaN(taskStart.getTime())) {
        return false; // Skip tasks with invalid dates
      }

      return taskStart > rangeEnd;
    });

    return { hiddenTasksBefore, hiddenTasksAfter };
  }, [listTasks, dateRange]);
}
