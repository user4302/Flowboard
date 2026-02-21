import { useBoardStore } from '@/store';
import { DragItem } from '@/lib/types';

export function useDragAndDrop(boardId: string) {
  const { moveCard, reorderCards, reorderLists } = useBoardStore();

  const handleCardDrop = (
    cardId: string,
    fromListId: string,
    toListId: string,
    position: number
  ) => {
    if (fromListId === toListId) {
      // Reorder within the same list
      const currentBoard = useBoardStore.getState().getCurrentBoard();
      if (!currentBoard) return;

      const fromList = currentBoard.lists.find((l) => l.id === fromListId);
      if (!fromList) return;

      const fromIndex = fromList.cards.findIndex((c) => c.id === cardId);
      if (fromIndex === -1) return;

      reorderCards(boardId, fromListId, fromIndex, position);
    } else {
      // Move to a different list
      moveCard(boardId, cardId, fromListId, toListId, position);
    }
  };

  const handleListDrop = (fromIndex: number, toIndex: number) => {
    reorderLists(boardId, fromIndex, toIndex);
  };

  return {
    handleCardDrop,
    handleListDrop,
  };
}
