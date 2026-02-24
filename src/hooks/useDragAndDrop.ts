import { useBoardStore } from '@/store';
import { DragItem } from '@/lib/types';

/**
 * useDragAndDrop hook - Handles drag and drop operations for cards and lists
 * Provides functions to handle card movement between lists and list reordering
 * Integrates with board store to persist drag and drop changes
 * 
 * @param boardId - ID of the board to perform drag and drop operations on
 * @returns Object with drag and drop handler functions
 */
export function useDragAndDrop(boardId: string) {
  // Get board store methods for moving and reordering
  const { moveCard, reorderCards, reorderLists } = useBoardStore();

  /**
   * Handle card drop operation
   * Moves cards between lists or reorders within the same list
   * @param cardId - ID of the card being moved
   * @param fromListId - ID of the source list
   * @param toListId - ID of the target list
   * @param position - Target position index
   */
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

  /**
   * Handle list drop operation
   * Reorders lists within the board
   * @param fromIndex - Source list index
   * @param toIndex - Target list index
   */
  const handleListDrop = (fromIndex: number, toIndex: number) => {
    reorderLists(boardId, fromIndex, toIndex);
  };

  return {
    handleCardDrop,
    handleListDrop,
  };
}
