'use client';

import { useState } from 'react';
import type { SidebarState } from '../types/sidebar.types';

/**
 * Custom hook for managing sidebar local state
 * Handles board creation form state and UI interactions
 */
export function useSidebarState(): SidebarState & {
  setIsCreatingBoard: (value: boolean) => void;
  setNewBoardName: (value: string) => void;
} {
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  return {
    isCreatingBoard,
    newBoardName,
    setIsCreatingBoard,
    setNewBoardName,
  };
}
