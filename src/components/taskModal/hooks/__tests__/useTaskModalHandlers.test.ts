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

describe('useTaskModalHandlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as any).__isClosingModal;
  });

  describe('handleCloseCardModal', () => {
    it('should set global closing flag and close modal without URL update', () => {
      const mockChecklist = {
        syncChecklistToStore: jest.fn(),
        resetChecklist: jest.fn(),
      };

      const { result } = renderHook(() =>
        useTaskModalHandlers(
          'test-board-id',
          {
            id: 'test-card-id',
            title: 'Test Card',
          } as any,
          {} as any,
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
      const mockChecklist = {
        syncChecklistToStore: jest.fn(),
        resetChecklist: jest.fn(),
      };

      const { result } = renderHook(() =>
        useTaskModalHandlers(
          'test-board-id',
          {
            id: 'test-card-id',
            title: 'Test Card',
          } as any,
          {} as any,
          false,
          null,
          null,
          mockChecklist
        )
      );

      act(() => {
        result.current.closeCardModal();
      });

      setTimeout(() => {
        expect(window.history.pushState).toHaveBeenCalledWith(
          {},
          '',
          '/board/test-board-id'
        );
        done();
      }, 150);
    });

    it('should reset global flag after longer delay', (done) => {
      const mockChecklist = {
        syncChecklistToStore: jest.fn(),
        resetChecklist: jest.fn(),
      };

      const { result } = renderHook(() =>
        useTaskModalHandlers(
          'test-board-id',
          {
            id: 'test-card-id',
            title: 'Test Card',
          } as any,
          {} as any,
          false,
          null,
          null,
          mockChecklist
        )
      );

      act(() => {
        result.current.closeCardModal();
      });

      setTimeout(() => {
        expect((window as any).__isClosingModal).toBe(false);
        done();
      }, 600);
    });
  });

  describe('handleSave', () => {
    it('should update existing card with provided data', () => {
      const mockChecklist = {
        syncChecklistToStore: jest.fn(),
        resetChecklist: jest.fn(),
      };

      const { result } = renderHook(() =>
        useTaskModalHandlers(
          'test-board-id',
          {
            id: 'test-card-id',
            title: 'Test Card',
          } as any,
          {} as any,
          false,
          null,
          null,
          mockChecklist
        )
      );

      const saveData = {
        title: 'Updated Title',
        description: 'Updated Description',
        priority: 2,
      };

      act(() => {
        result.current.handleSave(saveData);
      });

      expect(mockUpdateCard).toHaveBeenCalledWith(
        'test-board-id',
        'test-card-id',
        {
          title: 'Updated Title',
          description: 'Updated Description',
          priority: 2,
        }
      );
      expect(mockChecklist.syncChecklistToStore).toHaveBeenCalled();
      expect((window as any).__isClosingModal).toBe(true);
    });

    it('should handle null priority correctly', () => {
      const mockChecklist = {
        syncChecklistToStore: jest.fn(),
        resetChecklist: jest.fn(),
      };

      const { result } = renderHook(() =>
        useTaskModalHandlers(
          'test-board-id',
          {
            id: 'test-card-id',
            title: 'Test Card',
          } as any,
          {} as any,
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
        'test-board-id',
        'test-card-id',
        {
          title: 'Updated Title',
          description: 'Updated Description',
        }
      );
    });

    it('should handle undefined priority correctly', () => {
      const mockChecklist = {
        syncChecklistToStore: jest.fn(),
        resetChecklist: jest.fn(),
      };

      const { result } = renderHook(() =>
        useTaskModalHandlers(
          'test-board-id',
          {
            id: 'test-card-id',
            title: 'Test Card',
          } as any,
          {} as any,
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
        'test-board-id',
        'test-card-id',
        {
          title: 'Updated Title',
          description: 'Updated Description',
        }
      );
    });
  });

  describe('JSON import mode', () => {
    it('should create new card from JSON data', () => {
      const mockChecklist = {
        syncChecklistToStore: jest.fn(),
        resetChecklist: jest.fn(),
      };

      const { result } = renderHook(() =>
        useTaskModalHandlers(
          'test-board-id',
          null,
          {} as any,
          true,
          {
            title: 'Imported Card',
            description: 'Imported Description',
          },
          'test-list-id',
          mockChecklist
        )
      );

      act(() => {
        result.current.handleSave({
          title: 'Imported Card',
          description: 'Imported Description',
        });
      });

      expect(mockCreateCard).toHaveBeenCalledWith(
        'test-board-id',
        'test-list-id',
        'Imported Card'
      );
      expect((window as any).__isClosingModal).toBe(true);
    });
  });
});
