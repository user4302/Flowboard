import { Search } from 'lucide-react';
import { Input } from '@/components/ui';
import { cn } from '@/lib/utils';

interface SearchAndFilterInputProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export function SearchAndFilterInput({ value, onChange, compact = false }: SearchAndFilterInputProps) {
  return (
    <div className={cn("relative flex-1 group", compact && "max-w-[200px] lg:max-w-xs")}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
      <Input
        placeholder={compact ? "Search cards..." : "Search cards by title, description, labels..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "pl-10 h-10 bg-slate-800/50 border-transparent text-slate-200 placeholder-slate-500 rounded-xl focus:bg-slate-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200",
          compact && "h-9 text-sm"
        )}
      />
    </div>
  );
}
