import { Calendar, User, Tag, CheckSquare, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input, Button } from '@/components/ui';
import { ModalFormProps } from '../types/card.types';
import { CardCompletion } from './CardCompletion';
import { CardMembers } from './CardMembers';

export function ModalForm({ card, form, errors, register, onToggleCompleted }: ModalFormProps) {
  return (
    <>
      {/* Title - Required field with validation */}
      <div className="flex items-center gap-3">
        <CardCompletion
          completed={card.completed}
          onToggle={onToggleCompleted}
          size="medium"
        />
        <div className="flex-1">
          <Input
            {...register('title')}
            placeholder="Card title"
            className={cn(
              "text-lg font-semibold",
              card.completed && "line-through opacity-60"
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

      {/* Priority - Number-based priority input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          <Flag className="mr-1 inline h-4 w-4" />
          Priority
        </label>
        <input
          type="number"
          min="1"
          max="100"
          placeholder="Enter priority (1-100)"
          {...register('priority', { valueAsNumber: true })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
        {errors.priority && (
          <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
        )}
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Enter a number between 1-100 (higher numbers = higher priority)
        </p>
      </div>

      {/* Members - Display assigned team members */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          <User className="mr-1 inline h-4 w-4" />
          Members
        </label>
        <CardMembers members={[]} maxVisible={8} />
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
        {/* ChecklistManager will be used here */}
      </div>
    </>
  );
}
