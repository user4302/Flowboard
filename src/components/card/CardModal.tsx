'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, User, Tag, CheckSquare, Trash2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBoardStore, useUIStore } from '@/store';
import { fromUTCString, toUTCString } from '@/lib/dateUtils';
import { Button, Input, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui';
import { LABEL_COLORS } from '@/lib/constants';
import { cn, formatDate, generateId } from '@/lib/utils';
import { Card, Label } from '@/lib/types';
import { LabelManager } from './LabelManager';

/**
 * Zod schema for card form validation
 * Defines the structure and validation rules for card data
 */
const cardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
});

/**
 * Type inference from the card schema
 * Provides TypeScript types for form data
 */
type CardFormData = z.infer<typeof cardSchema>;

/**
 * CardModal component - Modal for editing card details
 * Provides comprehensive card editing including title, description, labels, members, dates, and checklists
 * Uses react-hook-form with zod validation for form management
 */
export function CardModal() {
  // Store hooks for state management
  const { cardModalOpen, selectedCardId, closeCardModal } = useUIStore();
  const {
    boards,
    currentBoardId,
    updateCard,
    addChecklistItem,
    updateChecklistItem,
    removeChecklistItem
  } = useBoardStore();

  // Local state for dynamic form elements
  const [showLabelManager, setShowLabelManager] = useState(false);
  const [popoverCoords, setPopoverCoords] = useState<{ top?: number, bottom?: number, left: number }>({ left: 0 });
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [showNewChecklistInput, setShowNewChecklistInput] = useState(false);

  // Refs for positioning
  const labelTriggerRef = useRef<HTMLDivElement>(null);

  // Find current board and selected card
  const currentBoard = boards.find(b => b.id === currentBoardId);
  const foundCard = currentBoard?.lists.flatMap(l => l.cards).find(c => c.id === selectedCardId);

  // React Hook Form setup with zod validation
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      title: foundCard?.title || '',
      description: foundCard?.description || '',
      startDate: foundCard?.startDate ? foundCard.startDate.toISOString().split('T')[0] : '',
      dueDate: foundCard?.dueDate ? foundCard.dueDate.toISOString().split('T')[0] : '',
    },
  });

  // Explicitly type as Card since we've confirmed it exists
  // const card = foundCard; // Removed - use foundCard directly

  // Reset form when card changes
  useEffect(() => {
    if (foundCard) {
      reset({
        title: foundCard.title,
        description: foundCard.description || '',
        startDate: foundCard.startDate ? foundCard.startDate.toISOString().split('T')[0] : '',
        dueDate: foundCard.dueDate ? foundCard.dueDate.toISOString().split('T')[0] : '',
      });
    }
  }, [foundCard, reset]);

  // Filter members assigned to this card
  const cardMembers = currentBoard?.members.filter(member => foundCard?.members.includes(member.id)) || [];

  // Early return if card data is not available
  if (!foundCard || !currentBoard || !currentBoardId) {
    return null;
  }

  // Handler functions - defined inside conditional to ensure card and currentBoard are available

  /**
   * Handles form submission to save card changes
   * Updates card with form data including dates
   * @param data - Form data from react-hook-form
   */
  const handleSave = (data: CardFormData) => {
    const updateData: any = {
      title: data.title,
      description: data.description,
    };

    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }

    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate);
    }

    updateCard(currentBoardId, foundCard.id, updateData);
    closeCardModal();
  };

  // Handlers for checklist and title removed/moved if necessary, focus on labels

  /**
   * Handles adding a new checklist item
   * Creates checklist item with default unchecked state
   */
  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      addChecklistItem(currentBoardId, foundCard.id, newChecklistItem.trim());
      setNewChecklistItem('');
      setShowNewChecklistInput(false);
    }
  };

  /**
   * Handles toggling checklist item completion status
   * @param itemId - ID of the checklist item to update
   * @param done - New completion status
   */
  const handleToggleChecklistItem = (itemId: string, done: boolean) => {
    updateChecklistItem(currentBoardId, foundCard.id, itemId, { done });
  };

  /**
   * Handles deletion of checklist items
   * @param itemId - ID of the checklist item to delete
   */
  const handleDeleteChecklistItem = (itemId: string) => {
    removeChecklistItem(currentBoardId, foundCard.id, itemId);
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

      <form onSubmit={handleSubmit(handleSave)}>
        <ModalBody className="space-y-6">
          {/* Title - Required field with validation */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => {
                if (currentBoardId) {
                  updateCard(currentBoardId, foundCard.id, { completed: !foundCard.completed });
                }
              }}
              className="mt-2.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors"
              style={{
                borderColor: foundCard.completed ? '#10b981' : '#d1d5db',
                backgroundColor: foundCard.completed ? '#10b981' : 'transparent'
              }}
            >
              {foundCard.completed && (
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <div className="flex-1">
              <Input
                {...register('title')}
                placeholder="Card title"
                className={cn(
                  "text-lg font-semibold",
                  foundCard.completed && "line-through opacity-60"
                )}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
          </div>
          {/* Description - Optional rich text area */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Add a more detailed description..."
            />
          </div>

          {/* Labels - Global board labels referenced by ID */}
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
                    className={cn(
                      'inline-flex h-8 items-center rounded px-3 text-sm font-semibold text-white transition-all hover:brightness-110 cursor-pointer',
                      label.color
                    )}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const spaceBelow = window.innerHeight - rect.bottom;
                      const hasSpaceBelow = spaceBelow > 450;

                      setPopoverCoords({
                        top: hasSpaceBelow ? rect.bottom + 8 : undefined,
                        bottom: hasSpaceBelow ? undefined : (window.innerHeight - rect.top) + 8,
                        left: rect.left
                      });
                      setShowLabelManager(true);
                    }}
                  >
                    {label.text}
                  </span>
                );
              })}
              <button
                type="button"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const spaceBelow = window.innerHeight - rect.bottom;
                  const hasSpaceBelow = spaceBelow > 450;

                  setPopoverCoords({
                    top: hasSpaceBelow ? rect.bottom + 8 : undefined,
                    bottom: hasSpaceBelow ? undefined : (window.innerHeight - rect.top) + 8,
                    left: rect.left
                  });
                  setShowLabelManager(true);
                }}
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

          {/* Members - Display assigned team members */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              <User className="mr-1 inline h-4 w-4" />
              Members
            </label>
            <div className="flex -space-x-2">
              {cardMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-xs font-medium text-white dark:border-slate-900"
                  title={member.name}
                >
                  {member.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          {/* Dates - Start and due date pickers */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              <Calendar className="mr-1 inline h-4 w-4" />
              Dates
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Start Date</label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  {...register('dueDate')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Checklist - Task items with completion tracking */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              <CheckSquare className="mr-1 inline h-4 w-4" />
              Checklist
            </label>
            <div className="space-y-2">
              {foundCard.checklist?.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={(e) => handleToggleChecklistItem(item.id, e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                  />
                  <span
                    className={cn(
                      'flex-1 text-sm',
                      item.done && 'line-through text-slate-500 dark:text-slate-400'
                    )}
                  >
                    {item.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteChecklistItem(item.id)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {showNewChecklistInput ? (
                <div className="flex gap-2">
                  <Input
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    placeholder="Checklist item"
                    className="flex-1"
                  />
                  <Button type="button" size="sm" onClick={handleAddChecklistItem}>
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowNewChecklistInput(false);
                      setNewChecklistItem('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewChecklistInput(true)}
                >
                  Add item
                </Button>
              )}
            </div>
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
