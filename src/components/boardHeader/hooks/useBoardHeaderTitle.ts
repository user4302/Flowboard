'use client';

import { useState } from 'react';
import { useBoardStore } from '@/store';

/**
 * Custom hook for managing BoardHeader title editing functionality
 * 
 * Provides state and handlers for inline title editing with:
 * - Edit mode toggle
 * - Temporary title storage
 * - Save and cancel functionality
 * - Keyboard shortcuts (Enter to save, Escape to cancel)
 */
export const useBoardHeaderTitle = (currentBoard: any) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  /**
   * Handle board title editing initiation
   * 
   * Sets up editing state and copies the current title to temp storage
   */
  const handleTitleEdit = () => {
    if (currentBoard) {
      setTempTitle(currentBoard.name);
      setIsEditingTitle(true);
    }
  };

  /**
   * Handle board title save
   * 
   * Saves the edited title if it's different from the original and not empty.
   * Updates the board state and exits editing mode.
   */
  const handleTitleSave = () => {
    if (currentBoard && tempTitle.trim() && tempTitle !== currentBoard.name) {
      useBoardStore.getState().updateBoard(currentBoard.id, { name: tempTitle.trim() });
    }
    setIsEditingTitle(false);
    setTempTitle('');
  };

  /**
   * Handle keyboard events during title editing
   * 
   * @param e - Keyboard event
   * - Enter: Save the title
   * - Escape: Cancel editing and revert to the original title
   */
  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setTempTitle('');
    }
  };

  return {
    isEditingTitle,
    tempTitle,
    setTempTitle,
    handleTitleEdit,
    handleTitleSave,
    handleTitleKeyPress,
  };
};
