'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
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
  ExternalLink
} from 'lucide-react';
import { Card as CardType } from '@/lib/types';
import { useBoardStore } from '@/store';
import { cn } from '@/lib/utils';

interface CardContextMenuProps {
  card: CardType;
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  onOpenCard: () => void;
}

export function CardContextMenu({
  card,
  isOpen,
  onClose,
  position,
  onOpenCard
}: CardContextMenuProps) {
  const { currentBoardId, duplicateCard, archiveCard, moveCard } = useBoardStore();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAction = async (action: () => void | Promise<void>) => {
    setIsProcessing(true);
    try {
      await action();
      onClose();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDuplicate = async () => {
    if (currentBoardId) {
      duplicateCard(currentBoardId, card.id, card.listId);
    }
  };

  const handleArchive = async () => {
    if (currentBoardId) {
      archiveCard(currentBoardId, card.id);
    }
  };

  const handleCopyLink = () => {
    const cardUrl = `${window.location.origin}/board/${currentBoardId}/card/${card.id}`;
    navigator.clipboard.writeText(cardUrl);
  };

  const handleMove = () => {
    // TODO: Implement move dialog
    alert('Move dialog coming soon!');
  };

  const handleLabels = () => {
    // TODO: Implement label picker
    alert('Label picker coming soon!');
  };

  const handleMembers = () => {
    // TODO: Implement member picker
    alert('Member picker coming soon!');
  };

  const handleCover = () => {
    // TODO: Implement cover picker
    alert('Cover picker coming soon!');
  };

  const handleDates = () => {
    // TODO: Implement date picker
    alert('Date picker coming soon!');
  };

  const handleMirror = () => {
    // TODO: Implement mirror functionality (backend required)
    alert('Mirror functionality requires backend implementation!');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const menuContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={handleBackdropClick}
      />

      {/* Context Menu */}
      <div
        className={cn(
          "fixed z-50 min-w-[200px] max-w-[280px]",
          "bg-white dark:bg-slate-800",
          "border border-slate-200 dark:border-slate-600",
          "rounded-lg shadow-lg",
          "py-1",
          "animate-in fade-in-0 zoom-in-95",
          "duration-200"
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Open Card */}
        <button
          onClick={() => handleAction(onOpenCard)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ExternalLink className="h-4 w-4 flex-shrink-0" />
          <span>Open card</span>
        </button>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-600 my-1"></div>

        {/* Edit Labels */}
        <button
          onClick={() => handleAction(handleLabels)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Tag className="h-4 w-4 flex-shrink-0" />
          <span>Edit labels</span>
        </button>

        {/* Change Members */}
        <button
          onClick={() => handleAction(handleMembers)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Users className="h-4 w-4 flex-shrink-0" />
          <span>Change members</span>
        </button>

        {/* Change Cover */}
        <button
          onClick={() => handleAction(handleCover)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image className="h-4 w-4 flex-shrink-0" />
          <span>Change cover</span>
        </button>

        {/* Edit Dates */}
        <button
          onClick={() => handleAction(handleDates)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span>Edit dates</span>
        </button>

        {/* Move */}
        <button
          onClick={() => handleAction(handleMove)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight className="h-4 w-4 flex-shrink-0" />
          <span>Move</span>
        </button>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-600 my-1"></div>

        {/* Copy Card */}
        <button
          onClick={() => handleAction(handleDuplicate)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Copy className="h-4 w-4 flex-shrink-0" />
          <span>Copy card</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={() => handleAction(handleCopyLink)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Link className="h-4 w-4 flex-shrink-0" />
          <span>Copy link</span>
        </button>

        {/* Mirror */}
        <button
          onClick={() => handleAction(handleMirror)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GitBranch className="h-4 w-4 flex-shrink-0" />
          <span>Mirror</span>
        </button>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-600 my-1"></div>

        {/* Archive */}
        <button
          onClick={() => handleAction(handleArchive)}
          disabled={isProcessing}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Archive className="h-4 w-4 flex-shrink-0" />
          <span>Archive</span>
        </button>
      </div>
    </>
  );

  return createPortal(menuContent, document.body);
}
