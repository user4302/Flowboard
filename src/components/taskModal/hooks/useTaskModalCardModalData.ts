import { useMemo } from 'react';
import { useBoardStore, useUIStore } from '@/store';
import { useTaskModalCardForm } from './useTaskModalCardForm';
import { useTaskModalChecklist } from './useTaskModalChecklist';
import { CardModalData } from '../types/TaskModal.modal.types';

export function useTaskModalCardModalData(): CardModalData & {
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
  const form = useTaskModalCardForm({ card: foundCard || null });
  const checklist = useTaskModalChecklist({
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
