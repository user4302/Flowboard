import { cn } from '@/lib/utils';
import { KanbanListHeader } from './KanbanListHeader';
import { KanbanCardsContainer } from './KanbanCardsContainer';
import { getFilteredCardCount, FilterOptions } from '@/lib/filterUtils';
import { useUIStore, useBoardStore } from '@/store';
import { List, User } from '@/lib/types';

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
  searchTerm = '',
  className,
  onMenuToggle,
  isAnyMenuOpen,
  dragHandleProps
}: ListProps) {
  // Get global filter options from UI store for card filtering
  const {
    searchTerm: globalSearchTerm,    // Global search term across all lists
    selectedLabels,                  // Selected label filters
    selectedMembers,                 // Selected member filters
    showCompleted,                   // Whether to show completed cards
    priorityThreshold,               // Minimum priority threshold
    dueDateFilter                    // Due date filter options
  } = useUIStore();

  // Get board data for context
  const { boards, currentBoardId } = useBoardStore();
  const currentBoard = boards.find(b => b.id === currentBoardId);

  const filterOptions: FilterOptions = {
    searchTerm: globalSearchTerm || searchTerm,
    selectedLabels,
    selectedMembers,
    showCompleted,
    priorityThreshold,
    dueDateFilter
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
        searchTerm={searchTerm}
      />
    </div>
  );
}
