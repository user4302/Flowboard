'use client';

import { useState } from 'react';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSharingStore } from '@/store/sharingStore';

interface JoinBoardModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
  /** Optional invitation ID from URL parameters */
  inviteId?: string;
}

/**
 * Modal component for users to join a shared board using an invitation.
 * Collects user information and handles the board joining process.
 * 
 * @param props - The component props
 * @returns The join board modal component or null if not open
 */
export function JoinBoardModal({ isOpen, onClose, inviteId }: JoinBoardModalProps) {
  // Store hook for sharing functionality
  const { joinBoard } = useSharingStore();

  // Form state for user registration
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Early return if modal is closed
  if (!isOpen) return null;

  /**
   * Handles the board joining process
   * Validates form inputs and calls the joinBoard function
   */
  const handleJoin = async () => {
    if (!inviteId || !email || !username || !password) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await joinBoard(inviteId, email, username, password);
      onClose();
    } catch (error) {
      console.error('Failed to join board:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles keyboard events for form submission
   * Allows Enter key to submit the form
   * @param e - Keyboard event
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin();
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
        <div className="mb-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="your@email.com"
                className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Choose a username"
                className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Create a password"
                className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Important information alert */}
        <div className="mb-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium">Important:</p>
              <ul className="mt-1 list-disc list-inside space-y-1 text-xs">
                <li>Board owner must approve your request</li>
                <li>Save your credentials for this board</li>
                <li>You'll need these credentials to access this board</li>
              </ul>
            </div>
          </div>
        </div>

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
            onClick={handleJoin}
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
