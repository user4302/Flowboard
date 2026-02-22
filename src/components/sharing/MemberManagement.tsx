'use client';

import { useState } from 'react';
import { Users, Check, X, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSharingStore } from '@/store/sharingStore';
import { JoinRequest } from '@/lib/invitation-utils';

interface MemberManagementProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
}

/**
 * Modal component for board owners to manage members and join requests.
 * Allows approving or rejecting pending join requests and viewing current members.
 * Only accessible to board owners.
 * 
 * @param props - The component props
 * @returns The member management modal component or null if not open/authorized
 */
export function MemberManagement({ isOpen, onClose }: MemberManagementProps) {
  const {
    joinRequests,
    approveJoinRequest,
    rejectJoinRequest,
    userId,
    isOwner
  } = useSharingStore();

  const [activeTab, setActiveTab] = useState<'pending' | 'members'>('pending');

  if (!isOpen || !isOwner) return null;

  const pendingRequests = joinRequests.filter(req => req.status === 'pending');
  const approvedRequests = joinRequests.filter(req => req.status === 'approved');

  const handleApprove = (requestId: string) => {
    approveJoinRequest(requestId);
  };

  const handleReject = (requestId: string) => {
    rejectJoinRequest(requestId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl max-h-[80vh] rounded-lg bg-white shadow-xl dark:bg-slate-800">
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

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'pending'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
          >
            Pending Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'members'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
          >
            Members ({approvedRequests.length + 1}) {/* +1 for owner */}
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    No pending join requests
                  </p>
                </div>
              ) : (
                pendingRequests.map((request: JoinRequest) => (
                  <div
                    key={request.id}
                    className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {request.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {request.username}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {request.email}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="h-3 w-3" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(request.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-4">
              {/* Owner */}
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      You (Owner)
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Board owner and administrator
                    </p>
                  </div>
                </div>
              </div>

              {/* Approved members */}
              {approvedRequests.map((request: JoinRequest) => (
                <div
                  key={request.id}
                  className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-slate-600">
                        {request.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {request.username}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {request.email}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Check className="h-3 w-3 text-green-600" />
                        Joined {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {approvedRequests.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    No other members yet
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
