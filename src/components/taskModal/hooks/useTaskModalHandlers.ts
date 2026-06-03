import { useCallback } from 'react';
import { useBoardStore, useUIStore } from '@/store';
import { CardModalHandlers } from '../types/TaskModal.modal.types';
import { Card } from '@/lib/types';
import { CardJSON } from '@/lib/cardJsonUtils';

export function useTaskModalHandlers(
  currentBoardId: string | null,
  foundCard: Card | null | undefined,
  form: unknown,
  isJSONImportMode: boolean,
  cardJSONData: CardJSON | null,
  targetListId: string | null,
  checklist: {
    syncChecklistToStore: (checklistsToSync: Checklist[]) => void;
    resetChecklist: () => void;
    localChecklists: Checklist[];
  },
  labelManager: {
    syncLabelsToStore: () => void;
  }
): CardModalHandlers & { closeCardModal: () => void } {
  const { closeCardModal, closeCardModalWithoutUrlUpdate } = useUIStore();
  const { updateCard, createCard, archiveCard } = useBoardStore();

  const handleCloseCardModal = useCallback(() => {
    // Set global flag IMMEDIATELY to prevent URL-based reopening
    (window as any).__isClosingModal = true;

    checklist.resetChecklist();
    closeCardModalWithoutUrlUpdate();

    // Update URL to remove card ID with longer delay
    setTimeout(() => {
      import('@/store/boardStore').then(({ useBoardStore }) => {
        const boardStore = useBoardStore.getState();
        if (boardStore.currentBoardId) {
          const newUrl = `/board/${boardStore.currentBoardId}`;
          window.history.pushState({}, '', newUrl);
        }
      });

      // Reset flag after much longer delay to ensure URL change is fully processed
      setTimeout(() => {
        (window as any).__isClosingModal = false;
      }, 500); // Increased from 200ms to 500ms
    }, 50); // Reduced from 100ms to 50ms for faster response
  }, [closeCardModalWithoutUrlUpdate, checklist]);

  const handleSave = useCallback((data: Partial<Card>) => {
    if (isJSONImportMode && currentBoardId && targetListId && cardJSONData) {
      // Create new card from JSON data
      const newCard = createCard(currentBoardId, targetListId, data.title || 'Untitled Card');
      if (newCard) {
        // Update the new card with additional data
        const updateData: Partial<Card> = {
          description: data.description,
        };

        if (data.startDate) {
          updateData.startDate = new Date(data.startDate);
        }

        if (data.dueDate) {
          updateData.dueDate = new Date(data.dueDate);
        }

        // Only set priority if it's not null (exclude null values)
        if (data.priority !== null) {
          updateData.priority = data.priority;
        }

        updateCard(currentBoardId, newCard.id, updateData);
        handleCloseCardModal();
      }
    } else if (currentBoardId && foundCard) {
      // Update existing card directly without going through handleSaveCard
      const updateData: Partial<Card> = {
        title: data.title,
        description: data.description,
      };

      if (data.startDate) {
        updateData.startDate = new Date(data.startDate);
      }

      if (data.dueDate) {
        updateData.dueDate = new Date(data.dueDate);
      }

      // Only set priority if it's not null (exclude null values)
      if (data.priority !== null) {
        updateData.priority = data.priority;
      }

      // Sync checklist and label items first if not in JSON import mode
      if (!isJSONImportMode) {
        checklist.syncChecklistToStore(checklist.localChecklists);
        labelManager.syncLabelsToStore();
      }

      // Update the card
      updateCard(currentBoardId, foundCard.id, updateData);
      // Close modal using the same logic as cancel button
      handleCloseCardModal();
    }
  }, [currentBoardId, foundCard, isJSONImportMode, cardJSONData, targetListId, createCard, updateCard, handleCloseCardModal, checklist, labelManager]);

  const handleToggleCompleted = useCallback(() => {
    if (currentBoardId && foundCard) {
      updateCard(currentBoardId, foundCard.id, { completed: !foundCard.completed });
    }
  }, [currentBoardId, foundCard, updateCard]);

  const handleArchive = useCallback(() => {
    if (currentBoardId && foundCard) {
      archiveCard(currentBoardId, foundCard.id);
      handleCloseCardModal();
    }
  }, [currentBoardId, foundCard, archiveCard, handleCloseCardModal]);

  return {
    handleSave,
    handleToggleCompleted,
    handleArchive,
    closeCardModal: handleCloseCardModal
  };
}
