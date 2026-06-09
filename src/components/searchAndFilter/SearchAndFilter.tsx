'use client';

import { useState, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { useUIStore, useBoardStore } from '@/store';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { SearchAndFilterProps } from './types';
import { hasActiveFilters } from '@/lib/filterUtils';
import { useSearchAndFilterClickOutside } from './hooks/useSearchAndFilterClickOutside';
import { SearchAndFilterInput } from './components/SearchAndFilterInput';
import { SearchAndFilterButton } from './components/SearchAndFilterButton';
import { SearchAndFilterPanel } from './components/SearchAndFilterPanel';

// Default filter state to avoid creating new objects
const DEFAULT_FILTER_STATE = {
  searchTerm: '',
  selectedLabels: [],
  selectedMembers: [],
  showOverdue: false,
  showCompleted: 'all' as const,
  priorityThreshold: null,
  dueDateFilter: 'all' as const
};

export function SearchAndFilter({ boardId, className, compact = false }: SearchAndFilterProps) {
  // Use individual selectors to avoid object creation
  const searchTerm = useUIStore((state) => state.filterState[boardId]?.searchTerm ?? DEFAULT_FILTER_STATE.searchTerm);
  const selectedLabels = useUIStore((state) => state.filterState[boardId]?.selectedLabels ?? DEFAULT_FILTER_STATE.selectedLabels);
  const selectedMembers = useUIStore((state) => state.filterState[boardId]?.selectedMembers ?? DEFAULT_FILTER_STATE.selectedMembers);
  const showOverdue = useUIStore((state) => state.filterState[boardId]?.showOverdue ?? DEFAULT_FILTER_STATE.showOverdue);
  const showCompleted = useUIStore((state) => state.filterState[boardId]?.showCompleted ?? DEFAULT_FILTER_STATE.showCompleted);
  const priorityThreshold = useUIStore((state) => state.filterState[boardId]?.priorityThreshold ?? DEFAULT_FILTER_STATE.priorityThreshold);
  const dueDateFilter = useUIStore((state) => state.filterState[boardId]?.dueDateFilter ?? DEFAULT_FILTER_STATE.dueDateFilter);
  const {
    setSearchTerm,
    setSelectedLabels,
    setSelectedMembers,
    setShowCompleted,
    setPriorityThreshold,
    setDueDateFilter,
    clearFilters
  } = useUIStore();

  const { boards } = useBoardStore();

  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef1 = useRef<HTMLDivElement>(null);
  const dropdownRef2 = useRef<HTMLDivElement>(null);
  const [portalDropdownRefs, setPortalDropdownRefs] = useState<React.RefObject<HTMLDivElement | null>[]>([]);

  const handlePortalDropdownRefs = useCallback((refs: React.RefObject<HTMLDivElement | null>[]) => {
    setPortalDropdownRefs(refs);
  }, []);

  const dropdownRefs = [dropdownRef1, dropdownRef2, ...portalDropdownRefs];

  const board = boards.find(b => b.id === boardId);

  // Move hooks before conditional return
  useSearchAndFilterClickOutside(dropdownRefs, () => setShowFilters(false));

  if (!board) return null;

  const filters = {
    searchTerm,
    selectedLabels,
    selectedMembers,
    showOverdue,
    showCompleted,
    priorityThreshold,
    dueDateFilter
  };

  const hasActiveFiltersValue = hasActiveFilters(filters);

  const handleClearAllFilters = () => {
    clearFilters(boardId);
  };

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "flex items-center gap-3 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-2 transition-all duration-300",
        compact ? "shadow-lg" : "shadow-xl border-slate-700/50 bg-slate-900/80"
      )}>
        <SearchAndFilterInput
          value={searchTerm}
          onChange={(term) => setSearchTerm(boardId, term)}
          compact={compact}
        />

        <div className="flex items-center gap-1.5 px-0.5">
          <SearchAndFilterButton
            showFilters={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
            hasActiveFilters={hasActiveFiltersValue}
            compact={compact}
            filters={filters}
          />

          {hasActiveFiltersValue && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearAllFilters}
              className="h-9 w-9 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Clear all filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className={cn(
          "fixed inset-0 z-50 flex items-end justify-center md:absolute md:inset-auto md:top-full md:mt-2 md:right-0",
          "md:w-96 md:rounded-2xl md:border md:border-slate-800 md:bg-slate-900/90 md:shadow-2xl"
        )}>
          {/* Mobile drawer backdrop */}
          <div className="fixed inset-0 bg-black/50 md:hidden" onClick={() => setShowFilters(false)} />
          
          <SearchAndFilterPanel
            ref={dropdownRef1}
            className="w-full max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white dark:bg-slate-900 md:rounded-2xl"
            showCompleted={showCompleted}
            setShowCompleted={(status) => setShowCompleted(boardId, status as 'all' | 'completed' | 'incomplete')}
            priorityThreshold={priorityThreshold}
            setPriorityThreshold={(threshold) => setPriorityThreshold(boardId, threshold)}
            dueDateFilter={dueDateFilter}
            setDueDateFilter={(filter) => setDueDateFilter(boardId, filter as 'all' | 'overdue' | 'today' | 'week' | 'month')}
            selectedLabels={selectedLabels}
            setSelectedLabels={(labels) => setSelectedLabels(boardId, labels)}
            selectedMembers={selectedMembers}
            setSelectedMembers={(members) => setSelectedMembers(boardId, members)}
            board={board}
            onPortalDropdownRef={handlePortalDropdownRefs}
          />
        </div>
      )}
    </div>
  );
}
