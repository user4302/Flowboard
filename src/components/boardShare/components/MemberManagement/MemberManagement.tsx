/**
 * Modal component for board owners to manage members and join requests.
 * Allows approving or rejecting pending join requests and viewing current members.
 * Only accessible to board owners.
 */

'use client';

import { Button } from '@/components/ui';
import { MemberManagementProps } from '../../types';
import { useMemberManagement } from '../../hooks';
import { MemberTabs } from './MemberTabs';
import { PendingRequests } from './PendingRequests';
import { MembersList } from './MembersList';

export function MemberManagement({ isOpen, onClose }: MemberManagementProps) {
  const {
    pendingRequests,
    approvedRequests,
    isOwner,
    activeTab,
    setActiveTab,
    handleApprove,
    handleReject,
  } = useMemberManagement();

  // Early return if modal is closed or user is not owner
  if (!isOpen || !isOwner) return null;

  return (
    // Modal overlay with backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal content container */}
      <div className="w-full max-w-2xl max-h-[80vh] rounded-lg bg-white shadow-xl dark:bg-slate-800">
        {/* Modal header with title and close button */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Member Management
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage board members and join requests
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            ×
          </Button>
        </div>

        {/* Tab navigation */}
        <MemberTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingCount={pendingRequests.length}
          membersCount={approvedRequests.length + 1} // +1 for owner
        />

        {/* Content area with scrollable content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {activeTab === 'pending' && (
            <PendingRequests
              requests={pendingRequests}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {activeTab === 'members' && (
            <MembersList
              requests={approvedRequests}
              showOwner={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
