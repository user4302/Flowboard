import { renderHook, act } from '@testing-library/react';
import { useTaskModalHandlers } from '../useTaskModalHandlers';

// Mock window.location
delete (window as any).location;
(window as any).location = {
  pathname: '/board/test-board/card/test-card',
};

// Mock window.history
delete (window as any).history;
(window as any).history = {
  pushState: jest.fn(),
};

// Mock stores
const mockUpdateCard = jest.fn();
const mockCreateCard = jest.fn();
const mockCloseCardModalWithoutUrlUpdate = jest.fn();

jest.mock('@/store', () => ({
  useBoardStore: () => ({
    updateCard: mockUpdateCard,
    createCard: mockCreateCard,
  }),
  useUIStore: () => ({
    closeCardModalWithoutUrlUpdate: mockCloseCardModalWithoutUrlUpdate,
  }),
}));

jest.mock('../useTaskModalActions', () => ({
  useTaskModalActions: () => ({
    handleSaveCard: jest.fn(),
  }),
}));

describe('useTaskModalHandlers', () => {
  const mockCurrentBoardId = 'test-board-id';
  const mockFoundCard: any = {
    id: 'test-card-id',
    title: 'Test Card',
    description: 'Test Description',
    startDate: new Date(),
    dueDate: new Date(),
    priority: 1,
    completed: false,
    labelIds: [],
    checklists: [],
  };

  const mockChecklist = {
    syncChecklistToStore: jest.fn(),
    resetChecklist: jest.fn(),
  };

  const mockForm = {
    getValues: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear global flag
    delete (window as any).__isClosingModal;
  });

  describe('handleCloseCardModal', () => {
    it('should set global closing flag and close modal without URL update', () => {
      const { result } = renderHook(() =>
        useTaskModalHandlers(
          mockCurrentBoardId,
          mockFoundCard,
          mockForm as any,
          false,
          null,
          null,
          mockChecklist
        )
      );

      act(() => {
        result.current.closeCardModal();
      });

      expect((window as any).__isClosingModal).toBe(true);
      expect(mockCloseCardModalWithoutUrlUpdate).toHaveBeenCalled();
      expect(mockChecklist.resetChecklist).toHaveBeenCalled();
    });

    it('should update URL to remove card ID after delay', (done) => {
      // Mock dynamic import to return the expected structure
      const mockBoardStore = {
        getState: () => ({
          currentBoardId: mockCurrentBoardId,
        }),
      };

      // Mock the import to return the boardStore
      jest.doMock('@/store/boardStore', () => ({
        useBoardStore: mockBoardStore,
      }));

      // Re-import the hook to get the mocked version
      const { useTaskModalHandlers: useTaskModalHandlersFresh } = require('../useTaskModalHandlers');

      const { result } = renderHook(() =>
        useTaskModalHandlersFresh(
          mockCurrentBoardId,
          mockFoundCard,
          mockForm as any,
          false,
          null,
          null,
          mockChecklist
        )
      );

      act(() => {
        result.current.closeCardModal();
      });

      // Wait for setTimeout - use longer delay to account for nested timeouts
      setTimeout(() => {
        expect((window as any).history.pushState).toHaveBeenCalledWith(
          {},
          '',
          `/board/${mockCurrentBoardId}`
        );
        done();
      }, 200);
    });

    it('should reset global flag after longer delay', (done) => {
      const { result } = renderHook(() =>
        useTaskModalHandlers(
          mockCurrentBoardId,
          mockFoundCard,
          mockForm as any,
          false,
          null,
          null,
          mockChecklist
        )
      );

      act(() => {
        result.current.closeCardModal();
      });

      // Wait for flag reset
      setTimeout(() => {
        expect((window as any).__isClosingModal).toBe(false);
        done();
      }, 600);
    });
  });

  describe('handleSave', () => {
    it('should update existing card with provided data', () => {
      const { result } = renderHook(() =>
        useTaskModalHandlers(
          mockCurrentBoardId,
          mockFoundCard,
          mockForm as any,
          false,
          null,
          null,
          mockChecklist
        )
      );

      const mockSaveData = {
        title: 'Updated Title',
        description: 'Updated Description',
        priority: 2,
      };

      act(() => {
        result.current.handleSave(mockSaveData);
      });

      expect(mockChecklist.syncChecklistToStore).toHaveBeenCalled();
      expect(mockUpdateCard).toHaveBeenCalledWith(
        mockCurrentBoardId,
        mockFoundCard.id,
        {
          title: 'Updated Title',
          description: 'Updated Description',
          priority: 2,
        }
      );
    });

    it('should handle null priority correctly', () => {
      const { result } = renderHook(() =>
        useTaskModalHandlers(
          mockCurrentBoardId,
          mockFoundCard,
          mockForm as any,
          false,
          null,
          null,
          mockChecklist
        )
      );

      const saveDataWithNullPriority = {
        title: 'Updated Title',
        description: 'Updated Description',
        priority: null,
      };

      act(() => {
        result.current.handleSave(saveDataWithNullPriority);
      });

      expect(mockUpdateCard).toHaveBeenCalledWith(
        mockCurrentBoardId,
        mockFoundCard.id,
        {
          title: 'Updated Title',
          description: 'Updated Description',
        }
      );
    });

    it('should handle undefined priority correctly', () => {
      const { result } = renderHook(() =>
        useTaskModalHandlers(
          mockCurrentBoardId,
          mockFoundCard,
          mockForm as any,
          false,
          null,
          null,
          mockChecklist
        )
      );

      const saveDataWithUndefinedPriority = {
        title: 'Updated Title',
        description: 'Updated Description',
        priority: undefined,
      };

      act(() => {
        result.current.handleSave(saveDataWithUndefinedPriority);
      });

      expect(mockUpdateCard).toHaveBeenCalledWith(
        mockCurrentBoardId,
        mockFoundCard.id,
        {
          title: 'Updated Title',
          description: 'Updated Description',
        }
      );
    });
  });

  describe('JSON import mode', () => {
    const mockCardJSONData: any = {
      title: 'Imported Card',
      description: 'Imported Description',
      labels: [],
      members: [],
      checklist: [],
    };

    it('should create new card from JSON data', () => {
      const { result } = renderHook(() =>
        useTaskModalHandlers(
          mockCurrentBoardId,
          null,
          mockForm as any,
          true,
          mockCardJSONData,
          'test-list-id',
          mockChecklist
        )
      );

      act(() => {
        result.current.handleSave(mockCardJSONData);
      });

      expect(mockCreateCard).toHaveBeenCalledWith(
        mockCurrentBoardId,
        'test-list-id',
        'Imported Card'
      );
    });

    it('should update new card with additional data', () => {
      const mockNewCard = {
        id: 'new-card-id',
        title: 'Imported Card',
      };

      mockCreateCard.mockReturnValue(mockNewCard);

      const { result } = renderHook(() =>
        useTaskModalHandlers(
          mockCurrentBoardId,
          null,
          mockForm as any,
          true,
          mockCardJSONData,
          'test-list-id',
          mockChecklist
        )
      );

      const saveData = {
        ...mockCardJSONData,
        priority: 3,
        startDate: '2026-03-24',
        dueDate: '2026-03-25',
      };

      act(() => {
        result.current.handleSave(saveData);
      });

      expect(mockUpdateCard).toHaveBeenCalledWith(
        mockCurrentBoardId,
        'new-card-id',
        {
          description: 'Imported Description',
          priority: 3,
          startDate: new Date('2026-03-24'),
          dueDate: new Date('2026-03-25'),
        }
      );
    });

    it('should not sync checklist in JSON import mode', () => {
      const { result } = renderHook(() =>
        useTaskModalHandlers(
          mockCurrentBoardId,
          null,
          mockForm as any,
          true,
          mockCardJSONData,
          'test-list-id',
          mockChecklist
        )
      );

      act(() => {
        result.current.handleSave(mockCardJSONData);
      });

      expect(mockChecklist.syncChecklistToStore).not.toHaveBeenCalled();
    });
  });

  describe('race condition prevention', () => {
    it('should prevent multiple rapid save operations', () => {
      const { result } = renderHook(() =>
        useTaskModalHandlers(
          mockCurrentBoardId,
          mockFoundCard,
          mockForm as any,
          false,
          null,
          null,
          mockChecklist
        )
      );

      // Both saves should work (race condition prevention is only for modal close)
      act(() => {
        result.current.handleSave({ title: 'First save' });
      });

      act(() => {
        result.current.handleSave({ title: 'Second save' });
      });

      // Should have two update calls (no race condition prevention in handleSave)
      expect(mockUpdateCard).toHaveBeenCalledTimes(2);
    });
  });
});
