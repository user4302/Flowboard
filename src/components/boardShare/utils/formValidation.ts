/**
 * Form validation utilities for boardShare components
 */

import { JoinFormData } from '@/lib/types';

/**
 * Validates join board form data
 * @param data - Form data to validate
 * @returns Validation result with error message if invalid
 */
export function validateJoinForm(data: JoinFormData): { isValid: boolean; error?: string } {
  const { email, username, password } = data;

  if (!email || !username || !password) {
    return { isValid: false, error: 'Please fill in all fields' };
  }

  if (!email.includes('@')) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (username.length < 2) {
    return { isValid: false, error: 'Username must be at least 2 characters long' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }

  return { isValid: true };
}
