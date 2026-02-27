/**
 * Tab navigation component for MemberManagement
 */

import { ActiveTab } from '@/lib/types';

interface MemberTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingCount: number;
  membersCount: number;
}

export function MemberTabs({
  activeTab,
  onTabChange,
  pendingCount,
  membersCount
}: MemberTabsProps) {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-700">
      <button
        onClick={() => onTabChange('pending')}
        className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'pending'
            ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
      >
        Pending Requests ({pendingCount})
      </button>
      <button
        onClick={() => onTabChange('members')}
        className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'members'
            ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
      >
        Members ({membersCount})
      </button>
    </div>
  );
}
