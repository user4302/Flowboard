'use client';

import { useState } from 'react';
import { useBoardStore } from '@/store';
import { useClickOutside } from '@/hooks';
import { DeleteConfirmation } from '../types';

export const useArchiveModal = (onClose: () => void) => {
  const { currentBoardId, getCurrentBoard, unarchiveCard, permanentlyDeleteArchivedCard } = useBoardStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    archivedCardId: '',
    cardTitle: '',
  });

  const modalRef = useClickOutside<HTMLDivElement>(onClose);
  const deleteModalRef = useClickOutside<HTMLDivElement>(() =>
    setDeleteConfirmation({ isOpen: false, archivedCardId: '', cardTitle: '' })
  );

  const currentBoard = getCurrentBoard();
  const archivedCards = currentBoard?.archivedCards || [];

  const handleUnarchive = async (archivedCardId: string) => {
    if (!currentBoardId) return;

    setIsProcessing(true);
    try {
      unarchiveCard(currentBoardId, archivedCardId);
    } catch (error) {
      console.error('Failed to unarchive card:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePermanentlyDelete = async (archivedCardId: string, cardTitle: string) => {
    setDeleteConfirmation({
      isOpen: true,
      archivedCardId,
      cardTitle,
    });
  };

  const confirmPermanentDelete = async () => {
    if (!currentBoardId || !deleteConfirmation.archivedCardId) return;

    setIsProcessing(true);
    try {
      permanentlyDeleteArchivedCard(currentBoardId, deleteConfirmation.archivedCardId);
      setDeleteConfirmation({ isOpen: false, archivedCardId: '', cardTitle: '' });
    } catch (error) {
      console.error('Failed to permanently delete card:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, archivedCardId: '', cardTitle: '' });
  };

  return {
    currentBoard,
    archivedCards,
    isProcessing,
    deleteConfirmation,
    modalRef,
    deleteModalRef,
    handleUnarchive,
    handlePermanentlyDelete,
    confirmPermanentDelete,
    closeDeleteConfirmation,
  };
};
