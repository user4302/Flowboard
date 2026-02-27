'use client';

import { useState } from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBoardStore, useUIStore } from '@/store';
import { cn } from '@/lib/utils';
import { DragOverlayWrapper, InlineInput } from '@/components/ui';
import { Card } from '@/components/card';
import {
  KanbanList,
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
 */
export function KanbanView({ boardId }: KanbanViewProps) {
  // Store hooks for board operations and UI state
  const { boards, createList, createCard, updateList, deleteList } = useBoardStore();
  const { searchTerm } = useUIStore();

  // State to manage which list menu is open
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Find the current board
  const board = boards.find((b) => b.id === boardId);
  if (!board) return null;

  // Use custom hook for drag and drop functionality
  const {
    sensors,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    getActiveCard,
  } = useKanbanDragAndDrop({ boardId, board });

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full flex-col max-w-full">
        <div className="flex-1 overflow-hidden relative">
          <div className="flex gap-4 h-full overflow-x-auto p-4 lg:p-6 absolute inset-0 max-w-full">
            <SortableContext items={board.lists.map((l) => l.id)} strategy={verticalListSortingStrategy}>
              {board.lists.map((list) => (
                <KanbanList
                  key={list.id}
                  list={list}
                  members={board.members}
                  onAddCard={handleCreateCard}
                  onRenameList={handleRenameList}
                  onDeleteList={handleDeleteList}
                  searchTerm={searchTerm}
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
              className="justify-center text-center"
              onAdd={handleCreateList}
            />
          </div>
        </div>
      </div>

      {/* Drag overlay for visual feedback during drag operations */}
      <DragOverlayWrapper activeId={activeId}>
        {getActiveCard() && (
          <Card
            card={getActiveCard()!}
            members={board.members}
            onClick={() => { }}
          />
        )}
      </DragOverlayWrapper>
    </DndContext>
  );
}
