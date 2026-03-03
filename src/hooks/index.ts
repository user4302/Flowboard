/**
 * Hooks index file - Exports all custom hooks for the application
 * Provides centralized access to board, drag-and-drop, local storage, and UI store hooks
 */
export { useBoard } from './useBoard';
export { useDragAndDrop } from './useDragAndDrop';
export { useLocalStorage } from './useLocalStorage';
export { useClickOutside } from './useClickOutside';
export { useUIStore } from '../store/uiStore';
