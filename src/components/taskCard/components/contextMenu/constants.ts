/**
 * Dimension constants for context menu and label manager positioning
 */
export const DIMENSIONS = {
  /** Approximate width of the context menu */
  CONTEXT_MENU_WIDTH: 200,
  /** Width of the label manager popup */
  LABEL_MANAGER_WIDTH: 320,
  /** Approximate height of the label manager popup */
  LABEL_MANAGER_HEIGHT: 408,
  /** Width of the date picker popup */
  DATE_PICKER_WIDTH: 320,
  /** Approximate height of the date picker popup */
  DATE_PICKER_HEIGHT: 280,
  /** Small gap between context menu and popups */
  MENU_MARGIN: 4,
  /** Minimum distance from viewport edges */
  VIEWPORT_MARGIN: 8,
} as const;

/**
 * Z-index constants for proper layering
 */
export const Z_INDEX = {
  /** Context menu backdrop */
  BACKDROP: 40,
  /** Context menu and label manager */
  MODAL: 50,
} as const;

/**
 * CSS class constants for styling
 */
export const CSS_CLASSES = {
  /** Base menu item class */
  MENU_ITEM: 'w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
  /** Default menu item variant */
  MENU_ITEM_DEFAULT: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700',
  /** Danger menu item variant */
  MENU_ITEM_DANGER: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
  /** Icon class */
  ICON: 'h-4 w-4 flex-shrink-0',
} as const;
