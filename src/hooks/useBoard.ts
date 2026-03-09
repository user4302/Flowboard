import { useEffect } from 'react';
import { useBoardStore } from '@/store';
import { useSharingStore } from '@/store/sharingStore';

/**
 * useBoard hook - Provides board management functionality
 * 
 * Handles board initialization, sharing setup, and provides access to board data.
 * Automatically creates a default board if none exists and sets up sharing capabilities.
 * 
 * @param boardId - Optional board ID to use (defaults to first available board)
 * @returns Object containing board data and management functions
 */
export function useBoard() {
  // Destructure board store methods and state
  const {
    boards,
    currentBoardId,
    createBoard,
    createList,
    createCard,
    setCurrentBoard,
  } = useBoardStore();

  // Get sharing store method for user info
  const { setUserInfo } = useSharingStore();

  // Get current board reactively
  const currentBoardData = boards.find((board) => board.id === currentBoardId) || null;

  /**
   * Effect to set up sharing info for current user (owner)
   * Automatically sets the current user as board owner when board is loaded
   */
  useEffect(() => {
    // Set up sharing info for current user (owner)
    if (boards.length > 0 && currentBoardId && currentBoardData) {
      // Set current user as board owner
      setUserInfo(
        'owner-123', // Owner ID
        'Board Owner', // Username
        'owner@flowboard.app', // Email
        true // Is owner
      );
    }
  }, [boards.length, currentBoardId, currentBoardData, setUserInfo]);

  return {
    boards,
    currentBoard: currentBoardData,
    currentBoardId,
    setCurrentBoard,
    createBoard,
    createList,
    createCard,
  };
}
