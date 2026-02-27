export interface SearchAndFilterBarProps {
  boardId: string;
  className?: string;
  compact?: boolean;
}

export interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  minWidth?: number;
}

export interface FilterOption {
  value: string;
  label: string;
  icon?: any;
}

export type StatusValue = 'all' | 'incomplete' | 'completed';
export type DueDateValue = 'all' | 'overdue' | 'today' | 'week' | 'month';
