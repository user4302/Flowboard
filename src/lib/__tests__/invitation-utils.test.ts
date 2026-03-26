import {
  createInvite,
  validateInvite,
  joinBoard,
  discoverPeers,
  storeInvitation,
  getStoredInvitations,
  removeInvitation,
  storeJoinRequest,
  getStoredJoinRequests,
  updateJoinRequestStatus,
  type Invitation,
  type JoinRequest,
  type PeerInfo
} from '../invitation-utils';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('invitation-utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API Functions', () => {
    describe('createInvite', () => {
      it('should create an invitation successfully', async () => {
        const mockInvitation: Invitation = {
          id: 'invite-123',
          boardId: 'board-456',
          boardName: 'Test Board',
          ownerId: 'user-789',
          createdAt: '2023-01-01T00:00:00Z',
          expiresAt: '2023-01-08T00:00:00Z',
          maxUses: 10,
          currentUses: 0,
          isActive: true
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(mockInvitation)
        });

        const result = await createInvite('board-456', 'Test Board', 'user-789');

        expect(fetch).toHaveBeenCalledWith('/.netlify/functions/create-invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            boardId: 'board-456',
            boardName: 'Test Board',
            ownerId: 'user-789',
            expiresIn: 168
          }),
        });
        expect(result).toEqual(mockInvitation);
      });

      it('should use custom expiration time', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({})
        });

        await createInvite('board-456', 'Test Board', 'user-789', 24);

        expect(fetch).toHaveBeenCalledWith('/.netlify/functions/create-invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            boardId: 'board-456',
            boardName: 'Test Board',
            ownerId: 'user-789',
            expiresIn: 24
          }),
        });
      });

      it('should throw error when creation fails', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500
        });

        await expect(createInvite('board-456', 'Test Board', 'user-789'))
          .rejects.toThrow('Failed to create invitation');
      });
    });

    describe('validateInvite', () => {
      it('should validate an invitation successfully', async () => {
        const mockValidation = {
          valid: true,
          boardName: 'Test Board',
          expiresAt: '2023-01-08T00:00:00Z'
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(mockValidation)
        });

        const result = await validateInvite('invite-123');

        expect(fetch).toHaveBeenCalledWith('/.netlify/functions/validate-invite/invite-123');
        expect(result).toEqual(mockValidation);
      });

      it('should throw error when validation fails', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 404
        });

        await expect(validateInvite('invalid-invite'))
          .rejects.toThrow('Failed to validate invitation');
      });
    });

    describe('joinBoard', () => {
      it('should join a board successfully', async () => {
        const mockJoinResult = {
          success: true,
          message: 'Join request submitted',
          userId: 'user-123',
          requiresApproval: true,
          requestId: 'request-456'
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(mockJoinResult)
        });

        const result = await joinBoard('invite-123', 'test@example.com', 'testuser', 'password');

        expect(fetch).toHaveBeenCalledWith('/.netlify/functions/join-board', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inviteId: 'invite-123',
            email: 'test@example.com',
            username: 'testuser',
            password: 'password'
          }),
        });
        expect(result).toEqual(mockJoinResult);
      });

      it('should throw error when join fails', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 400
        });

        await expect(joinBoard('invite-123', 'test@example.com', 'testuser', 'password'))
          .rejects.toThrow('Failed to join board');
      });
    });

    describe('discoverPeers', () => {
      it('should discover peers successfully', async () => {
        const mockPeers: PeerInfo[] = [
          {
            userId: 'user-1',
            peerId: 'peer-1',
            lastSeen: '2023-01-01T12:00:00Z',
            isOnline: true
          },
          {
            userId: 'user-2',
            peerId: 'peer-2',
            lastSeen: '2023-01-01T11:00:00Z',
            isOnline: false
          }
        ];

        const mockResult = {
          peers: mockPeers,
          timestamp: '2023-01-01T12:00:00Z'
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(mockResult)
        });

        const result = await discoverPeers('board-456', 'user-123', 'peer-123');

        expect(fetch).toHaveBeenCalledWith('/.netlify/functions/peer-discovery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            boardId: 'board-456',
            userId: 'user-123',
            peerId: 'peer-123'
          }),
        });
        expect(result).toEqual(mockResult);
      });

      it('should throw error when peer discovery fails', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500
        });

        await expect(discoverPeers('board-456', 'user-123', 'peer-123'))
          .rejects.toThrow('Failed to discover peers');
      });
    });
  });

  describe('Local Storage Functions', () => {
    describe('storeInvitation', () => {
      it('should store invitation in localStorage', () => {
        const mockInvitation: Invitation = {
          id: 'invite-123',
          boardId: 'board-456',
          boardName: 'Test Board',
          ownerId: 'user-789',
          createdAt: '2023-01-01T00:00:00Z',
          expiresAt: '2023-01-08T00:00:00Z',
          maxUses: 10,
          currentUses: 0,
          isActive: true
        };

        // Mock empty existing invitations
        localStorageMock.getItem.mockReturnValue('[]');

        storeInvitation(mockInvitation);

        expect(localStorageMock.getItem).toHaveBeenCalledWith('flowboard_invitations');
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'flowboard_invitations',
          JSON.stringify([mockInvitation])
        );
      });

      it('should add invitation to existing ones', () => {
        const existingInvitation: Invitation = {
          id: 'invite-456',
          boardId: 'board-789',
          boardName: 'Existing Board',
          ownerId: 'user-456',
          createdAt: '2023-01-01T00:00:00Z',
          expiresAt: '2023-01-08T00:00:00Z',
          maxUses: 5,
          currentUses: 2,
          isActive: true
        };

        const newInvitation: Invitation = {
          id: 'invite-123',
          boardId: 'board-456',
          boardName: 'New Board',
          ownerId: 'user-789',
          createdAt: '2023-01-02T00:00:00Z',
          expiresAt: '2023-01-09T00:00:00Z',
          maxUses: 10,
          currentUses: 0,
          isActive: true
        };

        localStorageMock.getItem.mockReturnValue(JSON.stringify([existingInvitation]));

        storeInvitation(newInvitation);

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'flowboard_invitations',
          JSON.stringify([existingInvitation, newInvitation])
        );
      });
    });

    describe('getStoredInvitations', () => {
      it('should return empty array when no invitations stored', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const result = getStoredInvitations();

        expect(result).toEqual([]);
        expect(localStorageMock.getItem).toHaveBeenCalledWith('flowboard_invitations');
      });

      it('should return stored invitations', () => {
        const mockInvitations: Invitation[] = [
          {
            id: 'invite-123',
            boardId: 'board-456',
            boardName: 'Test Board',
            ownerId: 'user-789',
            createdAt: '2023-01-01T00:00:00Z',
            expiresAt: '2023-01-08T00:00:00Z',
            maxUses: 10,
            currentUses: 0,
            isActive: true
          }
        ];

        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockInvitations));

        const result = getStoredInvitations();

        expect(result).toEqual(mockInvitations);
      });
    });

    describe('removeInvitation', () => {
      it('should remove invitation by ID', () => {
        const invitation1: Invitation = {
          id: 'invite-123',
          boardId: 'board-456',
          boardName: 'Board 1',
          ownerId: 'user-789',
          createdAt: '2023-01-01T00:00:00Z',
          expiresAt: '2023-01-08T00:00:00Z',
          maxUses: 10,
          currentUses: 0,
          isActive: true
        };

        const invitation2: Invitation = {
          id: 'invite-456',
          boardId: 'board-789',
          boardName: 'Board 2',
          ownerId: 'user-456',
          createdAt: '2023-01-02T00:00:00Z',
          expiresAt: '2023-01-09T00:00:00Z',
          maxUses: 5,
          currentUses: 1,
          isActive: true
        };

        localStorageMock.getItem.mockReturnValue(JSON.stringify([invitation1, invitation2]));

        removeInvitation('invite-123');

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'flowboard_invitations',
          JSON.stringify([invitation2])
        );
      });
    });

    describe('storeJoinRequest', () => {
      it('should store join request in localStorage', () => {
        const mockRequest: JoinRequest = {
          id: 'request-123',
          userId: 'user-456',
          inviteId: 'invite-789',
          email: 'test@example.com',
          username: 'testuser',
          passwordHash: 'hashedpassword',
          createdAt: '2023-01-01T00:00:00Z',
          status: 'pending'
        };

        localStorageMock.getItem.mockReturnValue('[]');

        storeJoinRequest(mockRequest);

        expect(localStorageMock.getItem).toHaveBeenCalledWith('flowboard_join_requests');
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'flowboard_join_requests',
          JSON.stringify([mockRequest])
        );
      });
    });

    describe('getStoredJoinRequests', () => {
      it('should return empty array when no requests stored', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const result = getStoredJoinRequests();

        expect(result).toEqual([]);
        expect(localStorageMock.getItem).toHaveBeenCalledWith('flowboard_join_requests');
      });

      it('should return stored join requests', () => {
        const mockRequests: JoinRequest[] = [
          {
            id: 'request-123',
            userId: 'user-456',
            inviteId: 'invite-789',
            email: 'test@example.com',
            username: 'testuser',
            passwordHash: 'hashedpassword',
            createdAt: '2023-01-01T00:00:00Z',
            status: 'pending'
          }
        ];

        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockRequests));

        const result = getStoredJoinRequests();

        expect(result).toEqual(mockRequests);
      });
    });

    describe('updateJoinRequestStatus', () => {
      it('should update request status to approved', () => {
        const request1: JoinRequest = {
          id: 'request-123',
          userId: 'user-456',
          inviteId: 'invite-789',
          email: 'test@example.com',
          username: 'testuser',
          passwordHash: 'hashedpassword',
          createdAt: '2023-01-01T00:00:00Z',
          status: 'pending'
        };

        const request2: JoinRequest = {
          id: 'request-456',
          userId: 'user-789',
          inviteId: 'invite-123',
          email: 'user2@example.com',
          username: 'user2',
          passwordHash: 'hashedpassword2',
          createdAt: '2023-01-02T00:00:00Z',
          status: 'pending'
        };

        localStorageMock.getItem.mockReturnValue(JSON.stringify([request1, request2]));

        updateJoinRequestStatus('request-123', 'approved');

        const expected = [
          { ...request1, status: 'approved' },
          request2
        ];

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'flowboard_join_requests',
          JSON.stringify(expected)
        );
      });

      it('should update request status to rejected', () => {
        const request: JoinRequest = {
          id: 'request-123',
          userId: 'user-456',
          inviteId: 'invite-789',
          email: 'test@example.com',
          username: 'testuser',
          passwordHash: 'hashedpassword',
          createdAt: '2023-01-01T00:00:00Z',
          status: 'pending'
        };

        localStorageMock.getItem.mockReturnValue(JSON.stringify([request]));

        updateJoinRequestStatus('request-123', 'rejected');

        const expected = [{ ...request, status: 'rejected' }];

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'flowboard_join_requests',
          JSON.stringify(expected)
        );
      });
    });
  });
});
