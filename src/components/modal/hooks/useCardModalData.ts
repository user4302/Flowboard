import { useMemo } from 'react';
import { useBoardStore, useUIStore } from '@/store';
import { useCardForm } from '@/components/card/hooks/useCardForm';
import { useChecklist } from '@/components/card/hooks/useChecklist';
import { CardModalData } from '../types/modal.types';

export function useCardModalData(): CardModalData & {
  form: any;
  checklist: any;
  currentBoardId: string | null;
  cardModalOpen: boolean;
  selectedCardId: string | null;
} {
  // Store hooks for state management
  const { cardModalOpen, selectedCardId } = useUIStore();
  const { boards, currentBoardId } = useBoardStore();

  // Find current board and selected card
  const currentBoard = boards.find(b => b.id === currentBoardId);
  const foundCard = currentBoard?.lists.flatMap(l => l.cards).find(c => c.id === selectedCardId);

  // Custom hooks - Pass safe defaults that hooks can handle
  const form = useCardForm({ card: foundCard || null });
  const checklist = useChecklist({
    boardId: currentBoardId || '',
    cardId: foundCard?.id || ''
  });

  const boardLabels = currentBoard?.labels || [];

  return useMemo(() => ({
    currentBoard,
    foundCard,
    boardLabels,
    form,
    checklist,
    currentBoardId,
    cardModalOpen,
    selectedCardId
  }), [currentBoard, foundCard, boardLabels, form, checklist, currentBoardId, cardModalOpen, selectedCardId]);
}
