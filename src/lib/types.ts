export interface Board {
  id: string;
  name: string;
  lists: List[];
  members: User[];
  createdAt: Date; // Date object (localStorage handles UTC conversion)
  updatedAt: Date; // Date object (localStorage handles UTC conversion)
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
  labels: Label[];
  members: string[];
  startDate?: Date; // Date object (localStorage handles UTC conversion)
  dueDate?: Date;   // Date object (localStorage handles UTC conversion)
  checklist: ChecklistItem[];
  completed: boolean; // Track if entire card is completed
  position: number;
  listId: string;
  createdAt: Date; // Date object (localStorage handles UTC conversion)
  updatedAt: Date; // Date object (localStorage handles UTC conversion)
}

export interface Label {
  id: string;
  text: string;
  color: string; // Tailwind color class
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
