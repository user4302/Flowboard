'use client';

import { createPortal } from 'react-dom';
import { useRef, useEffect } from 'react';
import { useClickOutside } from '@/hooks';

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
  const portalRef = useClickOutside<HTMLDivElement>(onClose, []);

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
      data-portal="color-picker"
    >
      {children}
    </div>,
    document.body
  );
}
