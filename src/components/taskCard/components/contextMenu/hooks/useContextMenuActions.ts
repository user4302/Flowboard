import { useState, useCallback } from 'react';
import { Card as CardType } from '@/lib/types';
import { useBoardStore } from '@/store';
import { generateCardUrl, copyToClipboard } from '../utils';

/**
 * Custom hook that manages all context menu action handlers
 * Provides loading state and error handling for async operations
 */
export function useContextMenuActions(card: CardType, onActionComplete?: () => void) {
  const { currentBoardId, duplicateCard, archiveCard, moveCard, getCurrentBoard } = useBoardStore();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Generic action handler that manages loading state and error handling
   * @param action - The async action to execute
   */
  const handleAction = useCallback(async (action: () => void | Promise<void>) => {
    setIsProcessing(true);
    try {
      await action();
      onActionComplete?.();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [onActionComplete]);

  /**
   * Handles duplicating the current card
   * Creates a copy of the card in the same list
   */
  const handleDuplicate = useCallback(async () => {
    if (currentBoardId) {
      duplicateCard(currentBoardId, card.id, card.listId);
    }
  }, [currentBoardId, card.id, card.listId, duplicateCard]);

  /**
   * Handles archiving the current card
   * Moves the card to the archived cards collection
   */
  const handleArchive = useCallback(async () => {
    if (currentBoardId) {
      archiveCard(currentBoardId, card.id);
    }
  }, [currentBoardId, card.id, archiveCard]);

  /**
   * Copies a direct link to the card to the clipboard
   * Generates a URL that can be shared with other users
   */
  const handleCopyLink = useCallback(async () => {
    const cardUrl = generateCardUrl(window.location.origin, currentBoardId!, card.id);
    await copyToClipboard(cardUrl);
  }, [currentBoardId, card.id]);

  /**
   * Placeholder handler for moving cards between lists
   * TODO: Implement move dialog with list selection
   */
  const handleMove = useCallback(() => {
    // TODO: Implement move dialog
    alert('Move dialog coming soon!');
  }, []);

  /**
   * Placeholder handler for changing card members
   * TODO: Implement member picker component
   */
  const handleMembers = useCallback(() => {
    // TODO: Implement member picker
    alert('Member picker coming soon!');
  }, []);

  /**
   * Placeholder handler for changing card cover image
   * TODO: Implement cover picker component
   */
  const handleCover = useCallback(() => {
    // TODO: Implement cover picker
    alert('Cover picker coming soon!');
  }, []);

  /**
   * Placeholder handler for editing card dates
   * TODO: Implement date picker component
   */
  const handleDates = useCallback(() => {
    // TODO: Implement date picker
    alert('Date picker coming soon!');
  }, []);

  /**
   * Placeholder handler for mirroring cards
   * TODO: Implement mirror functionality (requires backend support)
   */
  const handleMirror = useCallback(() => {
    // TODO: Implement mirror functionality (backend required)
    alert('Mirror functionality requires backend implementation!');
  }, []);

  return {
    isProcessing,
    handleAction,
    handleDuplicate,
    handleArchive,
    handleCopyLink,
    handleMove,
    handleMembers,
    handleCover,
    handleDates,
    handleMirror,
  };
}
