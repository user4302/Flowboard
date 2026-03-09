import { DIMENSIONS } from './constants';
import { LabelManagerPosition } from './types';

/**
 * Calculates the optimal position for the context menu to stay within viewport bounds
 * 
 * @param clickPosition - The position where the user right-clicked
 * @returns Position for the context menu that stays within viewport bounds
 */
export function calculateContextMenuPosition(clickPosition: { x: number; y: number }): { x: number; y: number } {
  const { CONTEXT_MENU_WIDTH, VIEWPORT_MARGIN } = DIMENSIONS;

  // More accurate context menu height based on actual styling
  // Each item: py-2.5 (10px top + 10px bottom + text height ~16px) = ~36px per item
  // Plus dividers and container padding
  const estimatedMenuHeight = 36 * 13 + 20; // 13 items + padding/dividers
  const estimatedMenuWidth = CONTEXT_MENU_WIDTH;

  // Start with the exact click position - menu corner touches the click point
  let x = clickPosition.x;
  let y = clickPosition.y;

  // Check if menu would go beyond right edge
  if (x + estimatedMenuWidth > window.innerWidth - VIEWPORT_MARGIN) {
    // Position to the left so right edge touches click point
    x = clickPosition.x - estimatedMenuWidth;
  }

  // Check if menu would go beyond bottom edge
  if (y + estimatedMenuHeight > window.innerHeight - VIEWPORT_MARGIN) {
    // Position above so bottom edge touches click point
    // Add a small offset so the menu doesn't cover the cursor completely
    y = clickPosition.y - estimatedMenuHeight + 10;
  }

  // Only apply bounds checking if menu would go outside viewport
  // Use smaller margins for more precise positioning
  const minMargin = 2;
  if (x < minMargin) {
    x = minMargin;
  }
  if (x > window.innerWidth - estimatedMenuWidth - minMargin) {
    x = window.innerWidth - estimatedMenuWidth - minMargin;
  }
  if (y < minMargin) {
    y = minMargin;
  }
  if (y > window.innerHeight - estimatedMenuHeight - minMargin) {
    y = window.innerHeight - estimatedMenuHeight - minMargin;
  }

  return { x, y };
}

/**
 * Calculates the optimal position for the label manager relative to the context menu
 * 
 * @param contextMenuPosition - The current position of the context menu
 * @returns Position for the label manager that stays within viewport bounds
 */
export function calculateLabelManagerPosition(contextMenuPosition: { x: number; y: number }): LabelManagerPosition {
  const { CONTEXT_MENU_WIDTH, LABEL_MANAGER_WIDTH, LABEL_MANAGER_HEIGHT, MENU_MARGIN, VIEWPORT_MARGIN } = DIMENSIONS;

  // Default position: to the right of the context menu
  let left = contextMenuPosition.x + CONTEXT_MENU_WIDTH + MENU_MARGIN;
  let top = contextMenuPosition.y;

  // Check if there's enough space on the right side of the screen
  const spaceRight = window.innerWidth - left;
  if (spaceRight < LABEL_MANAGER_WIDTH) {
    // Not enough space on right, position to the left instead
    left = contextMenuPosition.x - LABEL_MANAGER_WIDTH - MENU_MARGIN;
  }

  // Ensure the label manager stays within viewport bounds
  left = Math.max(VIEWPORT_MARGIN, Math.min(left, window.innerWidth - LABEL_MANAGER_WIDTH - VIEWPORT_MARGIN));
  top = Math.max(VIEWPORT_MARGIN, Math.min(top, window.innerHeight - LABEL_MANAGER_HEIGHT - VIEWPORT_MARGIN));

  return { left, top };
}

/**
 * Calculates the optimal position for the date picker relative to the context menu
 * 
 * @param contextMenuPosition - The current position of the context menu
 * @returns Position for the date picker that stays within viewport bounds
 */
export function calculateDatePickerPosition(contextMenuPosition: { x: number; y: number }): LabelManagerPosition {
  const { CONTEXT_MENU_WIDTH, DATE_PICKER_WIDTH, DATE_PICKER_HEIGHT, MENU_MARGIN, VIEWPORT_MARGIN } = DIMENSIONS;

  // Default position: to the right of the context menu
  let left = contextMenuPosition.x + CONTEXT_MENU_WIDTH + MENU_MARGIN;
  let top = contextMenuPosition.y;

  // Check if there's enough space on the right side of the screen
  const spaceRight = window.innerWidth - left;
  if (spaceRight < DATE_PICKER_WIDTH) {
    // Not enough space on right, position to the left instead
    left = contextMenuPosition.x - DATE_PICKER_WIDTH - MENU_MARGIN;
  }

  // Ensure the date picker stays within viewport bounds
  left = Math.max(VIEWPORT_MARGIN, Math.min(left, window.innerWidth - DATE_PICKER_WIDTH - VIEWPORT_MARGIN));
  top = Math.max(VIEWPORT_MARGIN, Math.min(top, window.innerHeight - DATE_PICKER_HEIGHT - VIEWPORT_MARGIN));

  return { left, top };
}

/**
 * Generates a shareable URL for a specific card
 * 
 * @param origin - The current origin (window.location.origin)
 * @param boardId - The ID of the board containing the card
 * @param cardId - The ID of the card
 * @returns Full URL to the card
 */
export function generateCardUrl(origin: string, boardId: string, cardId: string): string {
  return `${origin}/board/${boardId}/card/${cardId}`;
}

/**
 * Copies text to the clipboard using the modern Clipboard API
 * 
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves when copy is successful
 */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
