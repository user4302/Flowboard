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
  const { closeCardModal } = useUIStore();
  const { updateCard, createCard } = useBoardStore();
  const { handleSaveCard } = useTaskModalActions();

  const handleCloseCardModal = useCallback(() => {
    checklist.resetChecklist();
    closeCardModal();
  }, [closeCardModal, checklist]);

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
        closeCardModal();
      }
    } else if (currentBoardId && foundCard) {
      // Update existing card
      handleSaveCard(currentBoardId, foundCard.id, data, closeCardModal);
      // Sync checklist items if not in JSON import mode
      if (!isJSONImportMode) {
        checklist.syncChecklistToStore();
      }
    }
  }, [currentBoardId, foundCard, isJSONImportMode, cardJSONData, targetListId, createCard, updateCard, handleSaveCard, closeCardModal, checklist]);

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
