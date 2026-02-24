/**
 * Application constants - Centralized configuration values
 * Contains color palettes, view configurations, animation settings, breakpoints, and storage keys
 */

/**
 * Available label colors for cards
 * Provides a consistent color palette for card labels
 */
export const LABEL_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-teal-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
] as const;

/**
 * Available list background colors
 * Provides subtle background colors for list differentiation
 */
export const LIST_COLORS = [
  'bg-slate-100',
  'bg-blue-50',
  'bg-green-50',
  'bg-yellow-50',
  'bg-purple-50',
  'bg-pink-50',
] as const;

/**
 * Available board views
 * Defines the different view modes available for board display
 */
export const VIEWS = [
  { id: 'kanban', name: 'Kanban', icon: 'LayoutGrid' },
  { id: 'timeline', name: 'Timeline', icon: 'Calendar' },
  { id: 'calendar', name: 'Calendar', icon: 'CalendarDays' },
  { id: 'table', name: 'Table', icon: 'Table' },
] as const;

/**
 * Animation duration constants
 * Defines consistent timing for UI animations
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/**
 * Responsive breakpoint constants
 * Defines screen size breakpoints for responsive design
 */
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

/**
 * Local storage key constants
 * Defines keys used for persistent storage
 */
export const STORAGE_KEYS = {
  BOARDS: 'flowboard-boards',
  CURRENT_BOARD: 'flowboard-current-board',
  UI_STATE: 'flowboard-ui-state',
  THEME: 'flowboard-theme',
} as const;
