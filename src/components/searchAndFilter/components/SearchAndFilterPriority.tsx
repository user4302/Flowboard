import { Star, Plus, Minus } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { PRIORITY_RANGE } from '../constants';

interface SearchAndFilterPriorityProps {
  priorityThreshold: number | null;
  onChange: (value: number | null) => void;
}

export function SearchAndFilterPriority({ priorityThreshold, onChange }: SearchAndFilterPriorityProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Star className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Priority Threshold</h3>
          </div>
          {priorityThreshold !== null && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(null)}
              className="h-6 px-2 text-[10px] font-bold uppercase tracking-tight bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 rounded-lg transition-all"
            >
              Show All
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
            onClick={() => onChange(Math.max(PRIORITY_RANGE.MIN, (priorityThreshold || PRIORITY_RANGE.MIN) - 1))}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <div className="relative group">
            <Input
              type="number"
              min={PRIORITY_RANGE.MIN}
              max={PRIORITY_RANGE.MAX}
              value={priorityThreshold || ''}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) onChange(Math.min(PRIORITY_RANGE.MAX, Math.max(PRIORITY_RANGE.MIN, val)));
                else if (e.target.value === '') onChange(null);
              }}
              className="w-16 h-8 text-center bg-slate-800 border-slate-700 rounded-lg text-sm font-bold text-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Min"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
            onClick={() => onChange(Math.min(PRIORITY_RANGE.MAX, (priorityThreshold || 0) + 1))}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="px-3 pb-2 space-y-4">
        <div className="relative h-1.5 w-full bg-slate-800 rounded-full group">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300"
            style={{ width: `${priorityThreshold || 0}%` }}
          />
          <input
            type="range"
            min="0"
            max={PRIORITY_RANGE.MAX}
            value={priorityThreshold || 0}
            onChange={(e) => onChange(parseInt(e.target.value) || null)}
            className="absolute top-1/2 -translate-y-1/2 w-full h-8 opacity-0 cursor-pointer"
          />
          <div
            className="absolute top-1/2 -ml-3 -translate-y-1/2 h-6 w-6 rounded-full bg-white shadow-xl shadow-black/50 border-[6px] border-slate-900 pointer-events-none transition-all duration-200 group-active:scale-95"
            style={{ left: `${priorityThreshold || 0}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          <span>Low (1)</span>
          <span>Critical (100)</span>
        </div>
      </div>
    </section>
  );
}
