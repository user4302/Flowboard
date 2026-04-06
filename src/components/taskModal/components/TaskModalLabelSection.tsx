'use client';

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Tag, Plus } from 'lucide-react';
import { Label } from '@/lib/types';
import { PopoverCoords } from '@/components/taskCard/types';
import { getContrastColor } from '@/lib/colorUtils';
import { TaskModalLabelManager } from './LabelManager/TaskModalLabelManager';

interface TaskModalLabelSectionProps {
  boardId: string;
  cardId: string;
  labelIds: string[];
  labels: Label[];
}

export function TaskModalLabelSection({
  boardId,
  cardId,
  labelIds,
  labels
}: TaskModalLabelSectionProps) {
  const [showLabelManager, setShowLabelManager] = useState(false);
  const [popoverCoords, setPopoverCoords] = useState<PopoverCoords>({ left: 0 });
  const labelTriggerRef = useRef<HTMLDivElement>(null);

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
    <div className="relative" ref={labelTriggerRef}>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        <Tag className="mr-1 inline h-4 w-4" />
        Labels
      </label>
      <div className="flex flex-wrap gap-2">
        {labelIds?.map((labelId) => {
          const label = labels.find((l: Label) => l.id === labelId);
          if (!label) return null;
          return (
            <span
              key={label.id}
              className="inline-flex h-8 items-center rounded px-3 text-sm font-semibold transition-all hover:brightness-110 cursor-pointer"
              style={{
                backgroundColor: label.color,
                color: getContrastColor(label.color)
              }}
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

      {/* Label Manager Popover via SearchAndFilterPortal */}
      {showLabelManager && typeof document !== 'undefined' && createPortal(
        <>
          <div
            className="fixed inset-0 bg-transparent z-[99]"
            onClick={() => setShowLabelManager(false)}
          />
          <div
            className="fixed z-[100] flex flex-col items-start"
            style={{
              top: popoverCoords.top ? `${popoverCoords.top}px` : undefined,
              bottom: popoverCoords.top ? undefined : `${popoverCoords.bottom}px`,
              left: `${popoverCoords.left}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <TaskModalLabelManager
              boardId={boardId}
              cardId={cardId}
              selectedLabelIds={labelIds || []}
              onClose={() => setShowLabelManager(false)}
            />
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
