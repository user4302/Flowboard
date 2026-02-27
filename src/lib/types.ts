export interface Board {
  id: string;
  name: string;
  lists: List[];
  members: User[];
  labels: Label[]; // Global labels for this board
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
}

export type DragItem = {
  type: 'card' | 'list';
  id: string;
  listId?: string;
  position: number;
};
