import { useState } from 'react';
import { useBoardStore } from '@/store';

interface UseChecklistProps {
  boardId: string;
  cardId: string;
}

export const useChecklist = ({ boardId, cardId }: UseChecklistProps) => {
  const {
    addChecklistItem,
    updateChecklistItem,
    removeChecklistItem
  } = useBoardStore();

  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [showNewChecklistInput, setShowNewChecklistInput] = useState(false);

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim() && boardId && cardId) {
      addChecklistItem(boardId, cardId, newChecklistItem.trim());
      setNewChecklistItem('');
      setShowNewChecklistInput(false);
    }
  };

  const handleToggleChecklistItem = (itemId: string, done: boolean) => {
    if (boardId && cardId) {
      updateChecklistItem(boardId, cardId, itemId, { done });
    }
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    if (boardId && cardId) {
      removeChecklistItem(boardId, cardId, itemId);
    }
  };

  const handleCancelNewItem = () => {
    setShowNewChecklistInput(false);
    setNewChecklistItem('');
  };

  const handleStartNewItem = () => {
    setShowNewChecklistInput(true);
  };

  return {
    newChecklistItem,
    showNewChecklistInput,
    setNewChecklistItem,
    handleAddChecklistItem,
    handleToggleChecklistItem,
    handleDeleteChecklistItem,
    handleCancelNewItem,
    handleStartNewItem
  };
};
