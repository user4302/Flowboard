import { Card as CardType } from '@/lib/types';

/**
 * Props interface for the CardContextMenu component
 */
export interface CardContextMenuProps {
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
 * Position interface for label manager placement
 */
export interface LabelManagerPosition {
  left: number;
  top: number;
}

/**
 * Date picker state interface
 */
export interface DatePickerState {
  show: boolean;
  position: LabelManagerPosition;
}

/**
 * Menu item configuration interface
 */
export interface MenuItemConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: (() => void) | ((e: React.MouseEvent) => void);
  disabled?: boolean;
  variant?: 'default' | 'danger';
}

/**
 * Props for individual context menu items
 */
export interface ContextMenuItemProps {
  config: MenuItemConfig;
  disabled?: boolean;
}
