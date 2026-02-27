/**
 * Sharing components module
 * Exports all sharing-related components for board collaboration features
 */

// Main modal components
export { InviteModal } from './components/InviteModal/InviteModal';
export { JoinBoardModal } from './components/JoinBoardModal/JoinBoardModal';
export { MemberManagement } from './components/MemberManagement/MemberManagement';

// Sub-components (for advanced usage)
export { InviteForm, InviteInfo } from './components';
export { JoinForm, JoinAlert } from './components';
export { MemberTabs, PendingRequests, MembersList } from './components';

// Hooks for custom implementations
export { useInviteModal, useJoinBoardModal, useMemberManagement } from './hooks';

// Types and constants
export * from '@/lib/types';
export * from '@/lib/constants';
export * from './utils';
