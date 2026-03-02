/**
 * Utilities for boardShare components
 */

import { JoinFormData } from './types';

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

/**
 * Formats a date string for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

/**
 * Formats a date string with relative time
 * @param dateString - ISO date string
 * @returns Formatted date string with relative time
 */
export function formatDateWithRelative(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return date < now ? 'Yesterday' : 'Tomorrow';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}
