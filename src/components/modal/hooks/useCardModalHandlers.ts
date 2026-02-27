import { useCallback } from 'react';
import { useBoardStore, useUIStore } from '@/store';
import { useCardActions } from '@/components/card/hooks/useCardActions';
import { CardModalHandlers } from '../types/modal.types';

export function useCardModalHandlers(
  currentBoardId: string | null,
  foundCard: any,
  form: any
): CardModalHandlers & { closeCardModal: () => void } {
  const { closeCardModal } = useUIStore();
  const { updateCard } = useBoardStore();
  const { handleSaveCard } = useCardActions();

  const handleSave = useCallback((data: any) => {
    if (currentBoardId && foundCard) {
      handleSaveCard(currentBoardId, foundCard.id, data, closeCardModal);
    }
  }, [currentBoardId, foundCard, handleSaveCard, closeCardModal]);

  const handleToggleCompleted = useCallback(() => {
    if (currentBoardId && foundCard) {
      updateCard(currentBoardId, foundCard.id, { completed: !foundCard.completed });
    }
  }, [currentBoardId, foundCard, updateCard]);

  return {
    handleSave,
    handleToggleCompleted,
    closeCardModal
  };
}
