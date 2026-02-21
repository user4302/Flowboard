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

export const LIST_COLORS = [
  'bg-slate-100',
  'bg-blue-50',
  'bg-green-50',
  'bg-yellow-50',
  'bg-purple-50',
  'bg-pink-50',
] as const;

export const VIEWS = [
  { id: 'kanban', name: 'Kanban', icon: 'LayoutGrid' },
  { id: 'timeline', name: 'Timeline', icon: 'Calendar' },
  { id: 'calendar', name: 'Calendar', icon: 'CalendarDays' },
  { id: 'table', name: 'Table', icon: 'Table' },
] as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

export const STORAGE_KEYS = {
  BOARDS: 'flowboard-boards',
  CURRENT_BOARD: 'flowboard-current-board',
  UI_STATE: 'flowboard-ui-state',
  THEME: 'flowboard-theme',
} as const;
