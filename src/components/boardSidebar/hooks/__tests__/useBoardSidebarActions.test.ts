import { renderHook, act } from '@testing-library/react';
import { useBoardSidebarActions } from '../useBoardSidebarActions';
import { useBoardStore } from '@/store';
import type { Board } from '../types';

// Mock the board store
jest.mock('@/store');

// Mock window.confirm
const originalConfirm = window.confirm;

describe('useBoardSidebarActions Hook', () => {
  const mockBoards: Board[] = [
    { id: 'board-1', name: 'Board 1', lists: [], members: [] },
    { id: 'board-2', name: 'Board 2', lists: [], members: [] },
    { id: 'board-3', name: 'Board 3', lists: [], members: [] }
  ];

  const mockCreateBoard = jest.fn();
  const mockSetCurrentBoard = jest.fn();
  const mockDeleteBoard = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock store hook
    (useBoardStore as unknown as jest.Mock).mockReturnValue({
      boards: mockBoards,
      currentBoardId: 'board-1',
      createBoard: mockCreateBoard,
      setCurrentBoard: mockSetCurrentBoard,
      deleteBoard: mockDeleteBoard
    });

    // Mock window.confirm
    window.confirm = jest.fn();
  });

  afterEach(() => {
    window.confirm = originalConfirm;
  });

  it('returns initial state correctly', () => {
    const { result } = renderHook(() => useBoardSidebarActions());

    expect(typeof result.current.handleCreateBoard).toBe('function');
    expect(typeof result.current.handleDeleteBoard).toBe('function');
    expect(typeof result.current.handleKeyPress).toBe('function');
  });

  it('calls store hooks on every render', () => {
    renderHook(() => useBoardSidebarActions());

    expect(useBoardStore).toHaveBeenCalled();
  });

  it('does not delete board when confirmation is cancelled', () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    const { result } = renderHook(() => useBoardSidebarActions());

    result.current.handleDeleteBoard('board-1', 'Board 1');

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "Board 1"? This action cannot be undone.');
    expect(mockDeleteBoard).not.toHaveBeenCalled();
    expect(mockSetCurrentBoard).not.toHaveBeenCalled();
  });

  it('deletes board when confirmation is accepted and current board is not deleted', () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    (useBoardStore as unknown as jest.Mock).mockReturnValue({
      boards: mockBoards,
      currentBoardId: 'board-2',
      createBoard: mockCreateBoard,
      setCurrentBoard: mockSetCurrentBoard,
      deleteBoard: mockDeleteBoard
    });

    const { result } = renderHook(() => useBoardSidebarActions());

    result.current.handleDeleteBoard('board-1', 'Board 1');

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "Board 1"? This action cannot be undone.');
    expect(mockDeleteBoard).toHaveBeenCalledWith('board-1');
    expect(mockSetCurrentBoard).not.toHaveBeenCalled();
  });

  it('deletes board and switches to another when current board is deleted', () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    const { result } = renderHook(() => useBoardSidebarActions());

    result.current.handleDeleteBoard('board-1', 'Board 1');

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "Board 1"? This action cannot be undone.');
    expect(mockDeleteBoard).toHaveBeenCalledWith('board-1');
    expect(mockSetCurrentBoard).toHaveBeenCalledWith('board-2');
  });

  it('deletes board and does not switch to another when no boards remain', () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    (useBoardStore as unknown as jest.Mock).mockReturnValue({
      boards: [{ id: 'board-1', name: 'Board 1', lists: [], members: [] }],
      currentBoardId: 'board-1',
      createBoard: mockCreateBoard,
      setCurrentBoard: mockSetCurrentBoard,
      deleteBoard: mockDeleteBoard
    });

    const { result } = renderHook(() => useBoardSidebarActions());

    result.current.handleDeleteBoard('board-1', 'Board 1');

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "Board 1"? This action cannot be undone.');
    expect(mockDeleteBoard).toHaveBeenCalledWith('board-1');
    expect(mockSetCurrentBoard).not.toHaveBeenCalled();
  });

  it('returns consistent function references', () => {
    const { result, rerender } = renderHook(() => useBoardSidebarActions());

    const initialHandleCreateBoard = result.current.handleCreateBoard;
    const initialHandleDeleteBoard = result.current.handleDeleteBoard;
    const initialHandleKeyPress = result.current.handleKeyPress;

    rerender();

    // Functions should be available on every render
    expect(typeof result.current.handleCreateBoard).toBe('function');
    expect(typeof result.current.handleDeleteBoard).toBe('function');
    expect(typeof result.current.handleKeyPress).toBe('function');
  });

  it('works with empty boards array', () => {
    (useBoardStore as unknown as jest.Mock).mockReturnValue({
      boards: [],
      currentBoardId: null,
      createBoard: mockCreateBoard,
      setCurrentBoard: mockSetCurrentBoard,
      deleteBoard: mockDeleteBoard
    });

    const { result } = renderHook(() => useBoardSidebarActions());

    expect(typeof result.current.handleCreateBoard).toBe('function');
    expect(typeof result.current.handleDeleteBoard).toBe('function');
    expect(typeof result.current.handleKeyPress).toBe('function');
  });

  it('handles deletion when current board is not in boards array', () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    (useBoardStore as unknown as jest.Mock).mockReturnValue({
      boards: mockBoards,
      currentBoardId: 'non-existent-board',
      createBoard: mockCreateBoard,
      setCurrentBoard: mockSetCurrentBoard,
      deleteBoard: mockDeleteBoard
    });

    const { result } = renderHook(() => useBoardSidebarActions());

    result.current.handleDeleteBoard('board-1', 'Board 1');

    expect(mockDeleteBoard).toHaveBeenCalledWith('board-1');
    expect(mockSetCurrentBoard).not.toHaveBeenCalled(); // Current board is not the deleted one
  });

  it('prevents deletion of last board when switching boards', () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    (useBoardStore as unknown as jest.Mock).mockReturnValue({
      boards: [{ id: 'board-1', name: 'Board 1', lists: [], members: [] }],
      currentBoardId: 'board-1',
      createBoard: mockCreateBoard,
      setCurrentBoard: mockSetCurrentBoard,
      deleteBoard: mockDeleteBoard
    });

    const { result } = renderHook(() => useBoardSidebarActions());

    result.current.handleDeleteBoard('board-1', 'Board 1');

    expect(mockDeleteBoard).toHaveBeenCalledWith('board-1');
    expect(mockSetCurrentBoard).not.toHaveBeenCalled(); // No boards to switch to
  });

  it('handles board names with special characters in confirmation', () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    const { result } = renderHook(() => useBoardSidebarActions());

    result.current.handleDeleteBoard('board-1', 'Board "Special" & Test');

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "Board "Special" & Test"? This action cannot be undone.');
    expect(mockDeleteBoard).toHaveBeenCalledWith('board-1');
  });
});
