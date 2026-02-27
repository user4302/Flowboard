// Main component
export { Sidebar } from './Sidebar';

// Sub-components
export { SidebarBackdrop } from './components/SidebarBackdrop';
export { SidebarHeader } from './components/SidebarHeader';
export { BoardList } from './components/BoardList';
export { BoardItem } from './components/BoardItem';
export { BoardCreationForm } from './components/BoardCreationForm';

// Hooks
export { useSidebarState } from './hooks/useSidebarState';
export { useBoardActions } from './hooks/useBoardActions';

// Types
export type { Board, SidebarState, BoardActions } from './types/sidebar.types';
