/**
 * Custom hook for MemberManagement business logic
 */

import { useState } from 'react';
import { useSharingStore } from '@/store/sharingStore';
import { ActiveTab } from '@/lib/types';

export function useMemberManagement() {
  // Store hooks for sharing functionality and user data
  const {
    joinRequests,
    approveJoinRequest,
    rejectJoinRequest,
    userId,
    isOwner
  } = useSharingStore();

  // Local state for tab navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('pending');

  // Filter requests by status
  const pendingRequests = joinRequests.filter(req => req.status === 'pending');
  const approvedRequests = joinRequests.filter(req => req.status === 'approved');

  /**
   * Handles approval of join requests
   * @param requestId - ID of the request to approve
   */
  const handleApprove = (requestId: string) => {
    approveJoinRequest(requestId);
  };

  /**
   * Handles rejection of join requests
   * @param requestId - ID of the request to reject
   */
  const handleReject = (requestId: string) => {
    rejectJoinRequest(requestId);
  };

  return {
    // Data
    joinRequests,
    pendingRequests,
    approvedRequests,
    userId,
    isOwner,
    activeTab,

    // Actions
    setActiveTab,
    handleApprove,
    handleReject,
  };
}
