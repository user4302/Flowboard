import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_OPTIONS } from '../constants';

interface StatusFilterProps {
  showCompleted: string;
  onChange: (value: string) => void;
}

export function StatusFilter({ showCompleted, onChange }: StatusFilterProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Check className="h-4 w-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider">Status</h3>
        </div>
      </div>
      <div className="inline-flex p-1 bg-slate-800/50 rounded-2xl gap-1">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
              showCompleted === option.value
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-700/50"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
