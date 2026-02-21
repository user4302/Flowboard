'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, User, Tag, CheckSquare, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBoardStore, useUIStore } from '@/store';
import { Button, Input, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui';
import { LABEL_COLORS } from '@/lib/constants';
import { cn, formatDate } from '@/lib/utils';

const cardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type CardFormData = z.infer<typeof cardSchema>;

export function CardModal() {
  const { cardModalOpen, selectedCardId, closeCardModal } = useUIStore();
  const { boards, currentBoardId, updateCard, addLabel, removeLabel, addChecklistItem, updateChecklistItem, removeChecklistItem } = useBoardStore();
  
  const [newLabelText, setNewLabelText] = useState('');
  const [newLabelColor, setNewLabelColor] = useState(LABEL_COLORS[0]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [showNewLabelInput, setShowNewLabelInput] = useState(false);
  const [showNewChecklistInput, setShowNewChecklistInput] = useState(false);

  const currentBoard = boards.find(b => b.id === currentBoardId);
  const card = currentBoard?.lists.flatMap(l => l.cards).find(c => c.id === selectedCardId);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      title: card?.title || '',
      description: card?.description || '',
    },
  });

  useEffect(() => {
    if (card) {
      reset({
        title: card.title,
        description: card.description || '',
      });
    }
  }, [card, reset]);

  if (!card || !currentBoard) return null;

  const handleSave = (data: CardFormData) => {
    updateCard(currentBoardId, card.id, data);
    closeCardModal();
  };

  const handleAddLabel = () => {
    if (newLabelText.trim()) {
      addLabel(currentBoardId, card.id, {
        text: newLabelText.trim(),
        color: newLabelColor,
      });
      setNewLabelText('');
      setShowNewLabelInput(false);
    }
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      addChecklistItem(currentBoardId, card.id, newChecklistItem.trim());
      setNewChecklistItem('');
      setShowNewChecklistInput(false);
    }
  };

  const handleToggleChecklistItem = (itemId: string, done: boolean) => {
    updateChecklistItem(currentBoardId, card.id, itemId, { done });
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    removeChecklistItem(currentBoardId, card.id, itemId);
  };

  const cardMembers = currentBoard.members.filter(member => card.members.includes(member.id));

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
          {/* Title */}
          <div>
            <Input
              {...register('title')}
              placeholder="Card title"
              className="text-lg font-semibold"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
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

          {/* Labels */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              <Tag className="mr-1 inline h-4 w-4" />
              Labels
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {card.labels.map((label) => (
                <span
                  key={label.id}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white',
                    label.color
                  )}
                >
                  {label.text}
                  <button
                    type="button"
                    onClick={() => removeLabel(currentBoardId, card.id, label.id)}
                    className="hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {showNewLabelInput ? (
              <div className="flex gap-2">
                <Input
                  value={newLabelText}
                  onChange={(e) => setNewLabelText(e.target.value)}
                  placeholder="Label text"
                  className="flex-1"
                />
                <select
                  value={newLabelColor}
                  onChange={(e) => setNewLabelColor(e.target.value)}
                  className="rounded-lg border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  {LABEL_COLORS.map((color) => (
                    <option key={color} value={color}>
                      {color.replace('bg-', '').replace('-500', '')}
                    </option>
                  ))}
                </select>
                <Button type="button" size="sm" onClick={handleAddLabel}>
                  Add
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowNewLabelInput(false);
                    setNewLabelText('');
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
                onClick={() => setShowNewLabelInput(true)}
              >
                Add label
              </Button>
            )}
          </div>

          {/* Members */}
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

          {/* Dates */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              <Calendar className="mr-1 inline h-4 w-4" />
              Dates
            </label>
            <div className="space-y-2 text-sm">
              {card.startDate && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Start: </span>
                  <span className="text-slate-700 dark:text-slate-300">{formatDate(card.startDate)}</span>
                </div>
              )}
              {card.dueDate && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Due: </span>
                  <span className="text-slate-700 dark:text-slate-300">{formatDate(card.dueDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Checklist */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              <CheckSquare className="mr-1 inline h-4 w-4" />
              Checklist
            </label>
            <div className="space-y-2">
              {card.checklist.map((item) => (
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
