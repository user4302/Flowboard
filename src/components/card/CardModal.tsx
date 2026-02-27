'use client';

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Tag, Plus } from 'lucide-react';
import { useBoardStore, useUIStore } from '@/store';
import { Button, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui';
import { useCardForm } from './hooks/useCardForm';
import { useChecklist } from './hooks/useChecklist';
import { useCardActions } from './hooks/useCardActions';
import { PopoverCoords } from './types/card.types';
import { Card, Label } from '@/lib/types';
import { LabelManager } from './LabelManager';
import { ModalForm } from './components/ModalForm';
import { ChecklistManager } from './components/ChecklistManager';

export function CardModal() {
  // Store hooks for state management - MUST be called first
  const { cardModalOpen, selectedCardId, closeCardModal } = useUIStore();
  const { boards, currentBoardId, updateCard } = useBoardStore();

  // Find current board and selected card
  const currentBoard = boards.find(b => b.id === currentBoardId);
  const foundCard = currentBoard?.lists.flatMap(l => l.cards).find(c => c.id === selectedCardId);

  // Custom hooks - MUST be called before any conditional logic
  // Pass safe defaults that hooks can handle
  const form = useCardForm({ card: foundCard || null });
  const checklist = useChecklist({
    boardId: currentBoardId || '',
    cardId: foundCard?.id || ''
  });
  const { handleSaveCard } = useCardActions();

  // Local state for label manager - MUST be called before any conditional logic
  const [showLabelManager, setShowLabelManager] = useState(false);
  const [popoverCoords, setPopoverCoords] = useState<PopoverCoords>({ left: 0 });

  // Refs for positioning
  const labelTriggerRef = useRef<HTMLDivElement>(null);

  // Early return if card data is not available
  if (!foundCard || !currentBoard || !currentBoardId) {
    return null;
  }

  /**
   * Handles form submission to save card changes
   */
  const handleSave = (data: any) => {
    handleSaveCard(currentBoardId, foundCard.id, data, closeCardModal);
  };

  /**
   * Handles toggling card completion status
   */
  const handleToggleCompleted = () => {
    updateCard(currentBoardId, foundCard.id, { completed: !foundCard.completed });
  };

  /**
   * Handles label click to show label manager
   */
  const handleLabelClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const hasSpaceBelow = spaceBelow > 450;

    setPopoverCoords({
      top: hasSpaceBelow ? rect.bottom + 8 : undefined,
      bottom: hasSpaceBelow ? undefined : (window.innerHeight - rect.top) + 8,
      left: rect.left
    });
    setShowLabelManager(true);
  };

  return (
    <Modal open={cardModalOpen} onClose={closeCardModal}>
      <ModalHeader>
        <ModalTitle>Edit Card</ModalTitle>
        <button
          onClick={closeCardModal}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          <X className="h-5 w-5" />
        </button>
      </ModalHeader>

      <form onSubmit={form.handleSubmit(handleSave)}>
        <ModalBody className="space-y-6">
          <ModalForm
            card={foundCard}
            form={form}
            errors={form.formState.errors}
            register={form.register}
            onToggleCompleted={handleToggleCompleted}
          />

          {/* Labels */}
          <div className="relative" ref={labelTriggerRef}>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              <Tag className="mr-1 inline h-4 w-4" />
              Labels
            </label>
            <div className="flex flex-wrap gap-2">
              {foundCard.labelIds?.map((labelId) => {
                const label = currentBoard.labels.find((l: Label) => l.id === labelId);
                if (!label) return null;
                return (
                  <span
                    key={label.id}
                    className={`inline-flex h-8 items-center rounded px-3 text-sm font-semibold text-white transition-all hover:brightness-110 cursor-pointer ${label.color}`}
                    onClick={handleLabelClick}
                  >
                    {label.text}
                  </span>
                );
              })}
              <button
                type="button"
                onClick={handleLabelClick}
                className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Label Manager Popover via Portal */}
            {showLabelManager && typeof document !== 'undefined' && createPortal(
              <div
                className="fixed z-[100] flex flex-col items-start"
                style={{
                  top: popoverCoords.top !== undefined ? `${popoverCoords.top}px` : 'auto',
                  bottom: popoverCoords.bottom !== undefined ? `${popoverCoords.bottom}px` : 'auto',
                  left: `${Math.min(popoverCoords.left, window.innerWidth - 330)}px`,
                  maxHeight: popoverCoords.top !== undefined
                    ? `calc(100vh - ${popoverCoords.top}px - 20px)`
                    : `calc(100vh - ${popoverCoords.bottom}px - 20px)`
                }}
              >
                <div className="fixed inset-0 bg-transparent" onClick={() => setShowLabelManager(false)} />
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <LabelManager
                    boardId={currentBoardId}
                    cardId={foundCard.id}
                    selectedLabelIds={foundCard.labelIds || []}
                    onClose={() => setShowLabelManager(false)}
                  />
                </div>
              </div>,
              document.body
            )}
          </div>

          {/* Checklist */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Checklist
            </label>
            <ChecklistManager
              cardId={foundCard.id}
              boardId={currentBoardId}
              checklist={foundCard.checklist}
              onAddItem={checklist.handleAddChecklistItem}
              onToggleItem={checklist.handleToggleChecklistItem}
              onDeleteItem={checklist.handleDeleteChecklistItem}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="submit">Save changes</Button>
          <Button type="button" variant="ghost" onClick={closeCardModal}>
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
