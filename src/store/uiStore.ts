import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ViewState, FilterState } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

/**
 * UI state interface - Extends view and filter state with modal management
 * Combines view preferences, filter options, and modal state management
 */
interface UIState extends ViewState, FilterState {
  // Modal state
  cardModalOpen: boolean;
  selectedCardId: string | null;

  // View actions
  setCurrentView: (view: ViewState['currentView']) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: ViewState['theme']) => void;

  // Filter actions
  setSearchTerm: (term: string) => void;
  setSelectedLabels: (labels: string[]) => void;
  setSelectedMembers: (members: string[]) => void;
  setShowOverdue: (show: boolean) => void;
  clearFilters: () => void;

  // Modal actions
  openCardModal: (cardId?: string) => void;
  closeCardModal: () => void;

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
      theme: 'light',

      // Initial filter state
      searchTerm: '',
      selectedLabels: [],
      selectedMembers: [],
      showOverdue: false,

      // Initial modal state
      cardModalOpen: false,
      selectedCardId: null,

      /**
       * Set the current view mode
       * @param view - View mode to set
       */
      setCurrentView: (view) => set({ currentView: view }),

      /**
       * Toggle sidebar visibility
       */
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      /**
       * Set sidebar visibility
       * @param open - Whether sidebar should be open
       */
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

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
       * @param term - Search term to set
       */
      setSearchTerm: (term) => set({ searchTerm: term }),

      /**
       * Set selected labels for filtering
       * @param labels - Array of label IDs
       */
      setSelectedLabels: (labels) => set({ selectedLabels: labels }),

      /**
       * Set selected members for filtering
       * @param members - Array of member IDs
       */
      setSelectedMembers: (members) => set({ selectedMembers: members }),

      /**
       * Set overdue filter visibility
       * @param show - Whether to show overdue cards
       */
      setShowOverdue: (show) => set({ showOverdue: show }),

      /**
       * Clear all filters
       */
      clearFilters: () => set({
        searchTerm: '',
        selectedLabels: [],
        selectedMembers: [],
        showOverdue: false,
      }),

      /**
       * Open card modal
       * @param cardId - Optional card ID to edit
       */
      openCardModal: (cardId) => set({
        cardModalOpen: true,
        selectedCardId: cardId || null,
      }),

      /**
       * Close card modal
       */
      closeCardModal: () => set({
        cardModalOpen: false,
        selectedCardId: null,
      }),

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
        theme: state.theme,
        searchTerm: state.searchTerm,
        selectedLabels: state.selectedLabels,
        selectedMembers: state.selectedMembers,
        showOverdue: state.showOverdue,
      }),
    }
  )
);
