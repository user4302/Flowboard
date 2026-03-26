'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanList } from './KanbanList';
import { List, User } from '@/lib/types';

/**
 * Props for the SortableKanbanList component
 * @interface SortableKanbanListProps
 */
interface SortableKanbanListProps {
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
}

/**
 * SortableKanbanList component - Wraps KanbanList with drag-and-drop functionality
 * 
 * This component provides the drag-and-drop capabilities for kanban lists using @dnd-kit/sortable.
 * It handles the visual feedback during dragging, including opacity changes and smooth transitions.
 * The component wraps the base KanbanList component and passes through all necessary props.
 * 
 * @param props - Component props containing list data and callback functions
 * @returns A draggable kanban list with visual feedback during drag operations
 * 
 * @example
 * ```tsx
 * <SortableKanbanList
 *   list={list}
 *   members={members}
 *   onAddCard={handleAddCard}
 *   onRenameList={handleRenameList}
 *   onDeleteList={handleDeleteList}
 * />
 * ```
 */
export function SortableKanbanList({
  list,
  members,
  onAddCard,
  onRenameList,
  onDeleteList,
  onCardClick,
  searchTerm = '',
  className,
  onMenuToggle,
  isAnyMenuOpen
}: SortableKanbanListProps) {
  // Configure sortable behavior with the list ID as the unique identifier
  const {
    attributes,      // ARIA attributes for accessibility
    listeners,       // Event listeners for drag initiation
    setNodeRef,      // Ref to the DOM node for drag detection
    transform,       // Current transform during drag
    transition,      // Transition properties for smooth animations
    isDragging,      // Boolean indicating if this list is being dragged
  } = useSortable({ id: list.id });

  // Style object for drag-and-drop visual feedback
  const style = {
    // Convert transform to CSS string for @dnd-kit
    transform: CSS.Transform.toString(transform),
    // Apply transition for smooth drag animations
    transition,
    // Reduce opacity when dragging to provide visual feedback
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      // Reference for drag-and-drop detection
      ref={setNodeRef}
      // Apply drag-and-drop styles
      style={style}
      // Add smooth transition class for better UX during drag operations
      className="transition-transform duration-300 ease-in-out"
    >
      {/* Render the actual KanbanList with all props and drag handle functionality */}
      <KanbanList
        list={list}
        members={members}
        onAddCard={onAddCard}
        onRenameList={onRenameList}
        onDeleteList={onDeleteList}
        onCardClick={onCardClick}
        searchTerm={searchTerm}
        className={className}
        onMenuToggle={onMenuToggle}
        isAnyMenuOpen={isAnyMenuOpen}
        // Pass drag handle props to enable list dragging
        dragHandleProps={{
          attributes: attributes as unknown as Record<string, unknown>,
          listeners: listeners as unknown as Record<string, unknown>,
        }}
      />
    </div>
  );
}
