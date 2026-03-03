/**
 * BoardShare component constants
 */

/**
 * Invitation expiry time options
 */
export const INVITATION_EXPIRY_OPTIONS = [
  { value: 24, label: '24 hours' },
  { value: 168, label: '1 week' },
  { value: 720, label: '1 month' },
] as const;

/**
 * Default invitation expiry time in hours
 */
export const DEFAULT_INVITATION_EXPIRY_HOURS = 168; // 1 week

/**
 * User-facing messages for invitation operations
 */
export const INVITATION_MESSAGES = {
  createSuccess: 'Invitation link created and copied to clipboard!',
  joinSuccess: 'Successfully joined the board!',
  joinError: 'Failed to join board. Please try again.',
  validationError: 'Please fill in all fields',
} as const;
