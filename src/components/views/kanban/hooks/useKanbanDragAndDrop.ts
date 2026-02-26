'use client';

import { useState } from 'react';
import {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { useBoardStore } from '@/store';

interface UseKanbanDragAndDropProps {
  boardId: string;
  board: any;
}

interface UseKanbanDragAndDropReturn {
  sensors: any[];
  activeId: string | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
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

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find our active card's list
    let activeListId = null;
    for (const list of board.lists) {
      if (list.cards.some((c: any) => c.id === activeId)) {
        activeListId = list.id;
        break;
      }
    }

    // Find the list we are hovering over
    // It could be the list itself or a card within that list
    let overListId = null;
    const overList = board.lists.find((l: any) => l.id === overId);
    if (overList) {
      overListId = overList.id;
    } else {
      for (const list of board.lists) {
        if (list.cards.some((c: any) => c.id === overId)) {
          overListId = list.id;
          break;
        }
      }
    }

    if (!activeListId || !overListId || activeListId === overListId) return;

    // We are dragging over a different list!
    // Tell the store to optimistically move the card
    const overIndex = board.lists.find((l: any) => l.id === overListId).cards.findIndex((c: any) => c.id === overId);
    const newIndex = overIndex >= 0 ? overIndex : 0;

    useBoardStore.getState().moveCard(boardId, activeId, activeListId, overListId, newIndex);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the current list and position
    let activeListId = null;
    let fromIndex = -1;
    for (const list of board.lists) {
      const idx = list.cards.findIndex((c: any) => c.id === activeId);
      if (idx !== -1) {
        activeListId = list.id;
        fromIndex = idx;
        break;
      }
    }

    if (!activeListId) return;

    // Find target list and index
    let overListId = null;
    let toIndex = -1;

    const overList = board.lists.find((l: any) => l.id === overId);
    if (overList) {
      overListId = overList.id;
      toIndex = overList.cards.length;
    } else {
      for (const list of board.lists) {
        const idx = list.cards.findIndex((c: any) => c.id === overId);
        if (idx !== -1) {
          overListId = list.id;
          toIndex = idx;
          break;
        }
      }
    }

    if (!overListId) return;

    if (activeListId === overListId) {
      useBoardStore.getState().reorderCards(boardId, activeListId, fromIndex, toIndex);
    } else {
      useBoardStore.getState().moveCard(boardId, activeId, activeListId, overListId, toIndex);
    }
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
    handleDragOver,
    handleDragEnd,
    getActiveCard,
  };
}
