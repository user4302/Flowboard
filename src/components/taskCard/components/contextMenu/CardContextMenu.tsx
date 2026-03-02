'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBoardStore } from '@/store';
import { calculateLabelManagerPosition } from './utils';
import { useContextMenuActions } from './hooks/useContextMenuActions';
import { ContextMenuItems } from './components/ContextMenuItems';
import { LabelManagerPortal } from './components/LabelManagerPortal';
import { Z_INDEX } from './constants';
import { CardContextMenuProps, LabelManagerPosition } from './types';

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
  // Get current board data for label operations
  const { getCurrentBoard } = useBoardStore();
  const currentBoard = getCurrentBoard();
  const boardLabels = currentBoard?.labels || [];

  // State management for UI interactions
  const [showLabelManager, setShowLabelManager] = useState(false);
  const [labelManagerPosition, setLabelManagerPosition] = useState<LabelManagerPosition>({ left: 0, top: 0 });

  // Action handlers hook
  const actionHandlers = useContextMenuActions(card, onClose);

  // Close label manager when context menu closes to prevent orphaned UI elements
  useEffect(() => {
    if (!isOpen) {
      setShowLabelManager(false);
    }
  }, [isOpen]);

  // Don't render anything if the menu is closed
  if (!isOpen) return null;

  /**
   * Handles opening the label manager for the current card
   * Positions the label manager next to the context menu
   * Uses viewport detection to ensure the label manager stays visible
   */
  const handleLabels = (e: React.MouseEvent) => {
    const calculatedPosition = calculateLabelManagerPosition(position);
    setLabelManagerPosition(calculatedPosition);
    setShowLabelManager(true);
    console.log('handleLabels called', { 
      boardId: currentBoard?.id, 
      cardId: card.id, 
      position: calculatedPosition, 
      contextMenuPosition: position 
    });
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
        className={`fixed inset-0 bg-black/50`}
        style={{ zIndex: Z_INDEX.BACKDROP }}
        onClick={handleBackdropClick}
      />

      {/* Context Menu */}
      <div
        className={`fixed bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 py-2 min-w-[200px] max-w-xs`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: Z_INDEX.MODAL,
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <ContextMenuItems
          onOpenCard={onOpenCard}
          onLabels={handleLabels}
          actionHandlers={actionHandlers}
          isProcessing={actionHandlers.isProcessing}
        />
      </div>
    </>
  );

  return (
    <>
      {createPortal(menuContent, document.body)}
      <LabelManagerPortal
        show={showLabelManager}
        position={labelManagerPosition}
        boardId={currentBoard?.id || ''}
        cardId={card.id}
        selectedLabelIds={card.labelIds}
        onClose={() => setShowLabelManager(false)}
      />
    </>
  );
}
