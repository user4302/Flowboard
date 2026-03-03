'use client';

import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBoardStore, useUIStore } from '@/store';
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
 * @interface KanbanViewProps
 */
interface KanbanViewProps {
  /** Unique identifier for the board to display */
  boardId: string;
}

/**
 * KanbanView component - Displays board in traditional kanban format
 * Provides drag-and-drop functionality for cards between lists
 * Supports creating new lists and cards with inline editing
 * Includes comprehensive search and filtering capabilities
 */
export function KanbanView({ boardId }: KanbanViewProps) {
  // Store hooks for board operations and UI state management
  const { boards, createList, createCard, updateList, deleteList } = useBoardStore();
  const { cardModalOpen, getColumnOrder, setColumnOrder } = useUIStore();

  // Local state to track which list's dropdown menu is currently open
  // This prevents multiple menus from being open simultaneously
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Find the current board from the boards array
  const board = boards.find((b) => b.id === boardId);

  // Get ordered lists based on user's saved column order preference
  // If no saved order exists, use the default order from the board
  const savedColumnOrder = getColumnOrder(boardId);
  const orderedLists = savedColumnOrder.length > 0
    ? savedColumnOrder
      // Map saved IDs to actual list objects
      .map(id => board?.lists.find(l => l.id === id))
      // Filter out any lists that no longer exist (type guard for TypeScript)
      .filter((list): list is typeof list => list !== undefined)
    : board?.lists || []; // Fallback to default order

  // Custom hook for comprehensive drag and drop functionality
  // Handles both card movement between lists and list reordering
  const {
    sensors,              // Configured drag sensors for pointer and keyboard input
    activeId,            // ID of the currently dragged item
    activeDataType,      // Type being dragged ('card' or 'list')
    handleDragStart,     // Handler for drag start events
    handleDragOver,      // Handler for drag over events (optimistic updates)
    handleDragEnd: originalHandleDragEnd,  // Original handler from the hook
    getActiveCard,       // Function to get active card data for overlay
    getActiveList,       // Function to get active list data for overlay
  } = useKanbanDragAndDrop({ boardId, board: board! });

  // Early return after all hooks are called
  if (!board) return null;

  /**
   * Enhanced drag end handler that wraps the original handler
   * 
   * This function extends the original drag end functionality to also persist
   * the column order to localStorage when lists are reordered. This ensures that
   * the user's preferred list layout is maintained across browser sessions.
   * 
   * @param event - The drag end event from @dnd-kit
   */
  const handleDragEnd = (event: DragEndEvent) => {
    // Initialize empty array to store the new column order
    let newOrder: string[] = [];

    // Only calculate new order if we're reordering lists (not cards)
    if (activeDataType === 'list' && event.over) {
      const { active, over } = event;
      const activeId = active.id as string;
      const overId = over.id as string;

      // Find current positions of the dragged list and target list
      const activeIndex = orderedLists.findIndex(l => l.id === activeId);
      const overIndex = orderedLists.findIndex(l => l.id === overId);

      // Only proceed if both positions are valid
      if (activeIndex !== -1 && overIndex !== -1) {
        // Create a copy of the current order
        newOrder = [...orderedLists.map(l => l.id)];
        // Remove the dragged list from its original position
        const [movedList] = newOrder.splice(activeIndex, 1);
        // Insert it at the new position
        newOrder.splice(overIndex, 0, movedList);
      }
    }

    // Call the original handler to perform the actual reordering in the store
    originalHandleDragEnd(event);

    // Persist the new column order to localStorage if we calculated one
    // This ensures the order is maintained on page refresh
    if (newOrder.length > 0) {
      setColumnOrder(boardId, newOrder);
    }
  };

  /**
   * Handle creating a new list
   * 
   * Creates a new list in the current board with the given title.
   * The list is added to the end of the current column order.
   * 
   * @param title - The title for the new list
   */
  const handleCreateList = (title: string) => {
    createList(boardId, title);
  };

  /**
   * Handle creating a new card in a specific list
   * 
   * Creates a new card with the given title in the specified list.
   * The card is added to the end of the list's current cards.
   * 
   * @param listId - ID of the list to add the card to
   * @param title - Title for the new card
   */
  const handleCreateCard = (listId: string, title: string) => {
    createCard(boardId, listId, title);
  };

  /**
   * Handle renaming a list
   * 
   * Updates the title of an existing list in the current board.
   * The change is immediately reflected in the UI and persisted.
   * 
   * @param listId - ID of the list to rename
   * @param newTitle - New title for the list
   */
  const handleRenameList = (listId: string, newTitle: string) => {
    updateList(boardId, listId, { title: newTitle });
  };

  /**
   * Handle deleting a list with confirmation
   * 
   * Shows a confirmation dialog to prevent accidental deletion.
   * If confirmed, deletes the list and all its cards from the board.
   * This action is irreversible and removes all contained cards.
   * 
   * @param listId - ID of the list to delete
   */
  const handleDeleteList = (listId: string) => {
    if (window.confirm('Are you sure you want to delete this list? All cards in this list will be deleted.')) {
      deleteList(boardId, listId);
    }
  };

  /**
   * Handle menu toggle for a specific list
   * 
   * Manages the state of list dropdown menus to ensure only one menu
   * is open at a time. This provides a better user experience by preventing
   * multiple menus from cluttering the interface.
   * 
   * @param listId - ID of the list whose menu is being toggled
   * @param isOpen - Whether the menu should be open (true) or closed (false)
   */
  const handleMenuToggle = (listId: string, isOpen: boolean) => {
    if (isOpen) {
      // Set this list as the only open menu
      setOpenMenuId(listId);
    } else {
      // Close all menus
      setOpenMenuId(null);
    }
  };

  return (
    <div className="flex h-full flex-col max-w-full">
      {/* Main Kanban Board with drag-and-drop context - only render when card modal is not open */}
      {cardModalOpen ? (
        // Render without DndContext when modal is open
        <>
          {/* Scrollable container for kanban lists */}
          <div className="flex-1 overflow-hidden relative">
            <div className="flex gap-4 h-full overflow-x-auto p-4 lg:p-6 absolute inset-0">
              <div className="flex gap-4 h-full min-w-max">
                {/* Render each list without sortable context */}
                {orderedLists.map((list) => (
                  <KanbanList
                    key={list.id}
                    list={list}
                    members={board.members}
                    onAddCard={handleCreateCard}
                    onRenameList={handleRenameList}
                    onDeleteList={handleDeleteList}
                    // Pass menu toggle handler with the specific list ID
                    onMenuToggle={(isOpen) => handleMenuToggle(list.id, isOpen)}
                    // Disable menu if another list's menu is open
                    isAnyMenuOpen={openMenuId !== null && openMenuId !== list.id}
                  />
                ))}

                {/* Add new list input component */}
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
        </>
      ) : (
        // Render with DndContext when modal is closed
        <DndContext
          // Use stable sensors reference
          sensors={sensors}
          // Use closest center collision detection for better drop zone accuracy
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* Scrollable container for kanban lists */}
          <div className="flex-1 overflow-hidden relative">
            <div className="flex gap-4 h-full overflow-x-auto p-4 lg:p-6 absolute inset-0">
              <div className="flex gap-4 h-full min-w-max">
                {/* Sortable context for list reordering */}
                <SortableContext
                  items={orderedLists.map((l) => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {/* Render each list as a sortable component */}
                  {orderedLists.map((list) => (
                    <SortableKanbanList
                      key={list.id}
                      list={list}
                      members={board.members}
                      onAddCard={handleCreateCard}
                      onRenameList={handleRenameList}
                      onDeleteList={handleDeleteList}
                      // Pass menu toggle handler with the specific list ID
                      onMenuToggle={(isOpen) => handleMenuToggle(list.id, isOpen)}
                      // Disable menu if another list's menu is open
                      isAnyMenuOpen={openMenuId !== null && openMenuId !== list.id}
                    />
                  ))}
                </SortableContext>

                {/* Add new list input component */}
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
      )}

      {/* Drag overlay for visual feedback during drag operations */}
      <DragOverlayWrapper activeId={activeId}>
        {/* Show card overlay when dragging a card */}
        {activeDataType === 'card' && getActiveCard() && (
          <TaskCard
            card={getActiveCard()!}
            members={board.members}
            // Empty click handler to prevent interaction during drag
            onClick={() => { }}
          />
        )}
        {/* Show list overlay when dragging a list */}
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
