import { useBoardStore, useUIStore } from '@/store';

export const useTaskModalCardActions = () => {
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

  const handleSaveCard = (boardId: string, cardId: string, data: any, onClose: () => void) => {
    const updateData: any = {
      title: data.title,
      description: data.description,
    };

    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }

    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate);
    }

    if (data.priority) {
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
