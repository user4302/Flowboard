/**
 * Custom hook for JoinBoardModal business logic
 */

import { useState } from 'react';
import { useSharingStore } from '@/store/sharingStore';
import { JoinFormData } from '../types';
import { validateJoinForm } from '../utils';

export function useJoinBoardModal(inviteId?: string) {
  // Store hook for sharing functionality
  const { joinBoard } = useSharingStore();

  // Form state for user registration
  const [formData, setFormData] = useState<JoinFormData>({
    email: '',
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Updates form data
   * @param field - Field to update
   * @param value - New value
   */
  const updateFormData = (field: keyof JoinFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Handles the board joining process
   * Validates form inputs and calls the joinBoard function
   */
  const handleJoin = async () => {
    if (!inviteId) return;

    const validation = validateJoinForm(formData);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setIsLoading(true);
    try {
      await joinBoard(inviteId, formData.email, formData.username, formData.password);
      return { success: true };
    } catch (error) {
      console.error('Failed to join board:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles keyboard events for form submission
   * @param e - Keyboard event
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  };

  return {
    formData,
    isLoading,
    updateFormData,
    handleJoin,
    handleKeyPress,
  };
}
