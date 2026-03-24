import { useMemo, useEffect, useState } from 'react';
import { useBoardStore, useUIStore } from '@/store';
import { useTaskModalForm } from './useTaskModalForm';
import { useTaskModalChecklist } from './useTaskModalChecklist';
import { CardModalData } from '../types/TaskModal.modal.types';
import { CardJSON } from '@/lib/cardJsonUtils';

export function useTaskModalData(): CardModalData & {
  form: ReturnType<typeof useTaskModalForm>;
  checklist: ReturnType<typeof useTaskModalChecklist>;
  currentBoardId: string | null;
  cardModalOpen: boolean;
  selectedCardId: string | null;
  cardJSONData: CardJSON | null;
  targetListId: string | null;
  isJSONImportMode: boolean;
} {
  // Store hooks for state management
  const { cardModalOpen, selectedCardId, cardJSONData, targetListId } = useUIStore();
  const { boards, currentBoardId } = useBoardStore();

  // State to track when we're waiting for a newly created card
  const [isWaitingForCard, setIsWaitingForCard] = useState(false);

  // Find current board and selected card
  const currentBoard = boards.find(b => b.id === currentBoardId);
  const foundCard = currentBoard?.lists.flatMap(l => l.cards).find(c => c.id === selectedCardId);

  // Determine if we're in JSON import mode
  const isJSONImportMode = !!cardJSONData && !!targetListId;

  // Handle race condition for newly created cards
  useEffect(() => {
    if (selectedCardId && cardModalOpen && !foundCard && !isJSONImportMode && !isWaitingForCard) {
      setIsWaitingForCard(true);
      // Give store more time to update and try multiple times
      let attempts = 0;
      const maxAttempts = 10;

      const checkForCard = () => {
        attempts++;
        // Re-check if card is found
        const currentBoard = boards.find(b => b.id === currentBoardId);
        const card = currentBoard?.lists.flatMap(l => l.cards).find(c => c.id === selectedCardId);

        if (card || attempts >= maxAttempts) {
          setIsWaitingForCard(false);
        } else {
          setTimeout(checkForCard, 100);
        }
      };

      checkForCard();
    } else if (foundCard && isWaitingForCard) {
      setIsWaitingForCard(false);
    }
  }, [selectedCardId, cardModalOpen, foundCard, isJSONImportMode, isWaitingForCard, currentBoardId, boards]);

  // Custom hooks - Pass safe defaults that hooks can handle
  const form = useTaskModalForm({
    card: foundCard || null,
    cardJSON: isJSONImportMode ? cardJSONData : null
  });
  const checklist = useTaskModalChecklist({
    boardId: currentBoardId || '',
    cardId: foundCard?.id || '',
    initialChecklists: foundCard?.checklists || []
  });

  // Force form re-initialization when a newly created card is found
  useEffect(() => {
    if (foundCard && selectedCardId && !isWaitingForCard) {
      // This ensures the form is properly initialized with the card data
      // when it becomes available after the race condition resolves
      form.reset({
        title: foundCard.title || '',
        description: foundCard.description || '',
        startDate: foundCard.startDate ? foundCard.startDate.toISOString().split('T')[0] : '',
        dueDate: foundCard.dueDate ? foundCard.dueDate.toISOString().split('T')[0] : '',
        priority: foundCard.priority || null,
      });
    }
  }, [foundCard, selectedCardId, isWaitingForCard, form.reset]);

  const boardLabels = useMemo(() => currentBoard?.labels || [], [currentBoard?.labels]);

  return useMemo(() => ({
    currentBoard: currentBoard || null,
    foundCard,
    boardLabels,
    form,
    checklist,
    currentBoardId,
    cardModalOpen,
    selectedCardId,
    cardJSONData,
    targetListId,
    isJSONImportMode
  }), [currentBoard, foundCard, boardLabels, form, checklist, currentBoardId, cardModalOpen, selectedCardId, cardJSONData, targetListId, isJSONImportMode]);
}
