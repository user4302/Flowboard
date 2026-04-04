/**
 * Application constants - Centralized configuration values
 * Contains color palettes, view configurations, animation settings, breakpoints, and storage keys
 */

import packageJson from '../../package.json';

/**
 * Application version - automatically derived from package.json
 * Ensures consistent versioning across the entire application
 */
export const APP_VERSION = packageJson.version;

/**
 * Basic label colors for user selection
 * Provides a curated palette of commonly used colors
 * Users can also select custom colors via the color picker
 */
export const BASIC_LABEL_COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500  
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#64748b', // slate-500
  '#34d399', // teal-500
  '#a78bfa', // fuchsia-500
] as const;

/**
 * List background colors in hex format
 * Provides subtle background colors for list differentiation
 */
export const LIST_COLORS_HEX = [
  '#f1f5f9', // slate-100
  '#eff6ff', // blue-50
  '#f0fdf4', // green-50
  '#fefce8', // yellow-50
  '#faf5ff', // purple-50
  '#fdf2f8', // pink-50
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

