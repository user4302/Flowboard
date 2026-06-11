'use client';

import { Calendar, User, Tag, CheckSquare, Flag, Maximize2, Minimize2, Pencil, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { Input, Button, DateTimePicker } from '@/components/ui';
import { Controller } from 'react-hook-form';
import { ModalFormProps } from '@/components/taskModal/types/TaskModal.form.types';
import { TaskCardCardCompletion } from '@/components/taskCard/components/TaskCardCardCompletion';
import { TaskCardCardMembers } from '@/components/taskCard/components/TaskCardCardMembers';
import React, { useState, useRef, useEffect, useMemo } from 'react';

export function TaskModalForm({ card, form, errors, register, onToggleCompleted }: ModalFormProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [descriptionValue, setDescriptionValue] = useState(card?.description || '');
  const [contentExceedsHeight, setContentExceedsHeight] = useState(false);

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  // Update description when card changes
  useEffect(() => {
    // Use setTimeout to avoid calling setState synchronously
    const timeoutId = setTimeout(() => setDescriptionValue(card?.description || ''), 0);
    return () => clearTimeout(timeoutId);
  }, [card?.description, card?.id]);

  // Check if content exceeds default height
  useEffect(() => {
    // Use a temporary textarea for measurement
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = descriptionValue;
    tempTextarea.style.width = '100%';
    tempTextarea.style.position = 'absolute';
    tempTextarea.style.visibility = 'hidden';
    tempTextarea.style.font = '0.875rem sans-serif'; // text-sm
    tempTextarea.style.padding = '0.5rem'; // px-3 py-2
    document.body.appendChild(tempTextarea);
    
    // Default 4 rows = approximately 96px
    setContentExceedsHeight(tempTextarea.scrollHeight > 96);
    
    document.body.removeChild(tempTextarea);
  }, [descriptionValue]);

  // Auto-adjust height when expanded or content changes
  useEffect(() => {
    if (textareaRef.current && isDescriptionExpanded) {
      // Reset height to auto to get the natural scroll height
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    } else if (textareaRef.current && !isDescriptionExpanded) {
      // Reset to default when collapsed
      textareaRef.current.style.height = '';
    }
  }, [isDescriptionExpanded, descriptionValue]);

  const toggleDescriptionExpansion = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  // Memoize date values
  const startDateValue = useMemo(() => form.watch('startDate') ? new Date(form.watch('startDate')) : null, [form.watch('startDate')]);
  const dueDateValue = useMemo(() => form.watch('dueDate') ? new Date(form.watch('dueDate')) : null, [form.watch('dueDate')]);

  return (
    <>
      {/* Title - Required field with validation */}
      <div className="flex items-center gap-3">
        <TaskCardCardCompletion
          completed={card?.completed || false}
          onToggle={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onToggleCompleted?.();
          }}
          size="medium"
        />
        <div className="flex-1">
          <Input
            {...register('title')}
            placeholder="Card title"
            className={cn(
              "text-lg font-semibold",
              card?.completed && "line-through opacity-60"
            )}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
      </div>

      {/* Description - Optional rich text area */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleDescriptionExpansion}
            className="text-slate-500 hover:text-slate-700 h-6 px-2 text-xs"
          >
            {isDescriptionExpanded ? (
              <>
                <Minimize2 className="h-3 w-3 mr-1" />
                Shrink
              </>
            ) : (
              <>
                <Maximize2 className="h-3 w-3 mr-1" />
                Expand
              </>
            )}
          </Button>
        </div>
        <div
          className={cn(
            "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 transition-all duration-200 overflow-hidden",
            isDescriptionExpanded ? "h-[300px]" : "h-[140px]"
          )}
          onClick={() => setIsEditing(true)}
        >
          {isEditing ? (
            <textarea
              value={descriptionValue}
              onChange={(e) => {
                setDescriptionValue(e.target.value);
                form.setValue('description', e.target.value, { shouldDirty: true });
              }}
              onBlur={() => setIsEditing(false)}
              ref={textareaRef}
              className="w-full h-full bg-transparent focus:outline-none resize-none overflow-y-auto overscroll-y-contain"
              placeholder="Add a more detailed description..."
              autoFocus
            />
          ) : (
            <div className="prose dark:prose-invert prose-sm max-w-none h-full overflow-y-auto overscroll-y-contain">
              {descriptionValue ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{descriptionValue}</ReactMarkdown>
              ) : (
                <span className="text-slate-400 italic">Add a more detailed description...</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Priority - Number-based priority input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          <Flag className="mr-1 inline h-4 w-4" />
          Priority
        </label>
        <input
          type="number"
          min="0"
          max="100"
          placeholder="Enter priority (0-100)"
          {...register('priority', {
            valueAsNumber: false,
            setValueAs: (value: string | number | null | undefined) => value === '' ? null : (value !== null && value !== undefined ? Number(value) : null)
          })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
        {errors.priority && (
          <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
        )}
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Optional: Enter a number between 0-100 (higher numbers = higher priority)
        </p>
      </div>

      {/* Members - Display assigned team members */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          <User className="mr-1 inline h-4 w-4" />
          Members
        </label>
        <TaskCardCardMembers members={[]} maxVisible={8} />
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
            <Controller
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <DateTimePicker
                  value={startDateValue}
                  onChange={(date) => field.onChange(date.toISOString())}
                  isStartDate={true}
                />
              )}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Due Date</label>
            <Controller
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <DateTimePicker
                  value={dueDateValue}
                  onChange={(date) => field.onChange(date.toISOString())}
                  isStartDate={false}
                />
              )}
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
