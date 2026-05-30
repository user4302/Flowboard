import { ChevronLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input, Button } from '@/components/ui';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { getContrastColor } from '@/lib/colorUtils';
import { LabelManagerView } from '../../types/TaskModal.form.types';
import { useRef } from 'react';
import { BASIC_LABEL_COLORS } from '@/lib/constants';

interface TaskModalLabelFormProps {
  view: LabelManagerView;
  labelTitle: string;
  labelColor: string;
  onTitleChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onBack: () => void;
  onClose: () => void;
  existingLabels?: Array<{ color: string; text: string }>;
  modalRef?: React.RefObject<HTMLDivElement | null>;
}

export function TaskModalLabelForm({
  view,
  labelTitle,
  labelColor,
  onTitleChange,
  onColorChange,
  onCreate,
  onUpdate,
  onDelete,
  onBack,
  onClose,
  existingLabels = [],
  modalRef
}: TaskModalLabelFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Handles selection of basic colors from the predefined palette
   * @param color - The hex color value that was selected
   */
  const handleBasicColorSelect = (color: string) => {
    onColorChange(color);
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full space-y-4 overflow-hidden">
      <div className="space-y-4">
        <div className="space-y-2">
          <div
            className="h-10 w-full rounded flex items-center justify-center text-sm font-medium px-3 py-2"
            style={{
              backgroundColor: labelColor || '#64748b',
              color: getContrastColor(labelColor || '#64748b')
            }}
          >
            {labelTitle || 'Label preview'}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Title</label>
          <Input
            value={labelTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Label name"
            className="h-9"
            autoFocus
          />
        </div>

        {/* Basic Colors */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Basic Colors</label>
          <div className="grid grid-cols-5 gap-2">
            {BASIC_LABEL_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleBasicColorSelect(color)}
                className={cn(
                  'w-12 h-12 rounded-md border-2 transition-all hover:scale-105',
                  'border-slate-200 dark:border-slate-600',
                  labelColor === color && 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800'
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {/* Custom Color Button */}
            <button
              type="button"
              onClick={() => {
                // Focus on the ColorPicker trigger to open dropdown
                const colorPickerTrigger = document.querySelector('[data-color-picker-trigger]') as HTMLButtonElement;
                colorPickerTrigger?.click();
              }}
              className={cn(
                'w-12 h-12 rounded-md border-2 transition-all hover:scale-105',
                'border-slate-200 dark:border-slate-600 bg-gradient-to-br from-red-400 via-purple-400 to-blue-400',
                'flex items-center justify-center text-white text-lg font-bold'
              )}
              title="Custom Color"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-hidden">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Advanced Options</label>
        <div className="w-full px-1">
          <ColorPicker
            data-color-picker-trigger
            value={labelColor}
            onChange={onColorChange}
            isInsidePortal={true}
            placeholder="Select a label color"
            showRecentColors={true}
            maxRecentColors={5}
            existingLabels={existingLabels}
            showColorSuggestions={true}
            parentRef={modalRef}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-shrink-0">
        {view === 'create' ? (
          <Button type="button" onClick={onCreate} className="flex-1 h-9">Create</Button>
        ) : (
          <>
            <Button type="button" onClick={onUpdate} className="flex-1 h-9">Save</Button>
            <Button
              type="button"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-9 px-3"
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
