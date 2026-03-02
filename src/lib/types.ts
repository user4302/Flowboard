export interface Board {
  id: string;
  name: string;
  lists: List[];
  members: User[];
  labels: Label[]; // Global labels for this board
  archivedCards: ArchivedCard[]; // Archived cards storage
  createdAt: Date;
  updatedAt: Date;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
  position: number;
  color?: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  labelIds: string[]; // Reference labels by ID
  members: string[];
  startDate?: Date;
  dueDate?: Date;
  checklist: ChecklistItem[];
  completed: boolean;
  position: number;
  listId: string;
  priority?: number; // Number-based priority (greater than 0)
  createdAt: Date;
  updatedAt: Date;
}

export interface ArchivedCard {
  id: string;
  card: Card; // The original card data
  archivedAt: Date;
  originalListId: string; // Which list it was in before archiving
  originalPosition: number; // Position in the original list
}

export interface Label {
  id: string;
  text: string; // The "title" of the label
  color: string; // Tailwind color class or hex code
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ViewState {
  currentView: 'kanban' | 'timeline' | 'calendar' | 'table';
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}

export interface FilterState {
  searchTerm: string;
  selectedLabels: string[];
  selectedMembers: string[];
  showOverdue: boolean;
  showCompleted: 'all' | 'completed' | 'incomplete';
  priorityThreshold: number | null;
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week' | 'month';
}

export type DragItem = {
  type: 'card' | 'list';
  id: string;
  listId?: string;
  position: number;
};

// SearchAndFilter types
export interface SearchAndFilterProps {
  boardId: string;
  className?: string;
  compact?: boolean;
}

export interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  minWidth?: number;
}

export interface FilterOption {
  value: string;
  label: string;
  icon?: any;
}

export type StatusValue = 'all' | 'incomplete' | 'completed';
export type DueDateValue = 'all' | 'overdue' | 'today' | 'week' | 'month';

// BoardShare types
export interface InviteModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
}

export interface JoinBoardModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
  /** Optional invitation ID from URL parameters */
  inviteId?: string;
}

export interface MemberManagementProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
}

export interface JoinFormData {
  email: string;
  username: string;
  password: string;
}

export type ActiveTab = 'pending' | 'members';

export interface ExpiryOption {
  value: number;
  label: string;
}
