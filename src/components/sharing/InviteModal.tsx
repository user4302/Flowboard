'use client';

import { useState } from 'react';
import { Share2, Copy, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSharingStore } from '@/store/sharingStore';
import { useBoardStore } from '@/store';

interface InviteModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
}

/**
 * Modal component for creating and managing board invitations.
 * Allows board owners to generate shareable invitation links with configurable expiration times.
 * 
 * @param props - The component props
 * @returns The invite modal component or null if not open
 */
export function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const { getCurrentBoard } = useBoardStore();
  const { createInvitation } = useSharingStore();
  const [expiresIn, setExpiresIn] = useState(168); // 1 week in hours

  const currentBoard = getCurrentBoard();

  if (!isOpen || !currentBoard) return null;

  const handleCreateInvite = async () => {
    await createInvitation(currentBoard.id, currentBoard.name);
  };

  const expiryOptions = [
    { value: 24, label: '24 hours' },
    { value: 168, label: '1 week' },
    { value: 720, label: '1 month' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Invite to Board
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Create an invitation link for "{currentBoard.name}"
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Link expires in
          </label>
          <select
            value={expiresIn}
            onChange={(e) => setExpiresIn(Number(e.target.value))}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            {expiryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

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

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateInvite}
            className="flex-1"
          >
            <Copy className="mr-2 h-4 w-4" />
            Create & Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
}
