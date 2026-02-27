'use client';

import { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, X, Trash2, Edit3 } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ListHeaderProps {
  title: string;
  cardCount: number;
  onRename: (newTitle: string) => void;
  onDelete: () => void;
  className?: string;
  onMenuToggle?: (isOpen: boolean) => void;
  isAnyMenuOpen?: boolean;
}

/**
 * KanbanListHeader component - Displays list title and card count with edit/delete functionality
 */
export function KanbanListHeader({ title, cardCount, onRename, onDelete, className, onMenuToggle, isAnyMenuOpen }: ListHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== title) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showMenu]);

  // Close menu when another menu is opened
  useEffect(() => {
    if (isAnyMenuOpen && !showMenu) {
      setShowMenu(false);
    }
  }, [isAnyMenuOpen, showMenu]);

  // Notify parent when menu state changes
  useEffect(() => {
    onMenuToggle?.(showMenu);
  }, [showMenu, onMenuToggle]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleRename}
          className="flex-1"
          autoFocus
        />
        <Button size="sm" variant="ghost" onClick={handleCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between group", className)}>
      <h3 className="font-medium text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {cardCount}
        </span>
        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 min-w-[150px]">
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
              >
                <Edit3 className="h-4 w-4" />
                Rename
              </button>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-red-600 dark:text-red-400 transition-colors"
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
