/**
 * SearchAndFilter component types
 */

/**
 * Props for the SearchAndFilter component
 */
export interface SearchAndFilterProps {
  /** ID of the board to search/filter */
  boardId: string;
  /** Additional CSS class names */
  className?: string;
  /** Whether to render in compact mode */
  compact?: boolean;
  /** Whether to render in inline mode (disables fixed overlay) */
  inline?: boolean;
}

/**
 * Dropdown position coordinates
 */
export interface DropdownPosition {
  /** Top position in pixels */
  top: number;
  /** Left position in pixels */
  left: number;
  /** Width in pixels */
  width: number;
  /** Optional minimum width */
  minWidth?: number;
}

/**
 * Filter option for dropdown selections
 */
export interface FilterOption {
  /** Value of the filter option */
  value: string;
  /** Display label for the option */
  label: string;
  /** Optional icon identifier string */
  icon?: string;
}

/**
 * Status filter value type
 */
export type StatusValue = 'all' | 'incomplete' | 'completed';

/**
 * Due date filter value type
 */
export type DueDateValue = 'all' | 'overdue' | 'today' | 'week' | 'month';
