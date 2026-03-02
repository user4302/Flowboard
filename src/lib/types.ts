/**
 * Board interface - Represents a project board with lists, members, and settings
 */
export interface Board {
  /** Unique identifier for the board */
  id: string;
  /** Display name of the board */
  name: string;
  /** Array of lists containing cards */
  lists: List[];
  /** Array of board members with access permissions */
  members: User[];
  /** Global labels available for cards in this board */
  labels: Label[];
  /** Storage for archived cards */
  archivedCards: ArchivedCard[];
  /** Timestamp when the board was created */
  createdAt: Date;
  /** Timestamp when the board was last updated */
  updatedAt: Date;
}

/**
 * List interface - Represents a column/section within a board
 */
export interface List {
  /** Unique identifier for the list */
  id: string;
  /** Display title of the list */
  title: string;
  /** Array of cards contained in this list */
  cards: Card[];
  /** Position index for ordering lists */
  position: number;
  /** Optional color theme for the list */
  color?: string;
}

/**
 * Card interface - Represents a task or item within a list
 */
export interface Card {
  /** Unique identifier for the card */
  id: string;
  /** Main title/description of the card */
  title: string;
  /** Detailed description of the card */
  description?: string;
  /** Array of label IDs referencing board labels */
  labelIds: string[];
  /** Array of member IDs assigned to this card */
  members: string[];
  /** Optional start date for the card */
  startDate?: Date;
  /** Optional due date for the card */
  dueDate?: Date;
  /** Array of checklist items for subtasks */
  checklist: ChecklistItem[];
  /** Whether the card is marked as completed */
  completed: boolean;
  /** Position index for ordering cards within a list */
  position: number;
  /** ID of the list containing this card */
  listId: string;
  /** Optional priority level (higher numbers = higher priority) */
  priority?: number;
  /** Timestamp when the card was created */
  createdAt: Date;
  /** Timestamp when the card was last updated */
  updatedAt: Date;
}

/**
 * ArchivedCard interface - Represents a card that has been archived
 */
export interface ArchivedCard {
  /** Unique identifier for the archived card record */
  id: string;
  /** The original card data before archiving */
  card: Card;
  /** Timestamp when the card was archived */
  archivedAt: Date;
  /** ID of the list the card was originally in */
  originalListId: string;
  /** Position the card had in its original list */
  originalPosition: number;
}

/**
 * Label interface - Represents a tag/category for cards
 */
export interface Label {
  /** Unique identifier for the label */
  id: string;
  /** Display text/title of the label */
  text: string;
  /** Color value (Tailwind class or hex code) */
  color: string;
}

/**
 * User interface - Represents a board member or user
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** Display name of the user */
  name: string;
  /** Optional URL to user's avatar image */
  avatarUrl?: string;
  /** Optional email address */
  email?: string;
}

/**
 * ChecklistItem interface - Represents a subtask within a card
 */
export interface ChecklistItem {
  /** Unique identifier for the checklist item */
  id: string;
  /** Description text of the checklist item */
  text: string;
  /** Whether the item is completed */
  done: boolean;
}

/**
 * ViewState interface - Represents UI state preferences
 */
export interface ViewState {
  /** Currently active view type */
  currentView: 'kanban' | 'timeline' | 'calendar' | 'table';
  /** Whether the sidebar is currently open */
  sidebarOpen: boolean;
  /** Current theme preference */
  theme: 'light' | 'dark';
}

/**
 * FilterState interface - Represents current filter settings
 */
export interface FilterState {
  /** Text search term */
  searchTerm: string;
  /** Array of selected label IDs to filter by */
  selectedLabels: string[];
  /** Array of selected member IDs to filter by */
  selectedMembers: string[];
  /** Whether to show overdue items */
  showOverdue: boolean;
  /** Filter for completion status */
  showCompleted: 'all' | 'completed' | 'incomplete';
  /** Minimum priority threshold for filtering */
  priorityThreshold: number | null;
  /** Filter for due date ranges */
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week' | 'month';
}

/**
 * DragItem interface - Represents an item being dragged in drag-and-drop operations
 */
export type DragItem = {
  /** Type of item being dragged */
  type: 'card' | 'list';
  /** Unique identifier of the dragged item */
  id: string;
  /** ID of the list containing the item (for cards) */
  listId?: string;
  /** Current position of the item */
  position: number;
};

/**
 * SearchAndFilter component props
 */
export interface SearchAndFilterProps {
  /** ID of the board to search/filter */
  boardId: string;
  /** Additional CSS class names */
  className?: string;
  /** Whether to render in compact mode */
  compact?: boolean;
}

/**
 * Dropdown position coordinates
 */
export interface DropdownPosition {
  /** Top position in pixels */
  top: number;
  /** Left position in pixels */
  left: number;
  /** Width in pixels */
  width: number;
  /** Optional minimum width */
  minWidth?: number;
}

/**
 * Filter option for dropdown selections
 */
export interface FilterOption {
  /** Value of the filter option */
  value: string;
  /** Display label for the option */
  label: string;
  /** Optional icon component */
  icon?: any;
}

/**
 * Status filter value type
 */
export type StatusValue = 'all' | 'incomplete' | 'completed';

/**
 * Due date filter value type
 */
export type DueDateValue = 'all' | 'overdue' | 'today' | 'week' | 'month';

// BoardShare types

/**
 * Props for the InviteModal component
 */
export interface InviteModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
}

/**
 * Props for the JoinBoardModal component
 */
export interface JoinBoardModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
  /** Optional invitation ID from URL parameters */
  inviteId?: string;
}

/**
 * Props for the MemberManagement component
 */
export interface MemberManagementProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
}

/**
 * Form data for joining a board
 */
export interface JoinFormData {
  /** User's email address */
  email: string;
  /** User's chosen username */
  username: string;
  /** User's password */
  password: string;
}

/**
 * Active tab type for member management
 */
export type ActiveTab = 'pending' | 'members';

/**
 * Expiration time option for invitations
 */
export interface ExpiryOption {
  /** Expiration time value in hours */
  value: number;
  /** Display label for the option */
  label: string;
}
