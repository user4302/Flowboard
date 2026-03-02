import { Calendar, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIMELINE_OPTIONS } from '../constants';

interface SearchAndFilterTimelineProps {
  dueDateFilter: string;
  onChange: (value: string) => void;
}

const iconMap = {
  Clock,
  X,
  Calendar
};

export function SearchAndFilterTimeline({ dueDateFilter, onChange }: SearchAndFilterTimelineProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4 text-slate-400">
        <Calendar className="h-4 w-4" />
        <h3 className="text-xs font-bold uppercase tracking-wider">Timeline</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {TIMELINE_OPTIONS.map((option) => {
          const Icon = iconMap[option.icon as keyof typeof iconMap];
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl border transition-all duration-200",
                dueDateFilter === option.value
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-100 hover:border-slate-600"
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5 opacity-60" />}
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
