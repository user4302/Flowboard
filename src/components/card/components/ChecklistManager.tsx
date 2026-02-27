import { Trash2, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/ui';
import { ChecklistManagerProps } from '../types/card.types';

export function ChecklistManager({
  cardId,
  boardId,
  checklist,
  onAddItem,
  onToggleItem,
  onDeleteItem
}: ChecklistManagerProps) {
  // Don't render if we don't have valid IDs
  if (!cardId || !boardId) {
    return null;
  }

  return (
    <div className="space-y-2">
      {checklist?.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.done}
            onChange={(e) => onToggleItem(item.id, e.target.checked)}
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
            onClick={() => onDeleteItem(item.id)}
            className="text-slate-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onAddItem('')}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add item
      </Button>
    </div>
  );
}
