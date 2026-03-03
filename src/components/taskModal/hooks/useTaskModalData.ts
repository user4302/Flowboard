import { useMemo } from 'react';
import { useBoardStore, useUIStore } from '@/store';
import { useTaskModalForm } from './useTaskModalForm';
import { useTaskModalChecklist } from './useTaskModalChecklist';
import { CardModalData } from '../types/TaskModal.modal.types';

export function useTaskModalData(): CardModalData & {
  form: any;
  checklist: any;
  currentBoardId: string | null;
  cardModalOpen: boolean;
  selectedCardId: string | null;
  cardJSONData: any;
  targetListId: string | null;
  isJSONImportMode: boolean;
} {
  // Store hooks for state management
  const { cardModalOpen, selectedCardId, cardJSONData, targetListId } = useUIStore();
  const { boards, currentBoardId } = useBoardStore();

  // Find current board and selected card
  const currentBoard = boards.find(b => b.id === currentBoardId);
  const foundCard = currentBoard?.lists.flatMap(l => l.cards).find(c => c.id === selectedCardId);

  // Determine if we're in JSON import mode
  const isJSONImportMode = !!cardJSONData && !!targetListId;

  // Custom hooks - Pass safe defaults that hooks can handle
  const form = useTaskModalForm({
    card: foundCard || null,
    cardJSON: isJSONImportMode ? cardJSONData : null
  });
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
    selectedCardId,
    cardJSONData,
    targetListId,
    isJSONImportMode
  }), [currentBoard, foundCard, boardLabels, form, checklist, currentBoardId, cardModalOpen, selectedCardId, cardJSONData, targetListId, isJSONImportMode]);
}
