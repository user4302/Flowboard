import { DIMENSIONS } from './constants';
import { LabelManagerPosition } from './types';

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
