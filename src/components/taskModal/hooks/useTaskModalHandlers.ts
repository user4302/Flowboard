import { useCallback } from 'react';
import { useBoardStore, useUIStore } from '@/store';
import { useTaskModalActions } from './useTaskModalActions';
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
    syncChecklistToStore: () => void;
    resetChecklist: () => void;
  }
): CardModalHandlers & { closeCardModal: () => void } {
  const { closeCardModal, closeCardModalWithoutUrlUpdate } = useUIStore();
  const { updateCard, createCard } = useBoardStore();
  const { handleSaveCard } = useTaskModalActions();

  const handleCloseCardModal = useCallback(() => {
    // Set global flag IMMEDIATELY to prevent dynamic route from reopening modal
    (window as any).__isClosingModal = true;

    checklist.resetChecklist();
    closeCardModalWithoutUrlUpdate();

    // Update URL after a short delay to prevent parsing loop
    setTimeout(() => {
      import('@/store/boardStore').then(({ useBoardStore }) => {
        const boardStore = useBoardStore.getState();
        if (boardStore.currentBoardId) {
          const newUrl = `/board/${boardStore.currentBoardId}`;
          window.history.pushState({}, '', newUrl);
        } else {
          window.history.pushState({}, '', '/');
        }
      });

      // Reset flags after a longer delay to ensure URL change is processed
      setTimeout(() => {
        (window as any).__isClosingModal = false;
      }, 200);
    }, 100);
  }, [closeCardModalWithoutUrlUpdate, checklist]);

  const handleSave = useCallback((data: Partial<Card>) => {
    if (isJSONImportMode && currentBoardId && targetListId && cardJSONData) {
      // Create new card from JSON data
      const newCard = createCard(currentBoardId, targetListId, data.title || 'Untitled Card');
      if (newCard) {
        // Update the new card with additional data
        updateCard(currentBoardId, newCard.id, {
          description: data.description,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          priority: data.priority,
        });
        handleCloseCardModal(); // Use our custom handler
      }
    } else if (currentBoardId && foundCard) {
      // Update existing card
      handleSaveCard(currentBoardId, foundCard.id, data, handleCloseCardModal); // Use our custom handler
      // Sync checklist items if not in JSON import mode
      if (!isJSONImportMode) {
        checklist.syncChecklistToStore();
      }
    }
  }, [currentBoardId, foundCard, isJSONImportMode, cardJSONData, targetListId, createCard, updateCard, handleSaveCard, handleCloseCardModal, checklist]);

  const handleToggleCompleted = useCallback(() => {
    if (currentBoardId && foundCard) {
      updateCard(currentBoardId, foundCard.id, { completed: !foundCard.completed });
    }
  }, [currentBoardId, foundCard, updateCard]);

  return {
    handleSave,
    handleToggleCompleted,
    closeCardModal: handleCloseCardModal
  };
}
