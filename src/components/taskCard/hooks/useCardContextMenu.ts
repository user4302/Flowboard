import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Position interface for context menu coordinates
 */
export interface ContextMenuPosition {
  x: number;
  y: number;
}

/**
 * Hook for managing card context menu state and positioning
 * 
 * Provides functionality to open, close, and position context menus
 * for cards with proper viewport boundary detection and positioning logic.
 * 
 * @returns Object containing menu state, position, and control functions
 */
export function useCardContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  const openContextMenu = useCallback((event: React.MouseEvent | MouseEvent, sourceElement?: HTMLElement) => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    event.preventDefault();
    event.stopPropagation();

    let x: number;
    let y: number;

    if (sourceElement) {
      // Button click - position below the button
      const rect = sourceElement.getBoundingClientRect();
      x = rect.left;
      y = rect.bottom + 4; // 4px gap below button
    } else {
      // Right-click - position at cursor
      x = event.clientX;
      y = event.clientY;
    }

    // Ensure menu stays within viewport
    const menuWidth = 280; // Approximate menu width
    const menuHeight = 400; // Approximate menu height

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 8;
    }

    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 8;
    }

    // Ensure menu doesn't go off the top or left
    x = Math.max(8, x);
    y = Math.max(8, y);

    setPosition({ x, y });
    setIsOpen(true);

    // Reset the flag after a short delay
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);
  }, []);

  const closeContextMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    openContextMenu(event);
  }, [openContextMenu]);

  const handleButtonClick = useCallback((event: React.MouseEvent, buttonElement: HTMLElement) => {
    openContextMenu(event, buttonElement);
  }, [openContextMenu]);

  // Close menu on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeContextMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeContextMenu]);

  return {
    isOpen,
    position,
    cardRef,
    handleContextMenu,
    handleButtonClick,
    closeContextMenu,
  };
}
