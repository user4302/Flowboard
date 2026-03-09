'use client';

import { X } from 'lucide-react';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { ArchiveModalProps } from './types';
import { useArchiveModal } from './hooks/useArchiveModal';
import { formatDate } from './utils';
import { ArchivedCardItem } from './components/ArchivedCardItem';
import { EmptyState } from './components/EmptyState';

export function ArchiveModal({ isOpen, onClose }: ArchiveModalProps) {
  const {
    currentBoard,
    archivedCards,
    isProcessing,
    deleteConfirmation,
    modalRef,
    deleteModalRef,
    handleUnarchive,
    handlePermanentlyDelete,
    confirmPermanentDelete,
    closeDeleteConfirmation,
  } = useArchiveModal(onClose);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
        >
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
              <EmptyState archivedCardsLength={archivedCards.length} />
            ) : (
              <div className="space-y-3">
                {archivedCards.map((archivedCard) => (
                  <ArchivedCardItem
                    key={archivedCard.id}
                    archivedCard={archivedCard}
                    onUnarchive={handleUnarchive}
                    onPermanentlyDelete={handlePermanentlyDelete}
                    isProcessing={isProcessing}
                    currentBoard={currentBoard!}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {archivedCards.length > 0 && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-600">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Archived cards are stored indefinitely. Use the Restore button to move them back to their original list, or Delete to permanently remove them.
              </p>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <ConfirmationModal
            isOpen={deleteConfirmation.isOpen}
            onClose={closeDeleteConfirmation}
            onConfirm={confirmPermanentDelete}
            title="Permanently Delete Card"
            content={`Are you sure you want to permanently delete "${deleteConfirmation.cardTitle}"? This action cannot be undone and the card will be lost forever.`}
            confirmText="Delete Forever"
            cancelText="Cancel"
            variant="danger"
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </>
  );
}
