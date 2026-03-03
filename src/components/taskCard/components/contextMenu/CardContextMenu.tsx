'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useBoardStore } from '@/store';
import { calculateLabelManagerPosition, calculateDatePickerPosition } from './utils';
import { useContextMenuActions } from './hooks/useContextMenuActions';
import { ContextMenuItems } from './components/ContextMenuItems';
import { LabelManagerPortal } from './components/LabelManagerPortal';
import { DatePickerModal } from './components/DatePickerModal';
import { Z_INDEX } from './constants';
import { CardContextMenuProps, LabelManagerPosition, DatePickerState } from './types';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerPosition, setDatePickerPosition] = useState<LabelManagerPosition>({ left: 0, top: 0 });
  const datePickerPositionedRef = useRef(false);

  // Action handlers hook
  const actionHandlers = useContextMenuActions(card, onClose);

  // Close popups when context menu closes to prevent orphaned UI elements
  useEffect(() => {
    if (!isOpen) {
      // Use setTimeout to avoid calling setState synchronously
      const timeoutId = setTimeout(() => {
        setShowLabelManager(false);
        setShowDatePicker(false);
        datePickerPositionedRef.current = false;
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  /**
   * Handles opening the label manager for the current card
   * Positions the label manager next to the context menu
   * Uses viewport detection to ensure the label manager stays visible
   */
  const handleLabels = useCallback((e: React.MouseEvent) => {
    const calculatedPosition = calculateLabelManagerPosition(position);
    setLabelManagerPosition(calculatedPosition);
    setShowLabelManager(true);
  }, [position, currentBoard?.id, card.id]);

  /**
   * Handles opening the date picker for the current card
   * Positions the date picker next to the context menu
   * Uses viewport detection to ensure the date picker stays visible
   */
  const handleDates = useCallback((e: React.MouseEvent) => {
    // Only calculate position once when opening
    if (!datePickerPositionedRef.current) {
      const calculatedPosition = calculateDatePickerPosition(position);
      setDatePickerPosition(calculatedPosition);
      datePickerPositionedRef.current = true;
    }
    setShowDatePicker(true);
  }, [position]);

  // Don't render anything if the menu is closed
  if (!isOpen) return null;

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
          onDates={handleDates}
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
      <DatePickerModal
        show={showDatePicker}
        position={datePickerPosition}
        startDate={card.startDate}
        dueDate={card.dueDate}
        onDatesChange={actionHandlers.handleDatesChange}
        onClose={() => setShowDatePicker(false)}
      />
    </>
  );
}
