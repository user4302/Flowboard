import { useState, useCallback } from 'react';
import { Card as CardType } from '@/lib/types';
import { useBoardStore } from '@/store';
import { generateCardUrl, copyToClipboard } from '../utils';
import { cardToJSON, downloadCardJSON } from '@/lib/cardJsonUtils';

/**
 * Custom hook that manages all context menu action handlers
 * Provides loading state and error handling for async operations
 */
export function useContextMenuActions(card: CardType, onActionComplete?: () => void) {
  const { currentBoardId, duplicateCard, archiveCard, moveCard, updateCard, getCurrentBoard } = useBoardStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get current board for label/member mapping
  const currentBoard = getCurrentBoard();

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

    // Close context menu after successful copy
    onActionComplete?.();
  }, [currentBoardId, card.id, onActionComplete]);

  /**
   * Handles updating card dates
   * Updates the start and due dates for the card
   */
  const handleDatesChange = useCallback(async (startDate?: Date, dueDate?: Date) => {
    if (currentBoardId) {
      updateCard(currentBoardId, card.id, {
        startDate,
        dueDate,
        updatedAt: new Date(),
      });
    }
  }, [currentBoardId, card.id, updateCard]);

  /**
   * Handles moving cards between lists
   * This is now handled by the MovePortal component
   */
  const handleMove = useCallback(() => {
    // Move functionality is now handled by the MovePortal component
    // This function is kept for compatibility but the actual move logic
    // is handled in the MovePortal component
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
   * Handles copying the current card as JSON to clipboard
   * Exports card data in clean JSON format for sharing/importing
   */
  const handleCopyAsJSON = useCallback(async () => {
    try {
      if (!currentBoard) return;

      const cardJSON = cardToJSON(card, currentBoard.labels || [], currentBoard.members || []);
      await copyToClipboard(JSON.stringify(cardJSON, null, 2));

      // Close context menu after successful copy
      onActionComplete?.();
    } catch (error) {
      console.error('Failed to copy card as JSON:', error);
    }
  }, [card, currentBoard, onActionComplete]);

  /**
   * Handles downloading the current card as a JSON file
   * Creates a downloadable .json file with card data
   */
  const handleDownloadJSON = useCallback(async () => {
    try {
      if (!currentBoard) return;

      const cardJSON = cardToJSON(card, currentBoard.labels || [], currentBoard.members || []);
      const filename = `${card.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_card.json`;
      downloadCardJSON(cardJSON, filename);

      // Close context menu after successful download
      onActionComplete?.();
    } catch (error) {
      console.error('Failed to download card JSON:', error);
    }
  }, [card, currentBoard, onActionComplete]);

  /**
   * Handles uploading a card from a JSON file
   * Opens file picker and processes the selected JSON file
   */
  const handleUploadJSON = useCallback(async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';

      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const text = await file.text();
        const cardData = JSON.parse(text);

        // TODO: Process cardData and create new card
        alert('Upload functionality will be implemented in next phase!');
      };

      input.click();
    } catch (error) {
      console.error('Failed to upload card JSON:', error);
    }
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
    handleCopyAsJSON,
    handleDownloadJSON,
    handleUploadJSON,
    handleArchive,
    handleCopyLink,
    handleDatesChange,
    handleMove,
    handleMembers,
    handleCover,
    handleMirror,
  };
}
