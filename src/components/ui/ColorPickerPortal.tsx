'use client';

import { createPortal } from 'react-dom';
import { useRef, useEffect } from 'react';

/**
 * Props for the ColorPicker portal component
 */
interface ColorPickerPortalProps {
  /** Whether the dropdown should be shown */
  show: boolean;
  /** Position where the dropdown should appear */
  position: { left: number; top: number };
  /** Function to call when the dropdown should close */
  onClose: () => void;
  /** Dropdown content */
  children: React.ReactNode;
}

/**
 * Renders the ColorPicker dropdown as a portal to avoid z-index issues
 * Handles positioning and click-outside detection
 */
export function ColorPickerPortal({
  show,
  position,
  onClose,
  children,
}: ColorPickerPortalProps) {
  const portalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (portalRef.current && !portalRef.current.contains(event.target as Node)) {
        // Prevent event bubbling to avoid conflicts with parent portals
        event.stopPropagation();
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside, true); // Use capture phase
      return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }
  }, [show, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  return createPortal(
    <div
      ref={portalRef}
      className="fixed z-[60]"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
      onClick={(e) => {
        // Prevent clicks inside the portal from bubbling up to parent elements
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        // Prevent mousedown events from bubbling up to parent elements
        e.stopPropagation();
      }}
    >
      {children}
    </div>,
    document.body
  );
}
