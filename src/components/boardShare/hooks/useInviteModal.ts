/**
 * Custom hook for InviteModal business logic
 */

import { useState } from 'react';
import { useSharingStore } from '@/store/sharingStore';
import { useBoardStore } from '@/store';
import { DEFAULT_INVITATION_EXPIRY_HOURS } from '@/lib/constants';

export function useInviteModal() {
  // Store hooks for board and sharing functionality
  const { getCurrentBoard } = useBoardStore();
  const { createInvitation } = useSharingStore();

  // Local state for invitation expiration time
  const [expiresIn, setExpiresIn] = useState(DEFAULT_INVITATION_EXPIRY_HOURS);

  // Get current board data
  const currentBoard = getCurrentBoard();

  /**
   * Handles creation of a new invitation link
   * Creates invitation with current board ID and name
   */
  const handleCreateInvite = async () => {
    if (!currentBoard) return;

    await createInvitation(currentBoard.id, currentBoard.name);
  };

  return {
    currentBoard,
    expiresIn,
    setExpiresIn,
    handleCreateInvite,
  };
}
