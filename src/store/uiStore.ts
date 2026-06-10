import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ViewState, FilterState } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { CardJSON } from '@/lib/cardJsonUtils';

/**
 * UI state interface - Extends view and filter state with modal management
 * Combines view preferences, filter options, and modal state management
 */
interface UIState extends ViewState {
  // View preferences
  currentView: 'kanban' | 'timeline' | 'calendar' | 'table';
  sidebarOpen: boolean;
  showFilterSheet: boolean;
  theme: 'light' | 'dark';

  // Filter state (per board)
  filterState: Record<string, {
    searchTerm: string;
    selectedLabels: string[];
    selectedMembers: string[];
    showOverdue: boolean;
    showCompleted: 'all' | 'completed' | 'incomplete';
    priorityThreshold: number | null;
    dueDateFilter: 'all' | 'overdue' | 'today' | 'week' | 'month';
  }>;

  // Modal state
  cardModalOpen: boolean;
  selectedCardId: string | null;
  cardJSONData: CardJSON | null;
  targetListId: string | null;
  isJSONImportMode: boolean;

  // Timeline state (per board)
  timelineState: Record<string, {
    currentDate: string;
    zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year';
    collapsedLanes: string[];
  }>;

  // Column order state (per board)
  columnOrder: Record<string, string[]>;

  // Scroll position state (per board)
  scrollPosition: Record<string, { left: number; top: number }>;

  // View actions
  setCurrentView: (view: ViewState['currentView']) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setShowFilterSheet: (show: boolean) => void;
  setTheme: (theme: ViewState['theme']) => void;

  // Timeline actions
  setTimelineCurrentDate: (boardId: string, date: string) => void;
  setTimelineZoomLevel: (boardId: string, level: 'day' | 'week' | '2weeks' | 'month' | 'year') => void;
  setTimelineCollapsedLanes: (boardId: string, lanes: string[]) => void;
  toggleTimelineLane: (boardId: string, laneId: string) => void;
  getTimelineState: (boardId: string) => { currentDate: string; zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year'; collapsedLanes: string[]; };
  clearTimelineState: (boardId: string) => void;

  // Column order actions
  setColumnOrder: (boardId: string, order: string[]) => void;
  getColumnOrder: (boardId: string) => string[];

  // Scroll position actions
  setScrollPosition: (boardId: string, position: { left: number; top: number }) => void;
  getScrollPosition: (boardId: string) => { left: number; top: number };

  // Filter actions
  setSearchTerm: (boardId: string, term: string) => void;
  setSelectedLabels: (boardId: string, labels: string[]) => void;
  setSelectedMembers: (boardId: string, members: string[]) => void;
  setShowOverdue: (boardId: string, show: boolean) => void;
  setShowCompleted: (boardId: string, status: 'all' | 'completed' | 'incomplete') => void;
  setPriorityThreshold: (boardId: string, threshold: number | null) => void;
  setDueDateFilter: (boardId: string, filter: 'all' | 'overdue' | 'today' | 'week' | 'month') => void;
  clearFilters: (boardId: string) => void;
  getFilterState: (boardId: string) => {
    searchTerm: string;
    selectedLabels: string[];
    selectedMembers: string[];
    showOverdue: boolean;
    showCompleted: 'all' | 'completed' | 'incomplete';
    priorityThreshold: number | null;
    dueDateFilter: 'all' | 'overdue' | 'today' | 'week' | 'month';
  };

  // Modal actions
  openCardModal: (cardId?: string) => void;
  openCardModalFromJSON: (cardJSON: CardJSON, listId: string) => void;
  closeCardModal: () => void;
  closeCardModalWithoutUrlUpdate: () => void;

  // Theme initialization
  initializeTheme: () => void;
}

/**
 * UI store - Zustand store for UI state management
 * Handles view preferences, filters, modal states, and theme management
 * Persists UI preferences to localStorage for consistent user experience
 */
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial view state
      currentView: 'kanban',
      sidebarOpen: true,
      showFilterSheet: false,
      theme: 'light',

      // Initial filter state (per board)
      filterState: {},

      // Initial modal state
      cardModalOpen: false,
      selectedCardId: null,
      cardJSONData: null,
      targetListId: null,
      isJSONImportMode: false,

      // Initial timeline state (per board)
      timelineState: {},

      // Initial column order state (per board)
      columnOrder: {},

      // Initial scroll position state (per board)
      scrollPosition: {},

      /**
       * Set the current view mode
       * @param view - View mode to set
       */
      setCurrentView: (view) => set({ currentView: view }),

      /**
       * Toggle sidebar visibility
       */
      toggleSidebar: () => set((state: UIState) => ({ sidebarOpen: !state.sidebarOpen })),

      /**
       * Timeline state actions
       */
      setTimelineCurrentDate: (boardId: string, date: string) => set((state: UIState) => ({
        timelineState: {
          ...state.timelineState,
          [boardId]: {
            ...state.timelineState[boardId],
            currentDate: date
          }
        }
      })),
      setTimelineZoomLevel: (boardId: string, level: 'day' | 'week' | '2weeks' | 'month' | 'year') => set((state: UIState) => ({
        timelineState: {
          ...state.timelineState,
          [boardId]: {
            ...state.timelineState[boardId],
            zoomLevel: level
          }
        }
      })),
      setTimelineCollapsedLanes: (boardId: string, lanes: string[]) => set((state: UIState) => ({
        timelineState: {
          ...state.timelineState,
          [boardId]: {
            ...state.timelineState[boardId],
            collapsedLanes: lanes
          }
        }
      })),
      toggleTimelineLane: (boardId: string, laneId: string) => set((state: UIState) => {
        const currentBoardState = state.timelineState[boardId] || {
          currentDate: new Date().toISOString(),
          zoomLevel: 'week',
          collapsedLanes: []
        };
        const collapsedLanes = currentBoardState.collapsedLanes || [];
        const isCollapsed = collapsedLanes.includes(laneId);
        return {
          timelineState: {
            ...state.timelineState,
            [boardId]: {
              ...currentBoardState,
              collapsedLanes: isCollapsed
                ? collapsedLanes.filter((id: string) => id !== laneId)
                : [...collapsedLanes, laneId]
            }
          }
        };
      }),
      getTimelineState: (boardId: string) => {
        const state = get();
        return state.timelineState[boardId] || {
          currentDate: new Date().toISOString(),
          zoomLevel: 'week',
          collapsedLanes: []
        };
      },
      clearTimelineState: (boardId: string) => set((state: UIState) => {
        const newTimelineState = { ...state.timelineState };
        delete newTimelineState[boardId];
        return { timelineState: newTimelineState };
      }),

      /**
       * Set column order for a board
       * @param boardId - Board ID
       * @param order - Array of list IDs in order
       */
      setColumnOrder: (boardId: string, order: string[]) => set((state: UIState) => ({
        columnOrder: {
          ...state.columnOrder,
          [boardId]: order
        }
      })),

      /**
       * Get column order for a board
       * @param boardId - Board ID
       * @returns Array of list IDs in order
       */
      getColumnOrder: (boardId: string) => {
        const state = get();
        return state.columnOrder[boardId] || [];
      },

      /**
       * Set scroll position for a board
       * @param boardId - Board ID
       * @param position - Scroll position with left and top values
       */
      setScrollPosition: (boardId: string, position: { left: number; top: number }) => set((state: UIState) => ({
        scrollPosition: {
          ...state.scrollPosition,
          [boardId]: position
        }
      })),

      /**
       * Get scroll position for a board
       * @param boardId - Board ID
       * @returns Scroll position with left and top values
       */
      getScrollPosition: (boardId: string) => {
        const state = get();
        return state.scrollPosition[boardId] || { left: 0, top: 0 };
      },

      /**
       * Set sidebar visibility
       * @param open - Whether sidebar should be open
       */
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      /**
       * Set filter sheet visibility
       * @param show - Whether filter sheet should be open
       */
      setShowFilterSheet: (show) => set({ showFilterSheet: show }),

      /**
       * Set theme and apply to document
       * @param theme - Theme to set ('light' or 'dark')
       */
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      /**
       * Set search term for filtering
       * @param boardId - Board ID
       * @param term - Search term to set
       */
      setSearchTerm: (boardId: string, term: string) => set((state: UIState) => ({
        filterState: {
          ...state.filterState,
          [boardId]: {
            ...state.filterState[boardId],
            searchTerm: term
          }
        }
      })),

      /**
       * Set selected labels for filtering
       * @param boardId - Board ID
       * @param labels - Array of label IDs
       */
      setSelectedLabels: (boardId: string, labels: string[]) => set((state: UIState) => ({
        filterState: {
          ...state.filterState,
          [boardId]: {
            ...state.filterState[boardId],
            selectedLabels: labels
          }
        }
      })),

      /**
       * Set selected members for filtering
       * @param boardId - Board ID
       * @param members - Array of member IDs
       */
      setSelectedMembers: (boardId: string, members: string[]) => set((state: UIState) => ({
        filterState: {
          ...state.filterState,
          [boardId]: {
            ...state.filterState[boardId],
            selectedMembers: members
          }
        }
      })),

      /**
       * Set overdue filter visibility
       * @param boardId - Board ID
       * @param show - Whether to show overdue cards
       */
      setShowOverdue: (boardId: string, show: boolean) => set((state: UIState) => ({
        filterState: {
          ...state.filterState,
          [boardId]: {
            ...state.filterState[boardId],
            showOverdue: show
          }
        }
      })),

      /**
       * Set completed status filter
       * @param boardId - Board ID
       * @param status - Completed status filter
       */
      setShowCompleted: (boardId: string, status: 'all' | 'completed' | 'incomplete') => set((state: UIState) => ({
        filterState: {
          ...state.filterState,
          [boardId]: {
            ...state.filterState[boardId],
            showCompleted: status
          }
        }
      })),

      /**
       * Set priority threshold for filtering (1-100)
       * @param boardId - Board ID
       * @param threshold - Minimum priority to show
       */
      setPriorityThreshold: (boardId: string, threshold: number | null) => set((state: UIState) => ({
        filterState: {
          ...state.filterState,
          [boardId]: {
            ...state.filterState[boardId],
            priorityThreshold: threshold
          }
        }
      })),

      /**
       * Set due date filter
       * @param boardId - Board ID
       * @param filter - Due date filter type
       */
      setDueDateFilter: (boardId: string, filter: 'all' | 'overdue' | 'today' | 'week' | 'month') => set((state: UIState) => ({
        filterState: {
          ...state.filterState,
          [boardId]: {
            ...state.filterState[boardId],
            dueDateFilter: filter
          }
        }
      })),

      /**
       * Get filter state for a board
       * @param boardId - Board ID
       * @returns Filter state for the board
       */
      getFilterState: (boardId: string) => {
        const state = get();
        return state.filterState[boardId] || {
          searchTerm: '',
          selectedLabels: [],
          selectedMembers: [],
          showOverdue: false,
          showCompleted: 'all',
          priorityThreshold: null,
          dueDateFilter: 'all'
        };
      },

      /**
       * Clear all filters for a board
       * @param boardId - Board ID
       */
      clearFilters: (boardId: string) => set((state: UIState) => ({
        filterState: {
          ...state.filterState,
          [boardId]: {
            searchTerm: '',
            selectedLabels: [],
            selectedMembers: [],
            showOverdue: false,
            showCompleted: 'all',
            priorityThreshold: null,
            dueDateFilter: 'all'
          }
        }
      })),

      /**
       * Open card modal
       * @param cardId - Optional card ID to edit
       */
      openCardModal: (cardId) => {
        set({
          cardModalOpen: true,
          selectedCardId: cardId || null,
          cardJSONData: null,
          targetListId: null,
        });

        // Only update URL if we're not already on a card page
        if (cardId && !window.location.pathname.includes('/card/')) {
          // Small delay to ensure modal state is set first
          setTimeout(() => {
            import('./boardStore').then(({ useBoardStore }) => {
              const boardStore = useBoardStore.getState();
              if (boardStore.currentBoardId) {
                const newUrl = `/board/${boardStore.currentBoardId}/card/${cardId}`;
                window.history.pushState({}, '', newUrl);
              }
            });
          }, 50);
        }
      },

      /**
       * Open card modal from JSON data for creating a new card
       * @param cardJSON - Card data to pre-populate the form
       * @param listId - Target list ID where the card should be created
       */
      openCardModalFromJSON: (cardJSON, listId) => set({
        cardModalOpen: true,
        selectedCardId: null,
        cardJSONData: cardJSON,
        targetListId: listId,
      }),

      /**
       * Close card modal
       */
      closeCardModal: () => {
        set({
          cardModalOpen: false,
          selectedCardId: null,
          cardJSONData: null,
          targetListId: null,
        });

        // Update URL to board URL or root
        import('./boardStore').then(({ useBoardStore }) => {
          const boardStore = useBoardStore.getState();
          if (boardStore.currentBoardId) {
            const newUrl = `/board/${boardStore.currentBoardId}`;
            window.history.pushState({}, '', newUrl);
          } else {
            window.history.pushState({}, '', '/');
          }
        });
      },

      /**
       * Close card modal without updating URL (used to prevent URL parsing loops)
       */
      closeCardModalWithoutUrlUpdate: () => {
        set({
          cardModalOpen: false,
          selectedCardId: null,
          cardJSONData: null,
          targetListId: null,
        });
      },

      /**
       * Initialize theme based on saved preference or system preference
       * Sets up system theme change listener
       */
      initializeTheme: () => {
        const state = get();
        const savedTheme = state.theme;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = savedTheme || systemTheme;

        get().setTheme(theme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!state.theme) { // Only if user hasn't explicitly set a theme
            get().setTheme(e.matches ? 'dark' : 'light');
          }
        });
      },
    }),
    {
      name: STORAGE_KEYS.UI_STATE,
      partialize: (state) => ({
        currentView: state.currentView,
        sidebarOpen: state.sidebarOpen,
        showFilterSheet: state.showFilterSheet,
        theme: state.theme,
        filterState: state.filterState,
        timelineState: state.timelineState,
        columnOrder: state.columnOrder,
      }),
    }
  )
);
