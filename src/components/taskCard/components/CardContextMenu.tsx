'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Tag,
  Users,
  Image,
  Calendar,
  ArrowRight,
  Copy,
  Link,
  GitBranch,
  Archive,
  ExternalLink
} from 'lucide-react';
import { Card as CardType, Label } from '@/lib/types';
import { useBoardStore } from '@/store';
import { TaskModalLabelManager } from '@/components/taskModal/components/LabelManager/TaskModalLabelManager';
import { useClickOutside } from '@/hooks';
import { cn } from '@/lib/utils';

/**
 * Props interface for the CardContextMenu component
 */
interface CardContextMenuProps {
  /** The card object that the context menu is for */
  card: CardType;
  /** Whether the context menu is currently open */
  isOpen: boolean;
  /** Function to call when the context menu should be closed */
  onClose: () => void;
  /** The position where the context menu should appear */
  position: { x: number; y: number };
  /** Function to call when the user wants to open the full card modal */
  onOpenCard: () => void;
}

/**
 * CardContextMenu component - Provides a context menu for card actions
 * 
 * This component renders a dropdown menu with various card management options
 * including opening the card, editing labels, copying, archiving, etc.
 * It uses portals to render outside the normal component tree to avoid z-index issues.
 */
export function CardContextMenu({
  card,
  isOpen,
  onClose,
  position,
  onOpenCard
}: CardContextMenuProps) {
  // Get board store methods for card operations
  const { currentBoardId, duplicateCard, archiveCard, moveCard, getCurrentBoard } = useBoardStore();

  // State management for UI interactions
  const [isProcessing, setIsProcessing] = useState(false); // Loading state for async operations
  const [showLabelManager, setShowLabelManager] = useState(false); // Show/hide label picker
  const [labelManagerPosition, setLabelManagerPosition] = useState({ left: 0, top: 0 }); // Position for label picker

  // Refs for DOM manipulation and click outside detection
  const labelTriggerRef = useRef<HTMLDivElement>(null); // Reference to label trigger element
  const labelManagerRef = useClickOutside<HTMLDivElement>(() => setShowLabelManager(false)); // Click outside handler for label manager

  // Get current board data for label operations
  const currentBoard = getCurrentBoard();
  const boardLabels = currentBoard?.labels || [];

  // Close label manager when context menu closes to prevent orphaned UI elements
  useEffect(() => {
    if (!isOpen) {
      setShowLabelManager(false);
    }
  }, [isOpen]);

  // Don't render anything if the menu is closed
  if (!isOpen) return null;

  /**
   * Generic action handler that manages loading state and error handling
   * @param action - The async action to execute
   */
  const handleAction = async (action: () => void | Promise<void>) => {
    setIsProcessing(true);
    try {
      await action();
      onClose(); // Close menu after successful action
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handles duplicating the current card
   * Creates a copy of the card in the same list
   */
  const handleDuplicate = async () => {
    if (currentBoardId) {
      duplicateCard(currentBoardId, card.id, card.listId);
    }
  };

  /**
   * Handles archiving the current card
   * Moves the card to the archived cards collection
   */
  const handleArchive = async () => {
    if (currentBoardId) {
      archiveCard(currentBoardId, card.id);
    }
  };

  /**
   * Copies a direct link to the card to the clipboard
   * Generates a URL that can be shared with other users
   */
  const handleCopyLink = () => {
    const cardUrl = `${window.location.origin}/board/${currentBoardId}/card/${card.id}`;
    navigator.clipboard.writeText(cardUrl);
  };

  /**
   * Placeholder handler for moving cards between lists
   * TODO: Implement move dialog with list selection
   */
  const handleMove = () => {
    // TODO: Implement move dialog
    alert('Move dialog coming soon!');
  };

  /**
   * Handles opening the label manager for the current card
   * Positions the label manager next to the context menu
   * Uses viewport detection to ensure the label manager stays visible
   */
  const handleLabels = (e: React.MouseEvent) => {
    // Define dimensions for positioning calculations
    const contextMenuWidth = 200; // Approximate width of context menu
    const labelManagerWidth = 320; // Width of label manager
    const margin = 4; // Small gap between menus
    const labelManagerHeight = 408; // Approximate height of label manager

    // Default position: to the right of the context menu
    let left = position.x + contextMenuWidth + margin;
    let top = position.y;

    // Check if there's enough space on the right side of the screen
    const spaceRight = window.innerWidth - left;
    if (spaceRight < labelManagerWidth) {
      // Not enough space on right, position to the left instead
      left = position.x - labelManagerWidth - margin;
    }

    // Ensure the label manager stays within viewport bounds
    left = Math.max(8, Math.min(left, window.innerWidth - labelManagerWidth - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - labelManagerHeight - 8));

    setLabelManagerPosition({ left, top });
    setShowLabelManager(true);
    console.log('handleLabels called', { currentBoardId, cardId: card.id, position: { left, top }, contextMenuPosition: position });
  };

  /**
   * Placeholder handler for changing card members
   * TODO: Implement member picker component
   */
  const handleMembers = () => {
    // TODO: Implement member picker
    alert('Member picker coming soon!');
  };

  /**
   * Placeholder handler for changing card cover image
   * TODO: Implement cover picker component
   */
  const handleCover = () => {
    // TODO: Implement cover picker
    alert('Cover picker coming soon!');
  };

  /**
   * Placeholder handler for editing card dates
   * TODO: Implement date picker component
   */
  const handleDates = () => {
    // TODO: Implement date picker
    alert('Date picker coming soon!');
  };

  /**
   * Placeholder handler for mirroring cards
   * TODO: Implement mirror functionality (requires backend support)
   */
  const handleMirror = () => {
    // TODO: Implement mirror functionality (backend required)
    alert('Mirror functionality requires backend implementation!');
  };

  /**
   * Handles clicks on the backdrop area
   * Closes the context menu when user clicks outside
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  /**
   * Renders the context menu content including backdrop and menu items
   * Uses fixed positioning and portals to render outside normal component tree
   */
  const menuContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={handleBackdropClick}
      />

      {/* Context Menu */}
      <div
        className={cn(
          "fixed z-50 min-w-[200px] max-w-[280px]",
          "bg-white dark:bg-slate-800",
          "border border-slate-200 dark:border-slate-600",
          "rounded-lg shadow-lg",
          "py-1",
          "animate-in fade-in-0 zoom-in-95",
          "duration-200"
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Open Card */}
        <button
          onClick={() => handleAction(onOpenCard)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ExternalLink className="h-4 w-4 flex-shrink-0" />
          <span>Open card</span>
        </button>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-600 my-1"></div>

        {/* Edit Labels */}
        <button
          onClick={handleLabels}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Tag className="h-4 w-4 flex-shrink-0" />
          <span>Edit labels</span>
        </button>

        {/* Change Members */}
        <button
          onClick={() => handleAction(handleMembers)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Users className="h-4 w-4 flex-shrink-0" />
          <span>Change members</span>
        </button>

        {/* Change Cover */}
        <button
          onClick={() => handleAction(handleCover)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image className="h-4 w-4 flex-shrink-0" />
          <span>Change cover</span>
        </button>

        {/* Edit Dates */}
        <button
          onClick={() => handleAction(handleDates)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span>Edit dates</span>
        </button>

        {/* Move */}
        <button
          onClick={() => handleAction(handleMove)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight className="h-4 w-4 flex-shrink-0" />
          <span>Move</span>
        </button>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-600 my-1"></div>

        {/* Copy Card */}
        <button
          onClick={() => handleAction(handleDuplicate)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Copy className="h-4 w-4 flex-shrink-0" />
          <span>Copy card</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={() => handleAction(handleCopyLink)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Link className="h-4 w-4 flex-shrink-0" />
          <span>Copy link</span>
        </button>

        {/* Mirror */}
        <button
          onClick={() => handleAction(handleMirror)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GitBranch className="h-4 w-4 flex-shrink-0" />
          <span>Mirror</span>
        </button>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-600 my-1"></div>

        {/* Archive */}
        <button
          onClick={() => handleAction(handleArchive)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Archive className="h-4 w-4 flex-shrink-0" />
          <span>Archive</span>
        </button>
      </div>
    </>
  );

  /**
   * Renders the label manager portal separately to avoid portal nesting issues
   * React portals cannot be nested, so we render this as a separate portal
   */
  const labelManagerPortal = showLabelManager && currentBoardId && (() => {
    console.log('Rendering label manager portal', { showLabelManager, currentBoardId, cardId: card.id, position: labelManagerPosition });
    return createPortal(
      <div
        ref={labelManagerRef}
        className="fixed z-50"
        style={{
          left: `${labelManagerPosition.left}px`,
          top: `${labelManagerPosition.top}px`,
        }}
      >
        <TaskModalLabelManager
          boardId={currentBoardId}
          cardId={card.id}
          selectedLabelIds={card.labelIds}
          onClose={() => setShowLabelManager(false)}
        />
      </div>,
      document.body
    );
  })();

  /**
   * Main render method - renders both the context menu and label manager portals
   * Uses React portals to render outside the normal component tree
   */
  return (
    <>
      {createPortal(menuContent, document.body)}
      {labelManagerPortal}
    </>
  );
}
