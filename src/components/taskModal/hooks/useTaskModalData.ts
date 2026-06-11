import { useMemo, useEffect, useState } from 'react';
import { useBoardStore, useUIStore } from '@/store';
import { useTaskModalForm } from './useTaskModalForm';
import { useTaskModalChecklist } from './useTaskModalChecklist';
import { useTaskModalLabelManager } from '../components/LabelManager/hooks/useTaskModalLabelManager';
import { CardModalData } from '../types/TaskModal.modal.types';
import { CardJSON } from '@/lib/cardJsonUtils';

export function useTaskModalData() {
  // Store hooks for state management
  const { cardModalOpen, selectedCardId, cardJSONData, targetListId } = useUIStore();
  const { boards, currentBoardId } = useBoardStore();

  // State to track when we're waiting for a newly created card
  const [isWaitingForCard, setIsWaitingForCard] = useState(false);

  // Find current board and selected card
  const currentBoard = useMemo(() => boards.find(b => b.id === currentBoardId), [boards, currentBoardId]);
  const foundCard = useMemo(() => currentBoard?.lists.flatMap(l => l.cards).find(c => c.id === selectedCardId), [currentBoard, selectedCardId]);
  const initialChecklists = useMemo(() => foundCard?.checklists || [], [foundCard]);
  const initialLabelIds = useMemo(() => foundCard?.labelIds || [], [foundCard]);

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
    initialChecklists: initialChecklists
  });

  const labelManager = useTaskModalLabelManager({
    boardId: currentBoardId || '',
    cardId: foundCard?.id || '',
    initialSelectedLabelIds: initialLabelIds
  });

  const memoizedChecklist = useMemo(() => ({
    ...checklist,
    isDirty: checklist.isDirty,
    localChecklists: checklist.localChecklists,
    reorderChecklistItems: checklist.reorderChecklistItems
  }), [checklist.localChecklists, checklist.isDirty, checklist.addChecklist, checklist.updateChecklist, checklist.removeChecklist, checklist.addChecklistItem, checklist.addChecklistItems, checklist.updateChecklistItem, checklist.removeChecklistItem, checklist.reorderChecklistItems, checklist.syncChecklistToStore, checklist.resetChecklist, checklist.resetDirty]);

  const memoizedLabelManager = useMemo(() => ({
    ...labelManager
  }), [labelManager.localSelectedLabelIds, labelManager.isDirty, labelManager.view, labelManager.searchTerm, labelManager.editingLabel, labelManager.labelTitle, labelManager.labelColor, labelManager.handleToggleLabel, labelManager.handleCreateLabel, labelManager.handleUpdateLabel, labelManager.handleDeleteLabel, labelManager.syncLabelsToStore, labelManager.openEdit, labelManager.openCreate]);

  // Force form re-initialization when a newly created card is found
  useEffect(() => {
    if (foundCard && selectedCardId && !isWaitingForCard) {
      // This ensures the form is properly initialized with the card data
      // when it becomes available after the race condition resolves
      form.reset({
        title: foundCard.title || '',
        description: foundCard.description || '',
        startDate: foundCard.startDate ? foundCard.startDate.toISOString() : '',
        dueDate: foundCard.dueDate ? foundCard.dueDate.toISOString() : '',
        priority: foundCard.priority !== undefined ? foundCard.priority : null,
      });
    }
  }, [foundCard, selectedCardId, isWaitingForCard, form.reset]);

  const boardLabels = useMemo(() => currentBoard?.labels || [], [currentBoard?.labels]);

  return useMemo(() => ({
    currentBoard: currentBoard || null,
    foundCard,
    boardLabels,
    form,
    checklist: memoizedChecklist,
    labelManager: memoizedLabelManager,
    currentBoardId,
    cardModalOpen,
    selectedCardId,
    cardJSONData,
    targetListId,
    isJSONImportMode
  }), [currentBoard, foundCard, boardLabels, form, memoizedChecklist, memoizedLabelManager, currentBoardId, cardModalOpen, selectedCardId, cardJSONData, targetListId, isJSONImportMode]);
}

