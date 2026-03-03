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
 * Available label colors for cards
 * Provides a consistent color palette for card labels
 */
export const LABEL_COLORS = [
  // Greens
  'bg-green-100', 'bg-green-300', 'bg-green-500', 'bg-green-600', 'bg-green-800',
  // Yellows
  'bg-yellow-100', 'bg-yellow-300', 'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-800',
  // Oranges
  'bg-orange-100', 'bg-orange-300', 'bg-orange-500', 'bg-orange-600', 'bg-orange-800',
  // Reds
  'bg-red-100', 'bg-red-300', 'bg-red-500', 'bg-red-600', 'bg-red-800',
  // Purples
  'bg-purple-100', 'bg-purple-300', 'bg-purple-500', 'bg-purple-600', 'bg-purple-800',
  // Azures/Blues
  'bg-sky-100', 'bg-sky-300', 'bg-sky-500', 'bg-sky-600', 'bg-sky-800',
  'bg-blue-100', 'bg-blue-300', 'bg-blue-500', 'bg-blue-600', 'bg-blue-800',
  // Teals
  'bg-teal-100', 'bg-teal-300', 'bg-teal-500', 'bg-teal-600', 'bg-teal-800',
  // Pinks
  'bg-pink-100', 'bg-pink-300', 'bg-pink-500', 'bg-pink-600', 'bg-pink-800',
  // Slate/Grays
  'bg-slate-100', 'bg-slate-300', 'bg-slate-500', 'bg-slate-600', 'bg-slate-800',
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

