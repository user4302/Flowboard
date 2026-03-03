import { Search, Plus, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input, Button } from '@/components/ui';
import { Label } from '@/lib/types';

interface TaskModalLabelListProps {
  labels: Label[];
  selectedLabelIds: string[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onToggleLabel: (labelId: string) => void;
  onEditLabel: (label: Label) => void;
  onCreateLabel: () => void;
  onClose: () => void;
}

export function TaskModalLabelList({
  labels,
  selectedLabelIds,
  searchTerm,
  onSearchChange,
  onToggleLabel,
  onEditLabel,
  onCreateLabel,
  onClose
}: TaskModalLabelListProps) {
  return (
    <div
      className="flex flex-col h-full space-y-4 overflow-hidden"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="relative flex-shrink-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search labels..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-1 min-h-0 custom-scrollbar space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 sticky top-0 bg-white dark:bg-slate-900 py-1 z-10">Labels</p>
        {labels.map((label) => (
          <div key={label.id} className="group flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLabel(label.id);
              }}
              className={cn(
                "flex h-9 flex-1 items-center justify-between rounded px-3 transition-all",
                label.color,
                "hover:brightness-90 active:scale-95"
              )}
            >
              <span className="text-sm font-medium text-white truncate max-w-[180px]">
                {label.text}
              </span>
              {selectedLabelIds.includes(label.id) && (
                <Check className="h-4 w-4 text-white" />
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditLabel(label);
              }}
              className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded dark:hover:bg-slate-800"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
        <Button
          type="button"
          variant="secondary"
          className="w-full h-9 gap-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onCreateLabel();
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Create a new label
        </Button>
      </div>
    </div>
  );
}
