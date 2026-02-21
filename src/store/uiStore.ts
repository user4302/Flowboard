import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ViewState, FilterState } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface UIState extends ViewState, FilterState {
  // Modal state
  cardModalOpen: boolean;
  selectedCardId: string | null;
  
  // Actions
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
  
  // Initialize theme
  initializeTheme: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // View state
      currentView: 'kanban',
      sidebarOpen: true,
      theme: 'light',
      
      // Filter state
      searchTerm: '',
      selectedLabels: [],
      selectedMembers: [],
      showOverdue: false,
      
      // Modal state
      cardModalOpen: false,
      selectedCardId: null,

      setCurrentView: (view) => set({ currentView: view }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setSearchTerm: (term) => set({ searchTerm: term }),

      setSelectedLabels: (labels) => set({ selectedLabels: labels }),

      setSelectedMembers: (members) => set({ selectedMembers: members }),

      setShowOverdue: (show) => set({ showOverdue: show }),

      clearFilters: () => set({
        searchTerm: '',
        selectedLabels: [],
        selectedMembers: [],
        showOverdue: false,
      }),

      openCardModal: (cardId) => set({
        cardModalOpen: true,
        selectedCardId: cardId || null,
      }),

      closeCardModal: () => set({
        cardModalOpen: false,
        selectedCardId: null,
      }),

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
