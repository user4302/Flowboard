import { renderHook } from '@testing-library/react';
import { useDragAndDrop } from '../useDragAndDrop';
import { useBoardStore } from '@/store';

// Mock the board store
jest.mock('@/store');

// Create a mock store state
const mockBoardStoreState = {
  moveCard: jest.fn(),
  reorderCards: jest.fn(),
  reorderLists: jest.fn(),
  getCurrentBoard: jest.fn()
};

describe('useDragAndDrop', () => {
  const mockMoveCard = mockBoardStoreState.moveCard;
  const mockReorderCards = mockBoardStoreState.reorderCards;
  const mockReorderLists = mockBoardStoreState.reorderLists;
  const mockGetCurrentBoard = mockBoardStoreState.getCurrentBoard;

  beforeEach(() => {
    jest.clearAllMocks();

    (useBoardStore as unknown as jest.Mock).mockReturnValue(mockBoardStoreState);
    (useBoardStore as any).getState = jest.fn(() => mockBoardStoreState);
  });

  const boardId = 'board-123';
  const cardId = 'card-456';
  const fromListId = 'list-1';
  const toListId = 'list-2';
  const position = 1;

  describe('handleCardDrop', () => {
    it('should reorder cards within the same list', () => {
      const mockBoard = {
        id: boardId,
        lists: [
          {
            id: fromListId,
            cards: [
              { id: 'card-1' },
              { id: cardId },
              { id: 'card-3' }
            ]
          },
          {
            id: 'list-2',
            cards: []
          }
        ]
      };

      mockGetCurrentBoard.mockReturnValue(mockBoard);

      const { result } = renderHook(() => useDragAndDrop(boardId));

      result.current.handleCardDrop(cardId, fromListId, fromListId, 2);

      expect(mockGetCurrentBoard).toHaveBeenCalled();
      expect(mockReorderCards).toHaveBeenCalledWith(boardId, fromListId, 1, 2);
      expect(mockMoveCard).not.toHaveBeenCalled();
    });

    it('should move card to different list', () => {
      const { result } = renderHook(() => useDragAndDrop(boardId));

      result.current.handleCardDrop(cardId, fromListId, toListId, position);

      expect(mockMoveCard).toHaveBeenCalledWith(boardId, cardId, fromListId, toListId, position);
      expect(mockReorderCards).not.toHaveBeenCalled();
    });

    it('should handle reordering when card is not found', () => {
      const mockBoard = {
        id: boardId,
        lists: [
          {
            id: fromListId,
            cards: [
              { id: 'card-1' },
              { id: 'card-2' }
            ]
          }
        ]
      };

      mockGetCurrentBoard.mockReturnValue(mockBoard);

      const { result } = renderHook(() => useDragAndDrop(boardId));

      result.current.handleCardDrop(cardId, fromListId, fromListId, 1);

      expect(mockReorderCards).not.toHaveBeenCalled();
      expect(mockMoveCard).not.toHaveBeenCalled();
    });

    it('should handle reordering when list is not found', () => {
      const mockBoard = {
        id: boardId,
        lists: [
          {
            id: 'different-list',
            cards: []
          }
        ]
      };

      mockGetCurrentBoard.mockReturnValue(mockBoard);

      const { result } = renderHook(() => useDragAndDrop(boardId));

      result.current.handleCardDrop(cardId, fromListId, fromListId, 1);

      expect(mockReorderCards).not.toHaveBeenCalled();
      expect(mockMoveCard).not.toHaveBeenCalled();
    });

    it('should handle when no current board exists', () => {
      mockGetCurrentBoard.mockReturnValue(null);

      const { result } = renderHook(() => useDragAndDrop(boardId));

      result.current.handleCardDrop(cardId, fromListId, fromListId, 1);

      expect(mockReorderCards).not.toHaveBeenCalled();
      expect(mockMoveCard).not.toHaveBeenCalled();
    });

    it('should handle moving to first position', () => {
      const { result } = renderHook(() => useDragAndDrop(boardId));

      result.current.handleCardDrop(cardId, fromListId, toListId, 0);

      expect(mockMoveCard).toHaveBeenCalledWith(boardId, cardId, fromListId, toListId, 0);
    });

    it('should handle moving to last position', () => {
      const { result } = renderHook(() => useDragAndDrop(boardId));

      result.current.handleCardDrop(cardId, fromListId, toListId, 5);

      expect(mockMoveCard).toHaveBeenCalledWith(boardId, cardId, fromListId, toListId, 5);
    });
  });

  describe('handleListDrop', () => {
    it('should reorder lists', () => {
      const { result } = renderHook(() => useDragAndDrop(boardId));

      result.current.handleListDrop(0, 2);

      expect(mockReorderLists).toHaveBeenCalledWith(boardId, 0, 2);
    });

    it('should handle reordering to same position', () => {
      const { result } = renderHook(() => useDragAndDrop(boardId));

      result.current.handleListDrop(1, 1);

      expect(mockReorderLists).toHaveBeenCalledWith(boardId, 1, 1);
    });

    it('should handle reordering from higher to lower index', () => {
      const { result } = renderHook(() => useDragAndDrop(boardId));

      result.current.handleListDrop(3, 1);

      expect(mockReorderLists).toHaveBeenCalledWith(boardId, 3, 1);
    });

    it('should handle reordering from lower to higher index', () => {
      const { result } = renderHook(() => useDragAndDrop(boardId));

      result.current.handleListDrop(1, 3);

      expect(mockReorderLists).toHaveBeenCalledWith(boardId, 1, 3);
    });
  });

  describe('hook return value', () => {
    it('should return handler functions', () => {
      const { result } = renderHook(() => useDragAndDrop(boardId));

      expect(result.current).toHaveProperty('handleCardDrop');
      expect(result.current).toHaveProperty('handleListDrop');
      expect(typeof result.current.handleCardDrop).toBe('function');
      expect(typeof result.current.handleListDrop).toBe('function');
    });

    it('should use boardId from parameter', () => {
      const customBoardId = 'custom-board-456';
      const { result } = renderHook(() => useDragAndDrop(customBoardId));

      result.current.handleCardDrop(cardId, fromListId, toListId, position);

      expect(mockMoveCard).toHaveBeenCalledWith(customBoardId, cardId, fromListId, toListId, position);

      jest.clearAllMocks();

      result.current.handleListDrop(0, 1);

      expect(mockReorderLists).toHaveBeenCalledWith(customBoardId, 0, 1);
    });
  });
});
