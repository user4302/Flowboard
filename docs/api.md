# API Documentation

Flowboard is primarily a client-side application with local storage persistence. This document outlines the available APIs and data structures.

## Data Models

### Board
```typescript
interface Board {
  id: string;
  title: string;
  description?: string;
  members: Member[];
  lists: List[];
  createdAt: Date;
  updatedAt: Date;
  owner: string;
}
```

### List
```typescript
interface List {
  id: string;
  title: string;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Card
```typescript
interface Card {
  id: string;
  title: string;
  description?: string;
  labels: Label[];
  members: string[];
  dueDate?: Date;
  completed: boolean;
  priority: number; // 1-100
  checklist: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Label
```typescript
interface Label {
  id: string;
  name: string;
  color: string;
}
```

### Member
```typescript
interface Member {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}
```

### ChecklistItem
```typescript
interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}
```

## Store API

### Board Store
```typescript
interface BoardStore {
  // State
  boards: Board[];
  currentBoardId: string | null;
  
  // Actions
  createBoard: (title: string, description?: string) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  setCurrentBoard: (boardId: string) => void;
  
  // List Actions
  createList: (boardId: string, title: string) => void;
  updateList: (boardId: string, listId: string, updates: Partial<List>) => void;
  deleteList: (boardId: string, listId: string) => void;
  reorderLists: (boardId: string, fromIndex: number, toIndex: number) => void;
  
  // Card Actions
  createCard: (boardId: string, listId: string, title: string) => void;
  updateCard: (boardId: string, cardId: string, updates: Partial<Card>) => void;
  deleteCard: (boardId: string, cardId: string) => void;
  moveCard: (boardId: string, cardId: string, fromListId: string, toListId: string, index: number) => void;
  reorderCards: (boardId: string, listId: string, fromIndex: number, toIndex: number) => void;
}
```

### UI Store
```typescript
interface UIStore {
  // State
  currentView: 'kanban' | 'timeline' | 'calendar' | 'table';
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  searchTerm: string;
  selectedLabels: string[];
  selectedMembers: string[];
  showCompleted: boolean;
  priorityThreshold: number;
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week' | 'month';
  
  // Actions
  setCurrentView: (view: string) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSearchTerm: (term: string) => void;
  setSelectedLabels: (labels: string[]) => void;
  setSelectedMembers: (members: string[]) => void;
  setShowCompleted: (show: boolean) => void;
  setPriorityThreshold: (threshold: number) => void;
  setDueDateFilter: (filter: string) => void;
}
```

## Component Props

### KanbanView
```typescript
interface KanbanViewProps {
  boardId: string;
}
```

### SortableKanbanList
```typescript
interface SortableKanbanListProps {
  list: List;
  members: Member[];
  onAddCard: (listId: string, title: string) => void;
  onRenameList: (listId: string, newTitle: string) => void;
  onDeleteList: (listId: string) => void;
  searchTerm?: string;
  className?: string;
  onMenuToggle?: (isOpen: boolean) => void;
  isAnyMenuOpen?: boolean;
}
```

### TaskCard
```typescript
interface TaskCardProps {
  card: Card;
  members: Member[];
  onClick: () => void;
  className?: string;
}
```

## Hooks

### useKanbanDragAndDrop
```typescript
interface UseKanbanDragAndDropProps {
  boardId: string;
  board: Board;
}

interface UseKanbanDragAndDropReturn {
  sensors: SensorDescription[];
  activeId: string | null;
  activeDataType: 'card' | 'list' | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  getActiveCard: () => Card | null;
  getActiveList: () => List | null;
}
```

### useBoard
```typescript
interface UseBoardReturn {
  board: Board | null;
  boards: Board[];
  currentBoardId: string | null;
  createBoard: (title: string, description?: string) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  setCurrentBoard: (boardId: string) => void;
}
```

## Utility Functions

### Filter Utils
```typescript
interface FilterOptions {
  searchTerm?: string;
  selectedLabels?: string[];
  selectedMembers?: string[];
  showCompleted?: boolean;
  priorityThreshold?: number;
  dueDateFilter?: string;
}

export function getFilteredCards(cards: Card[], options: FilterOptions): Card[];
export function getFilteredCardCount(cards: Card[], options: FilterOptions): number;
```

### Date Utils
```typescript
export function formatDate(date: Date): string;
export function isOverdue(date: Date): boolean;
export function isDueToday(date: Date): boolean;
export function isDueThisWeek(date: Date): boolean;
export function isDueThisMonth(date: Date): boolean;
```

## Import/Export Format

### Export Structure
```typescript
interface ExportData {
  version: string;
  exportedAt: Date;
  boards: Board[];
}
```

### Import Validation
- Validates required fields
- Handles missing optional fields
- Converts date strings to Date objects
- Maintains data integrity

## Local Storage Schema

### Keys
- `flowboard-boards`: Array of board objects
- `flowboard-ui-state`: UI preferences and settings
- `flowboard-column-order-{boardId}`: Custom column ordering per board

### Data Format
All data is stored as JSON strings and parsed on application load.

## Error Handling

### Validation Errors
- Invalid board/list/card data
- Missing required fields
- Type mismatches

### Storage Errors
- Quota exceeded
- Data corruption
- Parse errors

### Network Errors
- Import/export failures
- File format issues

## Performance Considerations

### Optimizations
- Virtual scrolling for large lists
- Debounced search input
- Optimistic updates for drag-and-drop
- Lazy loading of components

### Best Practices
- Use React.memo for expensive components
- Implement proper key props for lists
- Avoid unnecessary re-renders
- Use useCallback and useMemo appropriately
