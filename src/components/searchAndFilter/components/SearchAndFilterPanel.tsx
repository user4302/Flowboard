import { cn } from '@/lib/utils';
import { forwardRef, useState, useEffect, useCallback } from 'react';
import { SearchAndFilterStatus } from './SearchAndFilterStatus';
import { SearchAndFilterPriority } from './SearchAndFilterPriority';
import { SearchAndFilterTimeline } from './SearchAndFilterTimeline';
import { SearchAndFilterDropdown } from './SearchAndFilterDropdown';
import { Tag, Users } from 'lucide-react';

interface SearchAndFilterPanelProps {
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
  onPortalDropdownRef?: (refs: React.RefObject<HTMLDivElement | null>[]) => void;
}

export const SearchAndFilterPanel = forwardRef<HTMLDivElement, SearchAndFilterPanelProps>(({
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
  board,
  onPortalDropdownRef
}, ref) => {
  const [portalDropdownRefs, setPortalDropdownRefs] = useState<React.RefObject<HTMLDivElement | null>[]>([]);

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

  const registerPortalRef = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    setPortalDropdownRefs((prev: React.RefObject<HTMLDivElement | null>[]) => {
      // Check if ref is already in the array to avoid unnecessary updates
      if (prev.some(r => r === ref)) {
        return prev;
      }
      return [...prev, ref];
    });
  }, []);

  // Pass portal refs to parent
  useEffect(() => {
    if (onPortalDropdownRef) {
      onPortalDropdownRef(portalDropdownRefs);
    }
  }, [portalDropdownRefs, onPortalDropdownRef]);

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-full right-0 mt-3 w-[360px] sm:w-[500px] z-50 animate-in fade-in zoom-in duration-200 origin-top-right",
        "bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]",
        "p-6 space-y-8 max-h-[85vh] overflow-y-auto"
      )}
    >
      <SearchAndFilterStatus showCompleted={showCompleted} onChange={setShowCompleted} />

      <SearchAndFilterPriority priorityThreshold={priorityThreshold} onChange={setPriorityThreshold} />

      <SearchAndFilterTimeline dueDateFilter={dueDateFilter} onChange={setDueDateFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SearchAndFilterDropdown
          label="Labels"
          icon={Tag}
          selectedItems={selectedLabels}
          items={board.labels}
          onToggle={toggleLabel}
          itemType="label"
          onPortalRef={registerPortalRef}
        />

        <SearchAndFilterDropdown
          label="Members"
          icon={Users}
          selectedItems={selectedMembers}
          items={board.members}
          onToggle={toggleMember}
          itemType="member"
          onPortalRef={registerPortalRef}
        />
      </div>
    </div>
  );
});

SearchAndFilterPanel.displayName = 'SearchAndFilterPanel';
