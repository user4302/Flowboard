import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Invitation, JoinRequest, PeerInfo } from '@/lib/invitation-utils';
import { p2pManager, PeerConnection, SyncMessage } from '@/lib/p2p-connection';

/**
 * Interface for the board sharing and collaboration state management.
 * Handles invitations, peer connections, and user authentication for shared boards.
 */
interface SharingState {
  // Invitation management
  invitations: Invitation[];
  joinRequests: JoinRequest[];

  // P2P connection state
  peers: PeerConnection[];
  isConnected: boolean;
  isConnecting: boolean;

  // User info
  userId: string;
  username: string;
  email: string;
  isOwner: boolean;

  // UI state
  showInviteModal: boolean;
  showJoinModal: boolean;
  showMemberManagement: boolean;

  // Actions
  createInvitation: (boardId: string, boardName: string) => Promise<void>;
  joinBoard: (inviteId: string, email: string, username: string, password: string) => Promise<void>;
  approveJoinRequest: (requestId: string) => void;
  rejectJoinRequest: (requestId: string) => void;
  connectToPeers: (boardId: string) => Promise<void>;
  disconnectFromPeers: () => void;
  sendBoardUpdate: (message: SyncMessage) => void;
  setUserInfo: (userId: string, username: string, email: string, isOwner: boolean) => void;
  setShowInviteModal: (show: boolean) => void;
  setShowJoinModal: (show: boolean) => void;
  setShowMemberManagement: (show: boolean) => void;
}

/**
 * Zustand store for managing board sharing and collaboration features.
 * Provides state management for invitations, peer connections, and user authentication.
 * Uses persistence to maintain user session and invitation data across page reloads.
 */
export const useSharingStore = create<SharingState>()(
  persist(
    (set, get) => ({
      // Initial state
      invitations: [],
      joinRequests: [],
      peers: [],
      isConnected: false,
      isConnecting: false,
      userId: '',
      username: '',
      email: '',
      isOwner: false,
      showInviteModal: false,
      showJoinModal: false,
      showMemberManagement: false,

      // Actions
      createInvitation: async (boardId: string, boardName: string) => {
        try {
          const { createInvite } = await import('@/lib/invitation-utils');
          const invitation = await createInvite(boardId, boardName, get().userId);

          set(state => ({
            invitations: [...state.invitations, invitation],
            showInviteModal: false,
          }));

          // Copy invite URL to clipboard
          if (invitation.inviteUrl) {
            await navigator.clipboard.writeText(invitation.inviteUrl);
            alert('Invitation link copied to clipboard!');
          }
        } catch (error) {
          console.error('Failed to create invitation:', error);
          alert('Failed to create invitation');
        }
      },

      joinBoard: async (inviteId: string, email: string, username: string, password: string) => {
        try {
          const { joinBoard } = await import('@/lib/invitation-utils');
          const result = await joinBoard(inviteId, email, username, password);

          if (result.success) {
            set(state => ({
              userId: result.userId || '',
              username,
              email,
              isOwner: false,
              showJoinModal: false,
            }));

            if (result.requiresApproval) {
              alert('Join request submitted. Waiting for owner approval.');
            } else {
              // Auto-connect to peers if approved
              await get().connectToPeers(inviteId);
            }
          } else {
            alert(result.message || 'Failed to join board');
          }
        } catch (error) {
          console.error('Failed to join board:', error);
          alert('Failed to join board');
        }
      },

      approveJoinRequest: (requestId: string) => {
        const { updateJoinRequestStatus } = require('@/lib/invitation-utils');
        updateJoinRequestStatus(requestId, 'approved');

        set(state => ({
          joinRequests: state.joinRequests.map(req =>
            req.id === requestId ? { ...req, status: 'approved' } : req
          ),
        }));

        // Notify approved user (in real implementation)
        alert('Join request approved!');
      },

      rejectJoinRequest: (requestId: string) => {
        const { updateJoinRequestStatus } = require('@/lib/invitation-utils');
        updateJoinRequestStatus(requestId, 'rejected');

        set(state => ({
          joinRequests: state.joinRequests.map(req =>
            req.id === requestId ? { ...req, status: 'rejected' } : req
          ),
        }));

        alert('Join request rejected');
      },

      connectToPeers: async (boardId: string) => {
        set({ isConnecting: true });

        try {
          const { discoverPeers } = await import('@/lib/invitation-utils');
          const localPeerId = p2pManager.getLocalPeerId();

          // Register with peer discovery
          const { peers } = await discoverPeers(boardId, get().userId, localPeerId);

          // Connect to discovered peers
          const connections: PeerConnection[] = [];
          for (const peer of peers) {
            const connection = await p2pManager.createConnection(
              peer.peerId,
              peer.userId,
              false // Not initiator
            );
            connections.push(connection);
          }

          set({
            peers: connections,
            isConnected: connections.length > 0,
            isConnecting: false,
          });

          // Set up sync message handler
          p2pManager.onSync((message: SyncMessage) => {
            // Handle incoming sync messages
            console.log('Received sync message:', message);
            // TODO: Update local board state based on message
          });

        } catch (error) {
          console.error('Failed to connect to peers:', error);
          set({ isConnecting: false });
        }
      },

      disconnectFromPeers: () => {
        p2pManager.disconnectAll();
        set({
          peers: [],
          isConnected: false,
        });
      },

      sendBoardUpdate: (message: SyncMessage) => {
        p2pManager.broadcastMessage(message);
      },

      setUserInfo: (userId: string, username: string, email: string, isOwner: boolean) => {
        set({ userId, username, email, isOwner });
      },

      setShowInviteModal: (show: boolean) => {
        set({ showInviteModal: show });
      },

      setShowJoinModal: (show: boolean) => {
        set({ showJoinModal: show });
      },

      setShowMemberManagement: (show: boolean) => {
        set({ showMemberManagement: show });
      },
    }),
    {
      name: 'flowboard-sharing',
      partialize: (state) => ({
        userId: state.userId,
        username: state.username,
        email: state.email,
        isOwner: state.isOwner,
        invitations: state.invitations,
        joinRequests: state.joinRequests,
      }),
    }
  )
);
