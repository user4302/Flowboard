'use client';

import { useState } from 'react';
import { X, RotateCcw, Trash2, Calendar, Archive } from 'lucide-react';
import { ArchivedCard } from '@/lib/types';
import { useBoardStore } from '@/store';
import { cn } from '@/lib/utils';

interface ArchivedCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArchivedCardsModal({ isOpen, onClose }: ArchivedCardsModalProps) {
  const { currentBoardId, getCurrentBoard, unarchiveCard } = useBoardStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const currentBoard = getCurrentBoard();
  const archivedCards = currentBoard?.archivedCards || [];

  const handleUnarchive = async (archivedCardId: string) => {
    if (!currentBoardId) return;

    setIsProcessing(true);
    try {
      unarchiveCard(currentBoardId, archivedCardId);
    } catch (error) {
      console.error('Failed to unarchive card:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-600">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Archived Cards
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {archivedCards.length} {archivedCards.length === 1 ? 'card' : 'cards'} archived
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {archivedCards.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                  <Archive className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  No archived cards
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Cards you archive will appear here for easy restoration.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {archivedCards.map((archivedCard) => (
                  <div
                    key={archivedCard.id}
                    className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {archivedCard.card.title}
                        </h4>
                        {archivedCard.card.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                            {archivedCard.card.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Archived {formatDate(archivedCard.archivedAt)}</span>
                          </div>
                          <div>
                            From: {currentBoard?.lists.find(l => l.id === archivedCard.originalListId)?.title || 'Unknown list'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleUnarchive(archivedCard.id)}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Restore
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {archivedCards.length > 0 && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-600">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Archived cards are stored indefinitely. Use the Restore button to move them back to their original list.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
