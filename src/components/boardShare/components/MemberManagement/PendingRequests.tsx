/**
 * Pending requests list component for MemberManagement
 */

import { Users, Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui';
import { JoinRequest } from '@/lib/invitation-utils';
import { formatDate } from '../../utils';

interface PendingRequestsProps {
  requests: JoinRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function PendingRequests({
  requests,
  onApprove,
  onReject
}: PendingRequestsProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          No pending join requests
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request: JoinRequest) => (
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
                  {formatDate(request.createdAt)}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject(request.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => onApprove(request.id)}
                className="text-green-600 hover:text-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
