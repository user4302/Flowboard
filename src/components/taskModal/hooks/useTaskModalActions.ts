import { useBoardStore, useUIStore } from '@/store';
import { Card } from '@/lib/types';

export const useTaskModalActions = () => {
  const { updateCard } = useBoardStore();
  const { openCardModal } = useUIStore();

  const handleToggleCompleted = (e: React.MouseEvent, boardId: string, cardId: string, currentCompleted: boolean) => {
    e.stopPropagation();
    updateCard(boardId, cardId, { completed: !currentCompleted });
  };

  const handleCardClick = (cardId: string, onClick: () => void) => {
    onClick();
    openCardModal(cardId);
  };

  const handleSaveCard = (boardId: string, cardId: string, data: Partial<Card>, onClose: () => void) => {
    const updateData: Partial<Card> = {
      title: data.title,
      description: data.description,
    };

    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }

    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate);
    }

    // Only include priority if it's not null/undefined
    if (data.priority !== null && data.priority !== undefined) {
      updateData.priority = data.priority;
    }

    updateCard(boardId, cardId, updateData);
    onClose();
  };

  return {
    handleToggleCompleted,
    handleCardClick,
    handleSaveCard
  };
};
