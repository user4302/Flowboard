'use client';

import { useState } from 'react';
import { DndContext, closestCorners, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useBoardStore, useUIStore } from '@/store';
import { cn } from '@/lib/utils';
import { DragOverlayWrapper, InlineInput } from '@/components/ui';
import { TaskCard } from '@/components/taskCard';
import {
  KanbanList,
  SortableKanbanList,
  useKanbanDragAndDrop,
} from './kanban';

/**
 * KanbanView component props interface
 * Defines the props for the kanban board view component
 */
interface KanbanViewProps {
  // ID of the board to display
  boardId: string;
}

/**
 * KanbanView component - Displays board in traditional kanban format
 * Provides drag-and-drop functionality for cards between lists
 * Supports creating new lists and cards with inline editing
 * Includes comprehensive search and filtering capabilities
 */
export function KanbanView({ boardId }: KanbanViewProps) {
  // Store hooks for board operations and UI state
  const { boards, createList, createCard, updateList, deleteList, reorderLists } = useBoardStore();
  const { cardModalOpen, getColumnOrder, setColumnOrder } = useUIStore();

  // State to manage which list menu is open
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Find the current board
  const board = boards.find((b) => b.id === boardId);
  if (!board) return null;

  // Get ordered lists based on saved column order
  const savedColumnOrder = getColumnOrder(boardId);
  const orderedLists = savedColumnOrder.length > 0
    ? savedColumnOrder
      .map(id => board.lists.find(l => l.id === id))
      .filter((list): list is typeof board.lists[0] => list !== undefined)
    : board.lists;

  // Use custom hook for drag and drop functionality
  const {
    sensors,
    activeId,
    activeDataType,
    handleDragStart,
    handleDragOver,
    handleDragEnd: originalHandleDragEnd,
    getActiveCard,
    getActiveList,
  } = useKanbanDragAndDrop({ boardId, board });

  // Wrap handleDragEnd to update column order in localStorage
  const handleDragEnd = (event: any) => {
    // Calculate the new order before calling the original handler
    let newOrder: string[] = [];

    if (activeDataType === 'list' && event.over) {
      const { active, over } = event;
      const activeId = active.id as string;
      const overId = over.id as string;

      const activeIndex = orderedLists.findIndex(l => l.id === activeId);
      const overIndex = orderedLists.findIndex(l => l.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        // Create new order by moving the active list to the new position
        newOrder = [...orderedLists.map(l => l.id)];
        const [movedList] = newOrder.splice(activeIndex, 1);
        newOrder.splice(overIndex, 0, movedList);
      }
    }

    // Call the original handler
    originalHandleDragEnd(event);

    // Update localStorage with the new order
    if (newOrder.length > 0) {
      setColumnOrder(boardId, newOrder);
    }
  };

  /**
   * Handle creating a new list
   * Validates input and creates list through store
   */
  const handleCreateList = (title: string) => {
    createList(boardId, title);
  };

  /**
   * Handle creating a new card in a specific list
   * Validates input and creates card through store
   * @param listId - ID of the list to add card to
   * @param title - Title of the new card
   */
  const handleCreateCard = (listId: string, title: string) => {
    createCard(boardId, listId, title);
  };

  /**
   * Handle renaming a list
   * @param listId - ID of the list to rename
   * @param newTitle - New title for the list
   */
  const handleRenameList = (listId: string, newTitle: string) => {
    updateList(boardId, listId, { title: newTitle });
  };

  /**
   * Handle deleting a list
   * @param listId - ID of the list to delete
   */
  const handleDeleteList = (listId: string) => {
    if (window.confirm('Are you sure you want to delete this list? All cards in this list will be deleted.')) {
      deleteList(boardId, listId);
    }
  };

  /**
   * Handle menu toggle for a specific list
   * @param listId - ID of the list
   * @param isOpen - Whether the menu is open
   */
  const handleMenuToggle = (listId: string, isOpen: boolean) => {
    if (isOpen) {
      setOpenMenuId(listId);
    } else {
      setOpenMenuId(null);
    }
  };

  return (
    <div className="flex h-full flex-col max-w-full">
      {/* Kanban Board */}
      <DndContext
        sensors={cardModalOpen ? [] : sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-hidden relative">
          <div className="flex gap-4 h-full overflow-x-auto p-4 lg:p-6 absolute inset-0">
            <div className="flex gap-4 h-full min-w-max">
              <SortableContext items={orderedLists.map((l) => l.id)} strategy={horizontalListSortingStrategy}>
                {orderedLists.map((list) => (
                  <SortableKanbanList
                    key={list.id}
                    list={list}
                    members={board.members}
                    onAddCard={handleCreateCard}
                    onRenameList={handleRenameList}
                    onDeleteList={handleDeleteList}
                    onMenuToggle={(isOpen) => handleMenuToggle(list.id, isOpen)}
                    isAnyMenuOpen={openMenuId !== null && openMenuId !== list.id}
                  />
                ))}
              </SortableContext>

              <InlineInput
                placeholder="Enter list title..."
                addText="Add list"
                triggerText="Add a list"
                containerWidth="20rem"
                className="flex-shrink-0 h-fit"
                onAdd={handleCreateList}
              />
            </div>
          </div>
        </div>
      </DndContext>

      {/* Drag overlay for visual feedback during drag operations */}
      <DragOverlayWrapper activeId={activeId}>
        {activeDataType === 'card' && getActiveCard() && (
          <TaskCard
            card={getActiveCard()!}
            members={board.members}
            onClick={() => { }}
          />
        )}
        {activeDataType === 'list' && getActiveList() && (
          <div className="w-80 flex-shrink-0 opacity-75">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
              <h3 className="font-medium text-slate-900 dark:text-slate-100">
                {getActiveList()!.title}
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {getActiveList()!.cards.length}
              </span>
            </div>
          </div>
        )}
      </DragOverlayWrapper>
    </div>
  );
}
