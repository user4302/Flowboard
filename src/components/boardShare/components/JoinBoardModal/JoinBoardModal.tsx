/**
 * Modal component for users to join a shared board using an invitation.
 * Collects user information and handles the board joining process.
 */

'use client';

import { Button } from '@/components/ui';
import { JoinBoardModalProps } from '@/lib/types';
import { useJoinBoardModal } from '../../hooks';
import { JoinForm } from './JoinForm';
import { JoinAlert } from './JoinAlert';

export function JoinBoardModal({ isOpen, onClose, inviteId }: JoinBoardModalProps) {
  const { formData, isLoading, updateFormData, handleJoin, handleKeyPress } = useJoinBoardModal(inviteId);

  // Early return if modal is closed
  if (!isOpen) return null;

  /**
   * Handles the board joining process with proper callback handling
   */
  const handleJoinWithCallback = async () => {
    const result = await handleJoin();
    if (result?.success) {
      onClose();
    }
  };

  return (
    // Modal overlay with backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal content container */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
        {/* Modal header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Join Board
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Enter your details to join this board
          </p>
        </div>

        {/* Form inputs for user registration */}
        <JoinForm
          formData={formData}
          isLoading={isLoading}
          onUpdateField={updateFormData}
          onKeyPress={handleKeyPress}
        />

        {/* Important information alert */}
        <JoinAlert />

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleJoinWithCallback}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Joining...' : 'Join Board'}
          </Button>
        </div>
      </div>
    </div>
  );
}
