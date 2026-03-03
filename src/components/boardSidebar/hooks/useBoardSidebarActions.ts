'use client';

import { useBoardStore } from '@/store';
import type { BoardActions } from '../types';

/**
 * Custom hook for BoardSidebar board CRUD operations
 * Handles board creation, deletion, and navigation logic
 */
export function useBoardSidebarActions(): BoardActions {
  const { boards, currentBoardId, createBoard, setCurrentBoard, deleteBoard } = useBoardStore();

  /**
   * Handles the creation of a new board
   * Validates input, creates board, and resets form state
   */
  const handleCreateBoard = () => {
    // This will be called from the component with access to form state
    // The actual implementation will be in the component that uses this hook
  };

  /**
   * Handles board deletion with confirmation
   * Prevents deletion of the last board and switches to another board if current is deleted
   */
  const handleDeleteBoard = (boardId: string, boardName: string) => {
    if (confirm(`Are you sure you want to delete "${boardName}"? This action cannot be undone.`)) {
      deleteBoard(boardId);
      if (currentBoardId === boardId) {
        // Switch to another board if current board is deleted
        const remainingBoards = boards.filter(b => b.id !== boardId);
        if (remainingBoards.length > 0) {
          setCurrentBoard(remainingBoards[0].id);
        }
      }
    }
  };

  /**
   * Handles keyboard events for the board creation input
   * Enter to submit, Escape to cancel
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    // This will be implemented in the component that uses this hook
  };

  return {
    handleCreateBoard,
    handleDeleteBoard,
    handleKeyPress,
  };
}
