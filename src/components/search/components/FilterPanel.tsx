import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { StatusFilter } from './StatusFilter';
import { PriorityFilter } from './PriorityFilter';
import { TimelineFilter } from './TimelineFilter';
import { DropdownSelector } from './DropdownSelector';
import { Tag, Users } from 'lucide-react';

interface FilterPanelProps {
  showCompleted: string;
  setShowCompleted: (value: string) => void;
  priorityThreshold: number | null;
  setPriorityThreshold: (value: number | null) => void;
  dueDateFilter: string;
  setDueDateFilter: (value: string) => void;
  selectedLabels: string[];
  setSelectedLabels: (labels: string[]) => void;
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
  board: {
    labels: Array<{ id: string; text: string; color: string }>;
    members: Array<{ id: string; name: string }>;
  };
}

export const FilterPanel = forwardRef<HTMLDivElement, FilterPanelProps>(({
  showCompleted,
  setShowCompleted,
  priorityThreshold,
  setPriorityThreshold,
  dueDateFilter,
  setDueDateFilter,
  selectedLabels,
  setSelectedLabels,
  selectedMembers,
  setSelectedMembers,
  board
}, ref) => {
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

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-full right-0 mt-3 w-[360px] sm:w-[500px] z-50 animate-in fade-in zoom-in duration-200 origin-top-right",
        "bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]",
        "p-6 space-y-8 max-h-[85vh] overflow-y-auto"
      )}
    >
      <StatusFilter showCompleted={showCompleted} onChange={setShowCompleted} />

      <PriorityFilter priorityThreshold={priorityThreshold} onChange={setPriorityThreshold} />

      <TimelineFilter dueDateFilter={dueDateFilter} onChange={setDueDateFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DropdownSelector
          label="Labels"
          icon={Tag}
          selectedItems={selectedLabels}
          items={board.labels}
          onToggle={toggleLabel}
          itemType="label"
        />

        <DropdownSelector
          label="Members"
          icon={Users}
          selectedItems={selectedMembers}
          items={board.members}
          onToggle={toggleMember}
          itemType="member"
        />
      </div>
    </div>
  );
});

FilterPanel.displayName = 'FilterPanel';
