'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Search, Filter, X, Check, Calendar, Users, Tag, Clock, Star, ChevronDown, Plus, Minus } from 'lucide-react';
import { useUIStore, useBoardStore } from '@/store';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * Portal helper component for rendering dropdowns outside parent overflow
 */
function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

interface SearchAndFilterBarProps {
  boardId: string;
  className?: string;
  compact?: boolean;
}

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

  // Local state for UI
  const [showFilters, setShowFilters] = useState(false);
  const [showLabelsDropdown, setShowLabelsDropdown] = useState(false);
  const [showMembersDropdown, setShowMembersDropdown] = useState(false);

  // Track dropdown trigger positions for Portal
  const [labelsTriggerRect, setLabelsTriggerRect] = useState<DOMRect | null>(null);
  const [membersTriggerRect, setMembersTriggerRect] = useState<DOMRect | null>(null);

  const labelsDropdownRef = useRef<HTMLDivElement>(null);
  const membersDropdownRef = useRef<HTMLDivElement>(null);
  const labelsTriggerRef = useRef<HTMLButtonElement>(null);
  const membersTriggerRef = useRef<HTMLButtonElement>(null);

  // Use ResizeObserver or Scroll listeners would be better, but simple update on open is okay for now
  useEffect(() => {
    if (showLabelsDropdown && labelsTriggerRef.current) {
      setLabelsTriggerRect(labelsTriggerRef.current.getBoundingClientRect());
    }
  }, [showLabelsDropdown]);

  useEffect(() => {
    if (showMembersDropdown && membersTriggerRef.current) {
      setMembersTriggerRect(membersTriggerRef.current.getBoundingClientRect());
    }
  }, [showMembersDropdown]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (labelsDropdownRef.current && !labelsDropdownRef.current.contains(event.target as Node)) {
        setShowLabelsDropdown(false);
      }
      if (membersDropdownRef.current && !membersDropdownRef.current.contains(event.target as Node)) {
        setShowMembersDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters = !!(
    searchTerm ||
    selectedLabels.length > 0 ||
    selectedMembers.length > 0 ||
    showOverdue ||
    showCompleted !== 'all' ||
    priorityThreshold !== null ||
    dueDateFilter !== 'all'
  );

  const handleClearAllFilters = () => {
    clearFilters();
  };

  const toggleLabel = (labelId: string) => {
    if (selectedLabels.includes(labelId)) {
      setSelectedLabels(selectedLabels.filter(id => id !== labelId));
    } else {
      setSelectedLabels([...selectedLabels, labelId]);
    }
  };

  const toggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  if (!board) return null;

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "flex items-center gap-3 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-2 transition-all duration-300",
        compact ? "shadow-lg" : "shadow-xl border-slate-700/50 bg-slate-900/80"
      )}>
        {/* Search bar */}
        <div className={cn("relative flex-1 group", compact && "max-w-[200px] lg:max-w-xs")}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <Input
            placeholder={compact ? "Search cards..." : "Search cards by title, description, labels..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-10 h-10 bg-slate-800/50 border-transparent text-slate-200 placeholder-slate-500 rounded-xl focus:bg-slate-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200",
              compact && "h-9 text-sm"
            )}
          />
        </div>

        <div className="flex items-center gap-1.5 px-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
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
                {[
                  searchTerm ? 1 : 0,
                  selectedLabels.length > 0 ? 1 : 0,
                  selectedMembers.length > 0 ? 1 : 0,
                  showOverdue ? 1 : 0,
                  showCompleted !== 'all' ? 1 : 0,
                  priorityThreshold !== null ? 1 : 0,
                  dueDateFilter !== 'all' ? 1 : 0
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </Button>

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

      {/* Floating Filter Panel */}
      {showFilters && (
        <div
          className={cn(
            "absolute top-full right-0 mt-3 w-[360px] sm:w-[500px] z-50 animate-in fade-in zoom-in duration-200 origin-top-right",
            "bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]",
            "p-6 space-y-8 max-h-[85vh] overflow-y-auto"
          )}
        >
          {/* Section: Status */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Check className="h-4 w-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Status</h3>
              </div>
            </div>
            <div className="inline-flex p-1 bg-slate-800/50 rounded-2xl gap-1">
              {[
                { value: 'all', label: 'All' },
                { value: 'incomplete', label: 'Incomplete' },
                { value: 'completed', label: 'Completed' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setShowCompleted(option.value as any)}
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

          {/* Section: Priority Threshold (1-100) */}
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
                    onClick={() => setPriorityThreshold(null)}
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
                  onClick={() => setPriorityThreshold(Math.max(1, (priorityThreshold || 1) - 1))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <div className="relative group">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={priorityThreshold || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) setPriorityThreshold(Math.min(100, Math.max(1, val)));
                      else if (e.target.value === '') setPriorityThreshold(null);
                    }}
                    className="w-16 h-8 text-center bg-slate-800 border-slate-700 rounded-lg text-sm font-bold text-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Min"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
                  onClick={() => setPriorityThreshold(Math.min(100, (priorityThreshold || 0) + 1))}
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
                  max="100"
                  value={priorityThreshold || 0}
                  onChange={(e) => setPriorityThreshold(parseInt(e.target.value) || null)}
                  className="absolute top-1/2 -translate-y-1/2 w-full h-8 opacity-0 cursor-pointer"
                />
                {/* Thumb Visual */}
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

          {/* Section: Due Date */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <Calendar className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Timeline</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'Any time', icon: Clock },
                { value: 'overdue', label: 'Overdue', icon: X },
                { value: 'today', label: 'Today', icon: Calendar },
                { value: 'week', label: 'This Week', icon: Calendar },
                { value: 'month', label: 'This Month', icon: Calendar }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDueDateFilter(option.value as any)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl border transition-all duration-200",
                    dueDateFilter === option.value
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40"
                      : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-100 hover:border-slate-600"
                  )}
                >
                  <option.icon className="h-3.5 w-3.5 opacity-60" />
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {/* Section: Dropdowns (Labels & Members) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Labels Dropdown */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Tag className="h-4 w-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Labels</h3>
              </div>
              <button
                ref={labelsTriggerRef}
                onClick={() => setShowLabelsDropdown(!showLabelsDropdown)}
                className={cn(
                  "w-full flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-medium transition-all border",
                  selectedLabels.length > 0
                    ? "bg-blue-600/10 border-blue-500/30 text-blue-400"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600"
                )}
              >
                <span>{selectedLabels.length ? `${selectedLabels.length} Selected` : 'Select...'}</span>
                <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", showLabelsDropdown && "rotate-180")} />
              </button>

              {showLabelsDropdown && labelsTriggerRect && (
                <Portal>
                  <div
                    ref={labelsDropdownRef}
                    style={{
                      position: 'fixed',
                      top: `${labelsTriggerRect.bottom + 8}px`,
                      left: `${labelsTriggerRect.left}px`,
                      width: `${labelsTriggerRect.width}px`,
                      minWidth: '220px',
                      zIndex: 9999,
                    }}
                    className="bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-150"
                  >
                    {board.labels.map((label) => (
                      <button
                        key={label.id}
                        onClick={() => toggleLabel(label.id)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left group",
                          selectedLabels.includes(label.id) ? "bg-blue-600/20 text-blue-400" : "hover:bg-slate-700 text-slate-400 hover:text-slate-100"
                        )}
                      >
                        <div className={cn("h-3 w-3 rounded-full shrink-0 ring-2 ring-slate-900 group-hover:ring-slate-700 transition-all", label.color)} />
                        <span className="truncate flex-1">{label.text}</span>
                        {selectedLabels.includes(label.id) && <Check className="h-3.5 w-3.5" />}
                      </button>
                    ))}
                  </div>
                </Portal>
              )}
            </div>

            {/* Members Dropdown */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Users className="h-4 w-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Members</h3>
              </div>
              <button
                ref={membersTriggerRef}
                onClick={() => setShowMembersDropdown(!showMembersDropdown)}
                className={cn(
                  "w-full flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-medium transition-all border",
                  selectedMembers.length > 0
                    ? "bg-blue-600/10 border-blue-500/30 text-blue-400"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600"
                )}
              >
                <span>{selectedMembers.length ? `${selectedMembers.length} Selected` : 'Select...'}</span>
                <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", showMembersDropdown && "rotate-180")} />
              </button>

              {showMembersDropdown && membersTriggerRect && (
                <Portal>
                  <div
                    ref={membersDropdownRef}
                    style={{
                      position: 'fixed',
                      top: `${membersTriggerRect.bottom + 8}px`,
                      left: `${membersTriggerRect.left}px`,
                      width: `${membersTriggerRect.width}px`,
                      minWidth: '220px',
                      zIndex: 9999,
                    }}
                    className="bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-150"
                  >
                    {board.members.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => toggleMember(member.id)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left group",
                          selectedMembers.includes(member.id) ? "bg-blue-600/20 text-blue-400" : "hover:bg-slate-700 text-slate-400 hover:text-slate-100"
                        )}
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-white ring-2 ring-slate-900">
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <span className="truncate flex-1">{member.name}</span>
                        {selectedMembers.includes(member.id) && <Check className="h-3.5 w-3.5" />}
                      </button>
                    ))}
                  </div>
                </Portal>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
