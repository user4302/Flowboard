import { FilterOption, StatusValue, DueDateValue } from './types';

export const STATUS_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'completed', label: 'Completed' }
];

export const TIMELINE_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Any time', icon: 'Clock' },
  { value: 'overdue', label: 'Overdue', icon: 'X' },
  { value: 'today', label: 'Today', icon: 'Calendar' },
  { value: 'week', label: 'This Week', icon: 'Calendar' },
  { value: 'month', label: 'This Month', icon: 'Calendar' }
];

export const PRIORITY_RANGE = {
  MIN: 1,
  MAX: 100
} as const;

export const DROPDOWN_Z_INDEX = 9999;
export const DROPDOWN_MIN_WIDTH = 220;
