'use client';

import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { useUIStore, useBoardStore } from '@/store';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { SearchAndFilterBarProps } from './types';
import { hasAnyActiveFilters } from './utils/filterUtils';
import { useClickOutside } from './hooks/useClickOutside';
import { SearchInput } from './components/SearchInput';
import { FilterButton } from './components/FilterButton';
import { FilterPanel } from './components/FilterPanel';

export function SearchAndFilterBar({ boardId, className, compact = false }: SearchAndFilterBarProps) {
  const {
    searchTerm,
    setSearchTerm,
    selectedLabels,
    setSelectedLabels,
    selectedMembers,
    setSelectedMembers,
    showOverdue,
    setShowOverdue,
    showCompleted,
    setShowCompleted,
    priorityThreshold,
    setPriorityThreshold,
    dueDateFilter,
    setDueDateFilter,
    clearFilters
  } = useUIStore();

  const { boards } = useBoardStore();
  const board = boards.find(b => b.id === boardId);

  const [showFilters, setShowFilters] = useState(false);
  const dropdownRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  // Move hooks before conditional return
  useClickOutside(dropdownRefs, () => setShowFilters(false));

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

  const hasActiveFilters = hasAnyActiveFilters(filters);

  const handleClearAllFilters = () => {
    clearFilters();
  };

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "flex items-center gap-3 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-2 transition-all duration-300",
        compact ? "shadow-lg" : "shadow-xl border-slate-700/50 bg-slate-900/80"
      )}>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          compact={compact}
        />

        <div className="flex items-center gap-1.5 px-0.5">
          <FilterButton
            showFilters={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
            hasActiveFilters={hasActiveFilters}
            compact={compact}
            filters={filters}
          />

          {hasActiveFilters && (
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
        <FilterPanel
          ref={dropdownRefs[0]}
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted as (value: string) => void}
          priorityThreshold={priorityThreshold}
          setPriorityThreshold={setPriorityThreshold}
          dueDateFilter={dueDateFilter}
          setDueDateFilter={setDueDateFilter as (value: string) => void}
          selectedLabels={selectedLabels}
          setSelectedLabels={setSelectedLabels}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
          board={board}
        />
      )}
    </div>
  );
}
