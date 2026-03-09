'use client';

import { useState, useMemo } from 'react';
import {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  SensorDescriptor,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBoardStore } from '@/store';
import { Board, List, Card } from '@/lib/types';

/**
 * Props for the useKanbanDragAndDrop hook
 * @interface UseKanbanDragAndDropProps
 */
interface UseKanbanDragAndDropProps {
  /** ID of the board being managed */
  boardId: string;
  /** Board data containing lists and cards */
  board: Board;
}

/**
 * Return type for the useKanbanDragAndDrop hook
 * @interface UseKanbanDragAndDropReturn
 */
interface UseKanbanDragAndDropReturn {
  /** Configured drag and drop sensors */
  sensors: SensorDescriptor<any>[];
  /** ID of the currently dragged item */
  activeId: string | null;
  /** Type of item being dragged (card or list) */
  activeDataType: 'card' | 'list' | null;
  /** Handler for drag start events */
  handleDragStart: (event: DragStartEvent) => void;
  /** Handler for drag over events */
  handleDragOver: (event: DragOverEvent) => void;
  /** Handler for drag end events */
  handleDragEnd: (event: DragEndEvent) => void;
  /** Function to get the currently active card data */
  getActiveCard: () => Card | null;
  /** Function to get the currently active list data */
  getActiveList: () => List | null;
}

/**
 * Custom hook for managing kanban drag and drop functionality
 * 
 * Provides comprehensive drag-and-drop support for both cards and lists in a kanban board.
 * Handles card movement between lists, list reordering, and visual feedback during drag operations.
 * 
 * @param props - Configuration object containing board ID and board data
 * @returns Object containing drag handlers, sensors, and state management functions
 * 
 * @example
 * ```tsx
 * const {
 *   sensors,
 *   handleDragStart,
 *   handleDragOver,
 *   handleDragEnd
 * } = useKanbanDragAndDrop({ boardId, board });
 * ```
 */
export function useKanbanDragAndDrop({
  boardId,
  board
}: UseKanbanDragAndDropProps): UseKanbanDragAndDropReturn {
  // State for tracking the currently dragged item
  const [activeId, setActiveId] = useState<string | null>(null);
  // State for tracking the type of item being dragged (card or list)
  const [activeDataType, setActiveDataType] = useState<'card' | 'list' | null>(null);

  // Configure drag and drop sensors
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });

  // Create stable sensors array with memoization
  const sensors = useMemo(() => [pointerSensor, keyboardSensor], [pointerSensor, keyboardSensor]);

  /**
   * Handles the start of a drag operation
   * 
   * Determines whether the dragged item is a card or a list and updates the internal state accordingly.
   * This information is crucial for handling the drag operation correctly.
   * 
   * @param event - The drag start event from @dnd-kit
   */
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);

    // Check if the dragged ID belongs to a card by searching through all lists
    const isCard = board.lists.some((list: List) =>
      list.cards.some((card: Card) => card.id === event.active.id)
    );
    // Check if the dragged ID belongs to a list
    const isList = board.lists.some((list: List) => list.id === event.active.id);

    if (isCard) {
      setActiveDataType('card');
    } else if (isList) {
      setActiveDataType('list');
    }
  };

  /**
   * Handles drag over events for optimistic updates
   * 
   * Provides real-time visual feedback by moving cards between lists as they are dragged over.
   * This creates a smooth user experience by showing the result of the drag operation immediately.
   * 
   * @param event - The drag over event from @dnd-kit
   */
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find which list contains the active card being dragged
    let activeListId = null;
    for (const list of board.lists) {
      if (list.cards.some((c: Card) => c.id === activeId)) {
        activeListId = list.id;
        break;
      }
    }

    // Determine the target list - could be the list itself or a card within the list
    let overListId = null;
    const overList = board.lists.find((l: List) => l.id === overId);
    if (overList) {
      // Dragging directly over a list
      overListId = overList.id;
    } else {
      // Dragging over a card - find its parent list
      for (const list of board.lists) {
        if (list.cards.some((c: Card) => c.id === overId)) {
          overListId = list.id;
          break;
        }
      }
    }

    // Skip if dragging within the same list or if target couldn't be determined
    if (!activeListId || !overListId || activeListId === overListId) return;

    // Calculate the position where the card should be inserted
    // If dragging over a card, insert at that position; if over a list, append to end
    const overIndex = board.lists.find((l: List) => l.id === overListId)?.cards.findIndex((c: Card) => c.id === overId);
    const newIndex = overIndex !== undefined && overIndex >= 0 ? overIndex : 0;

    // Optimistically update the store for immediate visual feedback
    useBoardStore.getState().moveCard(boardId, activeId, activeListId, overListId, newIndex);
  };

  /**
   * Handles the end of a drag operation
   * 
   * Finalizes the drag operation by either reordering lists or moving/reordering cards.
   * This is where the actual state changes are committed to the store.
   * 
   * @param event - The drag end event from @dnd-kit
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    // Reset drag state
    setActiveId(null);
    setActiveDataType(null);

    // If there's no valid drop target, exit early
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle list reordering when dragging a list
    if (activeDataType === 'list') {
      const activeIndex = board.lists.findIndex((l: List) => l.id === activeId);
      const overIndex = board.lists.findIndex((l: List) => l.id === overId);

      // Only reorder if both positions are valid and different
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        useBoardStore.getState().reorderLists(boardId, activeIndex, overIndex);
      }
      return;
    }

    // Handle card reordering or movement between lists
    // Find the source list and position of the active card
    let activeListId = null;
    let fromIndex = -1;
    for (const list of board.lists) {
      const idx = list.cards.findIndex((c: Card) => c.id === activeId);
      if (idx !== -1) {
        activeListId = list.id;
        fromIndex = idx;
        break;
      }
    }

    // Exit if we couldn't find the card's current location
    if (!activeListId) return;

    // Determine the target list and insertion position
    let overListId = null;
    let toIndex = -1;

    // Check if dragging over a list (append to end)
    const overList = board.lists.find((l: List) => l.id === overId);
    if (overList) {
      overListId = overList.id;
      toIndex = overList.cards.length;
    } else {
      // Check if dragging over a card (insert at that position)
      for (const list of board.lists) {
        const idx = list.cards.findIndex((c: Card) => c.id === overId);
        if (idx !== -1) {
          overListId = list.id;
          toIndex = idx;
          break;
        }
      }
    }

    // Exit if target couldn't be determined
    if (!overListId) return;

    // Perform the appropriate action based on whether we're moving within the same list or between lists
    if (activeListId === overListId) {
      // Reordering within the same list
      useBoardStore.getState().reorderCards(boardId, activeListId, fromIndex, toIndex);
    } else {
      // Moving to a different list
      useBoardStore.getState().moveCard(boardId, activeId, activeListId, overListId, toIndex);
    }
  };

  /**
   * Retrieves the currently active card data
   * 
   * @returns The card object being dragged, or null if no card is being dragged
   */
  const getActiveCard = () => {
    // Only return a card if we're actively dragging a card
    if (!activeId || activeDataType !== 'card') return null;

    // Search through all lists to find the card with the active ID
    for (const list of board.lists) {
      const card = list.cards.find((c: Card) => c.id === activeId);
      if (card) return card;
    }
    return null; // Card not found
  };

  /**
   * Retrieves the currently active list data
   * 
   * @returns The list object being dragged, or null if no list is being dragged
   */
  const getActiveList = () => {
    // Only return a list if we're actively dragging a list
    if (!activeId || activeDataType !== 'list') return null;

    // Find the list with the active ID
    return board.lists.find((l: List) => l.id === activeId) || null;
  };

  return {
    sensors,
    activeId,
    activeDataType,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    getActiveCard,
    getActiveList,
  };
}
