'use client';

import { useState } from 'react';
import {
  DragStartEvent,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBoardStore } from '@/store';

interface UseKanbanDragAndDropProps {
  boardId: string;
  board: any;
}

interface UseKanbanDragAndDropReturn {
  sensors: any[];
  activeId: string | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  getActiveCard: () => any;
}

/**
 * Custom hook for managing kanban drag and drop functionality
 */
export function useKanbanDragAndDrop({
  boardId,
  board
}: UseKanbanDragAndDropProps): UseKanbanDragAndDropReturn {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active card and its current list
    let activeCard = null;
    let fromListId = null;
    let fromIndex = -1;

    for (const list of board.lists) {
      const cardIndex = list.cards.findIndex((c: any) => c.id === activeId);
      if (cardIndex !== -1) {
        activeCard = list.cards[cardIndex];
        fromListId = list.id;
        fromIndex = cardIndex;
        break;
      }
    }

    if (!activeCard || !fromListId) return;

    // Find the target list and position
    let toListId = fromListId;
    let toIndex = 0;

    // Check if we're dropping on a list
    const targetList = board.lists.find((l: any) => l.id === overId);
    if (targetList) {
      toListId = targetList.id;
      toIndex = targetList.cards.length;
    } else {
      // Check if we're dropping on another card
      for (const list of board.lists) {
        const cardIndex = list.cards.findIndex((c: any) => c.id === overId);
        if (cardIndex !== -1) {
          toListId = list.id;
          toIndex = cardIndex;
          break;
        }
      }
    }

    // Move the card
    if (fromListId === toListId) {
      // Reorder within the same list
      useBoardStore.getState().reorderCards(boardId, fromListId, fromIndex, toIndex);
    } else {
      // Move to a different list
      useBoardStore.getState().moveCard(boardId, activeId, fromListId, toListId, toIndex);
    }

    setActiveId(null);
  };

  const getActiveCard = () => {
    if (!activeId) return null;

    for (const list of board.lists) {
      const card = list.cards.find((c: any) => c.id === activeId);
      if (card) return card;
    }
    return null;
  };

  return {
    sensors,
    activeId,
    handleDragStart,
    handleDragEnd,
    getActiveCard,
  };
}
