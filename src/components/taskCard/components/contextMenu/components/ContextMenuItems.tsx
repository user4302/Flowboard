import React from 'react';
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
  ExternalLink,
  Download,
  Upload
} from 'lucide-react';
import { CSS_CLASSES } from '../constants';
import { MenuItemConfig, ContextMenuItemProps } from '../types';

/**
 * Individual context menu item component
 * Renders a single menu item with icon, label, and click handler
 */
export function ContextMenuItem({ config, disabled }: ContextMenuItemProps) {
  const variantClass = config.variant === 'danger' ? CSS_CLASSES.MENU_ITEM_DANGER : CSS_CLASSES.MENU_ITEM_DEFAULT;

  return (
    <button
      onClick={config.onClick}
      disabled={disabled || config.disabled}
      className={`${CSS_CLASSES.MENU_ITEM} ${variantClass}`}
    >
      <config.icon className={CSS_CLASSES.ICON} />
      <span>{config.label}</span>
    </button>
  );
}

/**
 * Props for the context menu items list component
 */
interface ContextMenuItemsProps {
  onOpenCard: () => void;
  onLabels: (e: React.MouseEvent) => void;
  onDates: (e: React.MouseEvent) => void;
  onMove: (e: React.MouseEvent) => void;
  actionHandlers: {
    handleDuplicate: () => void;
    handleCopyAsJSON: () => void;
    handleDownloadJSON: () => void;
    handleUploadJSON: () => void;
    handleArchive: () => void;
    handleCopyLink: () => void;
    handleMove: () => void;
    handleMembers: () => void;
    handleCover: () => void;
    handleMirror: () => void;
  };
  isProcessing: boolean;
}

/**
 * Renders all context menu items with proper grouping and dividers
 */
export function ContextMenuItems({
  onOpenCard,
  onLabels,
  onDates,
  onMove,
  actionHandlers,
  isProcessing,
}: ContextMenuItemsProps) {
  const {
    handleDuplicate,
    handleCopyAsJSON,
    handleDownloadJSON,
    handleUploadJSON,
    handleArchive,
    handleCopyLink,
    handleMove,
    handleMembers,
    handleCover,
    handleMirror,
  } = actionHandlers;

  const menuItems: MenuItemConfig[] = [
    // Card actions
    {
      icon: ExternalLink,
      label: 'Open card',
      onClick: onOpenCard,
    },

    // Label and member actions
    {
      icon: Tag,
      label: 'Labels',
      onClick: onLabels,
    },
    {
      icon: Users,
      label: 'Members',
      onClick: handleMembers,
    },
    {
      icon: Calendar,
      label: 'Dates',
      onClick: onDates,
    },

    // Card management actions
    {
      icon: ArrowRight,
      label: 'Move',
      onClick: onMove,
    },
    {
      icon: GitBranch,
      label: 'Clone',
      onClick: handleDuplicate,
    },
    {
      icon: Copy,
      label: 'Copy',
      onClick: handleCopyAsJSON,
    },
    {
      icon: Download,
      label: 'Download',
      onClick: handleDownloadJSON,
    },
    {
      icon: Link,
      label: 'Link',
      onClick: handleCopyLink,
    },
    {
      icon: GitBranch,
      label: 'Mirror',
      onClick: handleMirror,
    },

    // Destructive action
    {
      icon: Archive,
      label: 'Archive',
      onClick: handleArchive,
      variant: 'danger',
    },
  ];

  return (
    <>
      {menuItems.map((item, index) => {
        // Add dividers before certain sections
        const shouldAddDivider = index === 1 || index === 5 || index === 11;

        return (
          <React.Fragment key={index}>
            {shouldAddDivider && (
              <div className="border-t border-slate-200 dark:border-slate-600 my-1" />
            )}
            <ContextMenuItem
              config={item}
              disabled={isProcessing}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
