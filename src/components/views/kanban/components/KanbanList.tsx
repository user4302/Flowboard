import { cn } from '@/lib/utils';
import { KanbanListHeader } from './KanbanListHeader';
import { KanbanCardsContainer } from './KanbanCardsContainer';
import { getFilteredCardCount, FilterOptions } from '@/lib/filterUtils';
import { useUIStore, useBoardStore } from '@/store';
import { List, User } from '@/lib/types';

// Default filter state to avoid creating new objects
const DEFAULT_FILTER_STATE = {
  searchTerm: '',
  selectedLabels: [],
  selectedMembers: [],
  showOverdue: false,
  showCompleted: 'all' as const,
  priorityThreshold: null,
  dueDateFilter: 'all' as const
};

/**
 * Props for the KanbanList component
 * @interface ListProps
 */
interface ListProps {
  /** The list data containing cards and metadata */
  list: List;
  /** Array of board members for card assignment */
  members: User[];
  /** Callback function when a new card is added to the list */
  onAddCard: (listId: string, title: string) => void;
  /** Callback function when the list is renamed */
  onRenameList: (listId: string, newTitle: string) => void;
  /** Callback function when the list is deleted */
  onDeleteList: (listId: string) => void;
  /** Callback function when a card is clicked */
  onCardClick?: (cardId: string) => void;
  /** Search term to filter cards within the list */
  searchTerm?: string;
  /** Additional CSS class names */
  className?: string;
  /** Callback function when the list menu is toggled */
  onMenuToggle?: (isOpen: boolean) => void;
  /** Flag indicating if any list menu is currently open */
  isAnyMenuOpen?: boolean;
  /** Drag handle props for list reordering functionality */
  dragHandleProps?: {
    attributes: Record<string, unknown>;
    listeners: Record<string, unknown>;
  };
}

/**
 * KanbanList component - Renders a single kanban list with header and cards
 * 
 * This component displays a single kanban list containing its header and cards.
 * It handles filtering based on search terms and other filter options,
 * and provides the visual structure for individual lists within the kanban board.
 * 
 * @param props - Component props containing list data and callback functions
 * @returns A rendered kanban list with header and filtered cards
 * 
 * @example
 * ```tsx
 * <KanbanList
 *   list={list}
 *   members={members}
 *   onAddCard={handleAddCard}
 *   onRenameList={handleRenameList}
 *   onDeleteList={handleDeleteList}
 *   searchTerm={searchTerm}
 * />
 * ```
 */
export function KanbanList({
  list,
  members,
  onAddCard,
  onRenameList,
  onDeleteList,
  onCardClick,
  searchTerm = '',
  className,
  onMenuToggle,
  isAnyMenuOpen,
  dragHandleProps
}: ListProps) {
  // Get global filter options from UI store for card filtering
  const { boards, currentBoardId } = useBoardStore();
  const globalSearchTerm = useUIStore((state) =>
    currentBoardId ? state.filterState[currentBoardId]?.searchTerm ?? DEFAULT_FILTER_STATE.searchTerm : DEFAULT_FILTER_STATE.searchTerm
  );
  const selectedLabels = useUIStore((state) =>
    currentBoardId ? state.filterState[currentBoardId]?.selectedLabels ?? DEFAULT_FILTER_STATE.selectedLabels : DEFAULT_FILTER_STATE.selectedLabels
  );
  const selectedMembers = useUIStore((state) =>
    currentBoardId ? state.filterState[currentBoardId]?.selectedMembers ?? DEFAULT_FILTER_STATE.selectedMembers : DEFAULT_FILTER_STATE.selectedMembers
  );
  const showCompleted = useUIStore((state) =>
    currentBoardId ? state.filterState[currentBoardId]?.showCompleted ?? DEFAULT_FILTER_STATE.showCompleted : DEFAULT_FILTER_STATE.showCompleted
  );
  const priorityThreshold = useUIStore((state) =>
    currentBoardId ? state.filterState[currentBoardId]?.priorityThreshold ?? DEFAULT_FILTER_STATE.priorityThreshold : DEFAULT_FILTER_STATE.priorityThreshold
  );
  const dueDateFilter = useUIStore((state) =>
    currentBoardId ? state.filterState[currentBoardId]?.dueDateFilter ?? DEFAULT_FILTER_STATE.dueDateFilter : DEFAULT_FILTER_STATE.dueDateFilter
  );
  const currentBoard = boards.find(b => b.id === currentBoardId);

  const filterOptions: FilterOptions = {
    searchTerm: globalSearchTerm || searchTerm,
    selectedLabels,
    selectedMembers,
    showCompleted: showCompleted as 'all' | 'completed' | 'incomplete',
    priorityThreshold,
    dueDateFilter: dueDateFilter as 'all' | 'overdue' | 'today' | 'week' | 'month'
  };

  const filteredCardCount = getFilteredCardCount(list.cards, filterOptions, currentBoard?.labels || []);

  return (
    <div className={cn("flex w-80 flex-shrink-0 flex-col gap-3 h-full", className)}>
      <KanbanListHeader
        title={list.title}
        cardCount={filteredCardCount}
        onRename={(newTitle) => onRenameList(list.id, newTitle)}
        onDelete={() => onDeleteList(list.id)}
        onMenuToggle={onMenuToggle}
        isAnyMenuOpen={isAnyMenuOpen}
        dragHandleProps={dragHandleProps}
      />

      <KanbanCardsContainer
        cards={list.cards}
        listId={list.id}
        members={members}
        onAddCard={onAddCard}
        onCardClick={onCardClick}
        searchTerm={searchTerm}
      />
    </div>
  );
}
