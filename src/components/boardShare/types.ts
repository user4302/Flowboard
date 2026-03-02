/**
 * BoardShare component types
 */

/**
 * Props for the InviteModal component
 */
export interface InviteModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
}

/**
 * Props for the JoinBoardModal component
 */
export interface JoinBoardModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
  /** Optional invitation ID from URL parameters */
  inviteId?: string;
}

/**
 * Props for the MemberManagement component
 */
export interface MemberManagementProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
}

/**
 * Form data for joining a board
 */
export interface JoinFormData {
  /** User's email address */
  email: string;
  /** User's chosen username */
  username: string;
  /** User's password */
  password: string;
}

/**
 * Active tab type for member management
 */
export type ActiveTab = 'pending' | 'members';

/**
 * Expiration time option for invitations
 */
export interface ExpiryOption {
  /** Expiration time value in hours */
  value: number;
  /** Display label for the option */
  label: string;
}
