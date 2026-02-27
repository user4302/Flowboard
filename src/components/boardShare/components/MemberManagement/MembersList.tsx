/**
 * Members list component for MemberManagement
 */

import { Users, Check, Shield } from 'lucide-react';
import { JoinRequest } from '@/lib/invitation-utils';
import { formatDate } from '../../utils';

interface MembersListProps {
  requests: JoinRequest[];
  showOwner?: boolean;
}

export function MembersList({ requests, showOwner = true }: MembersListProps) {
  return (
    <div className="space-y-4">
      {/* Board owner display */}
      {showOwner && (
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
      )}

      {/* List of approved members */}
      {requests.map((request: JoinRequest) => (
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
                Joined {formatDate(request.createdAt)}
              </div>
            </div>
          </div>
        </div>
      ))}

      {requests.length === 0 && !showOwner && (
        <div className="text-center py-8">
          <Users className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            No other members yet
          </p>
        </div>
      )}
    </div>
  );
}
