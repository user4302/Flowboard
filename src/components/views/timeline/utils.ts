import { isSameDay, isSameWeek, isSameMonth, addDays } from 'date-fns';
import { normalizeForDisplay } from '@/lib/dateUtils';
import { Card, Label } from '@/lib/types';

/**
 * Helper function to calculate timeline height based on task stacking
 * 
 * @param tasks - Array of tasks to stack
 * @param dateRange - Current visible date range
 * @returns Height in pixels
 */
export const calculateTimelineHeight = (tasks: Card[], dateRange: Date[]) => {
  if (tasks.length === 0) return 60;

  const taskHeight = 32; // h-8 = 32px
  const taskGap = 4; // gap between stacked tasks
  const padding = 16; // 8px top + 8px bottom

  let maxStackLevel = 0;
  const taskPositions: { [key: string]: number } = {}; // To store the assigned stack level for each task

  tasks.forEach((task) => {
    const taskStartDate = task.startDate || new Date();
    const taskEndDate = task.dueDate || addDays(taskStartDate, 7);

    let stackLevel = 0;
    let positionFound = false;

    // Try to find an available stack level
    while (!positionFound) {
      let overlap = false;
      for (const existingTaskId in taskPositions) {
        const existingTask = tasks.find(t => t.id === existingTaskId);
        if (!existingTask) continue;

        const existingTaskStartDate = existingTask.startDate || new Date();
        const existingTaskEndDate = existingTask.dueDate || addDays(existingTaskStartDate, 7);

        // Check for overlap in the current stack level
        if (taskPositions[existingTaskId] === stackLevel) {
          // Check if the date ranges actually overlap within the timeline's dateRange
          const taskStartIdx = dateRange.findIndex(date => isSameDay(date, taskStartDate));
          const taskEndIdx = dateRange.findIndex(date => isSameDay(date, taskEndDate));
          const existingTaskStartIdx = dateRange.findIndex(date => isSameDay(date, existingTaskStartDate));
          const existingTaskEndIdx = dateRange.findIndex(date => isSameDay(date, existingTaskEndDate));

          const start = Math.max(taskStartIdx, existingTaskStartIdx);
          const end = Math.min(taskEndIdx, existingTaskEndIdx);

          if (start <= end) {
            overlap = true;
            break;
          }
        }
      }

      if (!overlap) {
        taskPositions[task.id] = stackLevel;
        positionFound = true;
      } else {
        stackLevel++;
      }
    }

    maxStackLevel = Math.max(maxStackLevel, stackLevel);
  });

  return padding + ((maxStackLevel + 1) * (taskHeight + taskGap));
};

// Helper function to find date indices for day view
const findDayIndices = (dateRange: Date[], taskStartDate: Date, taskEndDate: Date) => {
  const startIndex = dateRange.findIndex(date => isSameDay(date, taskStartDate));
  const endIndex = dateRange.findIndex(date => isSameDay(date, taskEndDate));
  return { startIndex, endIndex };
};

// Helper function to find date indices for week view
const findWeekIndices = (dateRange: Date[], taskStartDate: Date, taskEndDate: Date) => {
  const startIndex = dateRange.findIndex(date => isSameDay(date, taskStartDate));
  const endIndex = dateRange.findIndex(date => isSameDay(date, taskEndDate));
  return { startIndex, endIndex };
};

// Helper function to find date indices for 2-week view
const findTwoWeekIndices = (dateRange: Date[], taskStartDate: Date, taskEndDate: Date) => {
  const startIndex = dateRange.findIndex(date => isSameDay(date, taskStartDate));
  const endIndex = dateRange.findIndex(date => isSameDay(date, taskEndDate));
  return { startIndex, endIndex };
};

// Helper function to find date indices for month view
const findMonthIndices = (dateRange: Date[], taskStartDate: Date, taskEndDate: Date) => {
  const startIndex = dateRange.findIndex(date => isSameDay(date, taskStartDate));
  const endIndex = dateRange.findIndex(date => isSameDay(date, taskEndDate));
  return { startIndex, endIndex };
};

// Helper function to find date indices for year view
const findYearIndices = (dateRange: Date[], taskStartDate: Date, taskEndDate: Date) => {
  const startIndex = dateRange.findIndex(date => isSameMonth(date, taskStartDate));
  const endIndex = dateRange.findIndex(date => isSameMonth(date, taskEndDate));
  return { startIndex, endIndex };
};

// Helper function to calculate horizontal position and width
const calculateHorizontalPosition = (
  taskStartDate: Date,
  taskEndDate: Date,
  dateRange: Date[],
  startIndex: number,
  endIndex: number,
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year'
) => {
  const rangeStart = dateRange[0];
  const rangeEnd = dateRange[dateRange.length - 1];

  let left = 0;
  let width = 5;

  // Special handling for day view - tasks should stack vertically, not overlap horizontally
  if (zoomLevel === 'day') {
    left = 0;
    width = 100;
  } else {
    // Logic for all views: past tasks on left edge, future tasks on right edge

    // If task is entirely after the visible range (in the future), collect on right edge
    if (taskEndDate > rangeEnd && startIndex >= 0) {
      left = (startIndex / dateRange.length) * 100; // Normal positioning
      // If endIndex is -1 (not found), calculate width based on days from start to range end
      let daysSpanned;
      if (endIndex === -1) {
        // Task ends beyond visible range, span to end of range
        daysSpanned = dateRange.length - startIndex;
      } else {
        daysSpanned = endIndex - startIndex + 1;
      }
      left = (startIndex / dateRange.length) * 100;
      width = (daysSpanned / dateRange.length) * 100;
    }
    // If task is entirely after the visible range (in the future), collect on right edge
    else if (taskStartDate > rangeEnd) {
      left = ((dateRange.length - 1) / dateRange.length) * 100; // Right edge
      width = 5;
    }
    // If task is entirely before the visible range (in the past), collect on left edge
    else if (taskEndDate < rangeStart) {
      left = 0; // Left edge
      width = 5;
    }
    // If task starts before but ends within range, start at left edge and span to end position
    else if (taskStartDate < rangeStart && endIndex >= 0) {
      left = 0; // Left edge
      // Calculate width based on actual task duration, not just visible portion
      const taskDuration = Math.ceil((taskEndDate.getTime() - taskStartDate.getTime()) / (1000 * 60 * 60 * 24));
      const dayWidth = 100 / dateRange.length; // Width of one day in percentage
      width = Math.min(taskDuration * dayWidth, ((endIndex + 1) / dateRange.length) * 100);
    }
    // If task starts within range but ends after, start at start position and span to right edge
    else if (taskEndDate > rangeEnd && startIndex >= 0) {
      left = (startIndex / dateRange.length) * 100; // Normal positioning
      // If endIndex is -1 (not found), calculate width based on days from start to range end
      if (endIndex === -1) {
        // Task ends beyond visible range, span to end of range
        const daysSpanned = dateRange.length - startIndex;
        left = (startIndex / dateRange.length) * 100;
        width = (daysSpanned / dateRange.length) * 100;
      } else {
        const daysSpanned = endIndex - startIndex + 1;
        left = (startIndex / dateRange.length) * 100;
        width = (daysSpanned / dateRange.length) * 100;
      }
    }
    // If task spans the entire visible range (starts before, ends after)
    else if (taskStartDate < rangeStart && taskEndDate > rangeEnd) {
      left = 0; // Left edge
      width = 100; // Full width
    } else {
      // Normal positioning for tasks within range
      let daysSpanned;
      if (endIndex === -1) {
        // Task ends beyond visible range, span to end of range
        daysSpanned = dateRange.length - startIndex;
      } else {
        daysSpanned = endIndex - startIndex + 1;
      }

      left = (startIndex / dateRange.length) * 100;
      width = (daysSpanned / dateRange.length) * 100;
    }
  }

  return { left, width };
};

// Helper function to calculate vertical stacking position
const calculateVerticalPosition = (
  task: Card,
  allTasks: Card[],
  taskIndex: number,
  dateRange: Date[],
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year'
) => {
  let stackLevel = 0;
  const taskHeight = 32; // h-8 = 32px
  const taskGap = 4; // gap between stacked tasks
  const taskPositions: { [key: string]: number } = {}; // To store the assigned stack level for each task

  // Calculate stack level for the current task
  allTasks.slice(0, taskIndex + 1).forEach((currentTask) => {
    const currentTaskStartDate = currentTask.startDate || new Date();
    const currentTaskEndDate = currentTask.dueDate || addDays(currentTaskStartDate, 7);

    let currentStackLevel = 0;
    let positionFound = false;

    // Try to find an available stack level
    while (!positionFound) {
      let overlap = false;
      for (const existingTaskId in taskPositions) {
        const existingTask = allTasks.find(t => t.id === existingTaskId);
        if (!existingTask) continue;

        const existingTaskStartDate = existingTask.startDate || new Date();
        const existingTaskEndDate = existingTask.dueDate || addDays(existingTaskStartDate, 7);

        // Check for overlap in the current stack level
        if (taskPositions[existingTaskId] === currentStackLevel) {
          // Check if the date ranges actually overlap within the timeline's dateRange
          let currentTaskStartIdx = -1;
          let currentTaskEndIdx = -1;
          let existingTaskStartIdx = -1;
          let existingTaskEndIdx = -1;

          // Find indices based on zoom level
          switch (zoomLevel) {
            case 'day':
              currentTaskStartIdx = dateRange.findIndex(date => isSameDay(date, currentTaskStartDate));
              currentTaskEndIdx = dateRange.findIndex(date => isSameDay(date, currentTaskEndDate));
              existingTaskStartIdx = dateRange.findIndex(date => isSameDay(date, existingTaskStartDate));
              existingTaskEndIdx = dateRange.findIndex(date => isSameDay(date, existingTaskEndDate));
              break;
            case 'week':
              currentTaskStartIdx = dateRange.findIndex(date => isSameDay(date, currentTaskStartDate));
              currentTaskEndIdx = dateRange.findIndex(date => isSameDay(date, currentTaskEndDate));
              existingTaskStartIdx = dateRange.findIndex(date => isSameDay(date, existingTaskStartDate));
              existingTaskEndIdx = dateRange.findIndex(date => isSameDay(date, existingTaskEndDate));
              break;
            case 'month':
              currentTaskStartIdx = dateRange.findIndex(date => isSameWeek(date, currentTaskStartDate));
              currentTaskEndIdx = dateRange.findIndex(date => isSameWeek(date, currentTaskEndDate));
              existingTaskStartIdx = dateRange.findIndex(date => isSameWeek(date, existingTaskStartDate));
              existingTaskEndIdx = dateRange.findIndex(date => isSameWeek(date, existingTaskEndDate));
              break;
            case '2weeks':
              currentTaskStartIdx = dateRange.findIndex(date => isSameDay(date, currentTaskStartDate));
              currentTaskEndIdx = dateRange.findIndex(date => isSameDay(date, currentTaskEndDate));
              existingTaskStartIdx = dateRange.findIndex(date => isSameDay(date, existingTaskStartDate));
              existingTaskEndIdx = dateRange.findIndex(date => isSameDay(date, existingTaskEndDate));
              break;
            case 'year':
              currentTaskStartIdx = dateRange.findIndex(date => isSameMonth(date, currentTaskStartDate));
              currentTaskEndIdx = dateRange.findIndex(date => isSameMonth(date, currentTaskEndDate));
              existingTaskStartIdx = dateRange.findIndex(date => isSameMonth(date, existingTaskStartDate));
              existingTaskEndIdx = dateRange.findIndex(date => isSameMonth(date, existingTaskEndDate));
              break;
          }

          // Handle out-of-range indices - tasks completely outside range should not overlap
          if (currentTaskStartIdx === -1 || currentTaskEndIdx === -1 || existingTaskStartIdx === -1 || existingTaskEndIdx === -1) {
            continue;
          }

          const start = Math.max(currentTaskStartIdx, existingTaskStartIdx);
          const end = Math.min(currentTaskEndIdx, existingTaskEndIdx);

          if (start <= end) {
            overlap = true;
            break;
          }
        }
      }

      if (!overlap) {
        taskPositions[currentTask.id] = currentStackLevel;
        if (currentTask.id === task.id) {
          stackLevel = currentStackLevel;
        }
        positionFound = true;
      } else {
        currentStackLevel++;
      }
    }
  });

  const top = 8 + (stackLevel * (taskHeight + taskGap)); // Start 8px from top, add task height + gap for each level
  return top;
};

// Calculate day view task positioning
const calculateDayPosition = (
  task: Card,
  allTasks: Card[],
  taskIndex: number,
  dateRange: Date[],
  taskStartDate: Date,
  taskEndDate: Date
) => {
  const { startIndex, endIndex } = findDayIndices(dateRange, taskStartDate, taskEndDate);
  const { left, width } = calculateHorizontalPosition(taskStartDate, taskEndDate, dateRange, startIndex, endIndex, 'day');
  const top = calculateVerticalPosition(task, allTasks, taskIndex, dateRange, 'day');

  return {
    left: `${left}%`,
    width: `${Math.max(width, 2)}%`,
    top: `${top}px`
  };
};

// Calculate week view task positioning
const calculateWeekPosition = (
  task: Card,
  allTasks: Card[],
  taskIndex: number,
  dateRange: Date[],
  taskStartDate: Date,
  taskEndDate: Date
) => {
  const { startIndex, endIndex } = findWeekIndices(dateRange, taskStartDate, taskEndDate);
  const { left, width } = calculateHorizontalPosition(taskStartDate, taskEndDate, dateRange, startIndex, endIndex, 'week');
  const top = calculateVerticalPosition(task, allTasks, taskIndex, dateRange, 'week');

  return {
    left: `${left}%`,
    width: `${Math.max(width, 2)}%`,
    top: `${top}px`
  };
};

// Calculate 2-week view task positioning
const calculateTwoWeekPosition = (
  task: Card,
  allTasks: Card[],
  taskIndex: number,
  dateRange: Date[],
  taskStartDate: Date,
  taskEndDate: Date
) => {
  const { startIndex, endIndex } = findTwoWeekIndices(dateRange, taskStartDate, taskEndDate);
  const { left, width } = calculateHorizontalPosition(taskStartDate, taskEndDate, dateRange, startIndex, endIndex, '2weeks');
  const top = calculateVerticalPosition(task, allTasks, taskIndex, dateRange, '2weeks');

  return {
    left: `${left}%`,
    width: `${Math.max(width, 2)}%`,
    top: `${top}px`
  };
};

// Calculate month view task positioning
const calculateMonthPosition = (
  task: Card,
  allTasks: Card[],
  taskIndex: number,
  dateRange: Date[],
  taskStartDate: Date,
  taskEndDate: Date
) => {
  const { startIndex, endIndex } = findMonthIndices(dateRange, taskStartDate, taskEndDate);
  const { left, width } = calculateHorizontalPosition(taskStartDate, taskEndDate, dateRange, startIndex, endIndex, 'month');
  const top = calculateVerticalPosition(task, allTasks, taskIndex, dateRange, 'month');

  return {
    left: `${left}%`,
    width: `${Math.max(width, 2)}%`,
    top: `${top}px`
  };
};

// Calculate year view task positioning
const calculateYearPosition = (
  task: Card,
  allTasks: Card[],
  taskIndex: number,
  dateRange: Date[],
  taskStartDate: Date,
  taskEndDate: Date
) => {
  const { startIndex, endIndex } = findYearIndices(dateRange, taskStartDate, taskEndDate);
  const { left, width } = calculateHorizontalPosition(taskStartDate, taskEndDate, dateRange, startIndex, endIndex, 'year');
  const top = calculateVerticalPosition(task, allTasks, taskIndex, dateRange, 'year');

  return {
    left: `${left}%`,
    width: `${Math.max(width, 2)}%`,
    top: `${top}px`
  };
};

/**
 * Calculate task position and width on timeline
 */
export const getTaskPosition = (
  task: Card,
  allTasks: Card[],
  taskIndex: number,
  dateRange: Date[],
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year'
) => {
  // Use normalizeForDisplay to ensure dates are properly handled
  const taskStartDate = normalizeForDisplay(task.startDate) || new Date();
  const taskEndDate = normalizeForDisplay(task.dueDate) || addDays(taskStartDate, 7);

  // Validate dates - be more permissive
  if (isNaN(taskStartDate.getTime())) {
    console.warn('Invalid task start date detected, using fallback:', task.startDate);
    return { left: '0%', width: '100%', top: '8px' }; // Fallback position
  }

  if (isNaN(taskEndDate.getTime())) {
    console.warn('Invalid task end date detected, using fallback:', task.dueDate);
    return { left: '0%', width: '100%', top: '8px' }; // Fallback position
  }

  // Delegate to the appropriate handler based on zoom level
  switch (zoomLevel) {
    case 'day':
      return calculateDayPosition(task, allTasks, taskIndex, dateRange, taskStartDate, taskEndDate);
    case 'week':
      return calculateWeekPosition(task, allTasks, taskIndex, dateRange, taskStartDate, taskEndDate);
    case '2weeks':
      return calculateTwoWeekPosition(task, allTasks, taskIndex, dateRange, taskStartDate, taskEndDate);
    case 'month':
      return calculateMonthPosition(task, allTasks, taskIndex, dateRange, taskStartDate, taskEndDate);
    case 'year':
      return calculateYearPosition(task, allTasks, taskIndex, dateRange, taskStartDate, taskEndDate);
    default:
      // Fallback to day view if zoom level is unrecognized
      return calculateDayPosition(task, allTasks, taskIndex, dateRange, taskStartDate, taskEndDate);
  }
};

/**
 * Color mapping for timeline bars
 * Maps Tailwind color names to hex values
 */
const COLOR_MAP: { [key: string]: string } = {
  'green': '#10b981',
  'yellow': '#f59e0b',
  'orange': '#f97316',
  'red': '#ef4444',
  'purple': '#a855f7',
  'sky': '#0ea5e9',
  'blue': '#3b82f6',
  'teal': '#14b8a6',
  'pink': '#ec4899',
  'slate': '#64748b',
};

/**
 * Get contrasting text color for background
 */
const getContrastColor = (bgColor: string): string => {
  // Convert hex to RGB
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

/**
 * Get task color and contrasting text color
 */
export const getTaskColor = (task: Card, boardLabels: Label[] = []) => {
  if (task.labelIds?.length > 0) {
    const firstLabelId = task.labelIds[0];
    const label = boardLabels.find(l => l.id === firstLabelId);
    if (label) {
      // Extract color name from Tailwind class (e.g., 'bg-green-500' -> 'green')
      const colorName = label.color.replace('bg-', '').replace(/-\d+$/, '');
      const bgColor = COLOR_MAP[colorName] || COLOR_MAP['slate'];
      const textColor = getContrastColor(bgColor);

      return {
        background: bgColor,
        text: textColor
      };
    }
  }

  // Neutral fallback
  return {
    background: '#e5e7eb',
    text: '#000000'
  };
};
