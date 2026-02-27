import { Filter } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { hasActiveFilters } from '@/lib/filterUtils';

interface SearchAndFilterButtonProps {
  showFilters: boolean;
  onToggle: () => void;
  hasActiveFilters: boolean;
  compact?: boolean;
  filters: {
    searchTerm?: string;
    selectedLabels: string[];
    selectedMembers: string[];
    showOverdue: boolean;
    showCompleted: string;
    priorityThreshold: number | null;
    dueDateFilter: string;
  };
}

export function SearchAndFilterButton({
  showFilters,
  onToggle,
  hasActiveFilters,
  compact = false,
  filters
}: SearchAndFilterButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={cn(
        "h-9 px-3 gap-2 rounded-xl transition-all duration-200",
        showFilters
          ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
      )}
    >
      <Filter className={cn("h-4 w-4", showFilters && "animate-pulse")} />
      {!compact && <span className="text-sm font-medium">Filters</span>}
      {hasActiveFilters && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-lg shadow-blue-900/40">
          •
        </span>
      )}
    </Button>
  );
}
