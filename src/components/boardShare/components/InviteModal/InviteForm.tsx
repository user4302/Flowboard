/**
 * Invitation form component for InviteModal
 */

import { Users, Clock, Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui';
import { INVITATION_EXPIRY_OPTIONS } from '@/lib/constants';

interface InviteFormProps {
  expiresIn: number;
  onExpiresInChange: (value: number) => void;
  onCreateInvite: () => void;
  onCancel: () => void;
  boardName: string;
}

export function InviteForm({
  expiresIn,
  onExpiresInChange,
  onCreateInvite,
  onCancel,
  boardName
}: InviteFormProps) {
  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Invite to Board
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Create an invitation link for "{boardName}"
        </p>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Link expires in
        </label>
        <select
          value={expiresIn}
          onChange={(e) => onExpiresInChange(Number(e.target.value))}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
        >
          {INVITATION_EXPIRY_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Information section about invitation features */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Users className="h-4 w-4" />
          <span>Only users you approve can join</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Clock className="h-4 w-4" />
          <span>Link expires after selected time</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Share2 className="h-4 w-4" />
          <span>Share the link with team members</span>
        </div>
      </div>

      {/* Action buttons for cancel and create */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={onCreateInvite}
          className="flex-1"
        >
          <Copy className="mr-2 h-4 w-4" />
          Create & Copy Link
        </Button>
      </div>
    </div>
  );
}
