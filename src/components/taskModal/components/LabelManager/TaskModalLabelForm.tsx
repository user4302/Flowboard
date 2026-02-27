import { ChevronLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input, Button } from '@/components/ui';
import { LABEL_COLORS } from '@/lib/constants';
import { LabelManagerView } from '../../types/TaskModal.form.types';

interface TaskModalLabelFormProps {
  view: LabelManagerView;
  labelTitle: string;
  labelColor: typeof LABEL_COLORS[number];
  onTitleChange: (value: string) => void;
  onColorChange: (color: typeof LABEL_COLORS[number]) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onBack: () => void;
  onClose: () => void;
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
  onClose
}: TaskModalLabelFormProps) {
  return (
    <div className="flex flex-col h-full space-y-4 overflow-hidden">
      <div className="space-y-4 flex-shrink-0">
        <div className="space-y-2">
          <div className={cn("h-10 w-full rounded flex items-center justify-center text-sm font-medium text-white", labelColor)}>
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
      </div>

      <div className="flex-1 overflow-y-auto pr-1 min-h-0 custom-scrollbar space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 sticky top-0 bg-white dark:bg-slate-900 py-1 z-10">Select a color</label>
        <div className="grid grid-cols-5 gap-2 pb-2">
          {LABEL_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onColorChange(color);
              }}
              className={cn(
                "h-8 w-full rounded transition-all hover:brightness-110",
                color,
                labelColor === color && "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900"
              )}
            />
          ))}
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
