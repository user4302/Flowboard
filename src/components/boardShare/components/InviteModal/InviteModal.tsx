/**
 * Modal component for creating and managing board invitations.
 * Allows board owners to generate shareable invitation links with configurable expiration times.
 */

'use client';

import { InviteModalProps } from '../../types';
import { useInviteModal } from '../../hooks';
import { InviteForm } from './InviteForm';

export function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const { currentBoard, expiresIn, setExpiresIn, handleCreateInvite } = useInviteModal();

  // Early return if modal is closed or no board is available
  if (!isOpen || !currentBoard) return null;

  return (
    // Modal overlay with backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <InviteForm
        expiresIn={expiresIn}
        onExpiresInChange={setExpiresIn}
        onCreateInvite={handleCreateInvite}
        onCancel={onClose}
        boardName={currentBoard.name}
      />
    </div>
  );
}
