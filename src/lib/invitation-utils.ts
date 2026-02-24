/**
 * Utility functions for invitation management
 * Handles board invitations, join requests, and peer discovery
 * Provides API integration with Netlify functions and local storage management
 */

/**
 * Invitation interface - Represents a board invitation
 * Contains all information needed for invitation management
 */
export interface Invitation {
  // Unique identifier for the invitation
  id: string;
  // ID of the board this invitation is for
  boardId: string;
  // Name of the board for display purposes
  boardName: string;
  // ID of the user who created the invitation
  ownerId: string;
  // When the invitation was created
  createdAt: string;
  // When the invitation expires
  expiresAt: string;
  // Maximum number of uses allowed
  maxUses: number;
  // Current number of uses
  currentUses: number;
  // Whether the invitation is currently active
  isActive: boolean;
  // Optional URL for the invitation
  inviteUrl?: string;
}

/**
 * Join request interface - Represents a request to join a board
 * Contains user information and request status
 */
export interface JoinRequest {
  // Unique identifier for the request
  id: string;
  // ID of the user making the request
  userId: string;
  // ID of the invitation being used
  inviteId: string;
  // Email of the requesting user
  email: string;
  // Username of the requesting user
  username: string;
  // Hashed password for authentication
  passwordHash: string;
  // When the request was created
  createdAt: string;
  // Current status of the request
  status: 'pending' | 'approved' | 'rejected';
}

/**
 * Peer information interface - Represents a connected peer
 * Contains peer connection details and status
 */
export interface PeerInfo {
  // Unique identifier for the user
  userId: string;
  // Peer connection ID
  peerId: string;
  // When the peer was last seen
  lastSeen: string;
  // Whether the peer is currently online
  isOnline: boolean;
}

/**
 * Peer registry interface - Registry of all peers for a board
 * Contains peer list and registry timestamp
 */
export interface PeerRegistry {
  // ID of the board this registry is for
  boardId: string;
  // Array of connected peers
  peers: PeerInfo[];
  // When the registry was last updated
  timestamp: string;
}

// API functions for Netlify functions
const API_BASE = '/.netlify/functions';

/**
 * Create a new board invitation
 * Sends request to Netlify function to generate invitation
 * @param boardId - ID of the board to create invitation for
 * @param boardName - Name of the board for display
 * @param ownerId - ID of the user creating the invitation
 * @param expiresIn - Number of hours until invitation expires (default: 168 = 1 week)
 * @returns Promise resolving to the created invitation
 */
export async function createInvite(
  boardId: string,
  boardName: string,
  ownerId: string,
  expiresIn: number = 168 // 1 week in hours
): Promise<Invitation> {
  const response = await fetch(`${API_BASE}/create-invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      boardId,
      boardName,
      ownerId,
      expiresIn,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create invitation');
  }

  return response.json();
}

/**
 * Validate an invitation
 * Checks if an invitation is valid and not expired
 * @param inviteId - ID of the invitation to validate
 * @returns Promise resolving to validation result with board info
 */
export async function validateInvite(inviteId: string): Promise<{ valid: boolean; boardName: string; expiresAt: string }> {
  const response = await fetch(`${API_BASE}/validate-invite/${inviteId}`);

  if (!response.ok) {
    throw new Error('Failed to validate invitation');
  }

  return response.json();
}

/**
 * Join a board using an invitation
 * Submits join request with user credentials
 * @param inviteId - ID of the invitation to use
 * @param email - User's email address
 * @param username - User's chosen username
 * @param password - User's password
 * @returns Promise resolving to join result with status information
 */
export async function joinBoard(
  inviteId: string,
  email: string,
  username: string,
  password: string
): Promise<{ success: boolean; message: string; userId?: string; requiresApproval: boolean; requestId?: string }> {
  const response = await fetch(`${API_BASE}/join-board`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inviteId,
      email,
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to join board');
  }

  return response.json();
}

/**
 * Discover peers for a board
 * Registers current peer and retrieves list of connected peers
 * @param boardId - ID of the board to discover peers for
 * @param userId - ID of the current user
 * @param peerId - Peer connection ID of the current user
 * @returns Promise resolving to peer registry with connected peers
 */
export async function discoverPeers(
  boardId: string,
  userId: string,
  peerId: string
): Promise<{ peers: PeerInfo[]; timestamp: string }> {
  const response = await fetch(`${API_BASE}/peer-discovery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      boardId,
      userId,
      peerId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to discover peers');
  }

  return response.json();
}

// Local storage helpers

/**
 * Store an invitation in local storage
 * Adds invitation to existing stored invitations
 * @param invitation - Invitation to store
 */
export function storeInvitation(invitation: Invitation): void {
  const invitations = getStoredInvitations();
  invitations.push(invitation);
  localStorage.setItem('flowboard_invitations', JSON.stringify(invitations));
}

/**
 * Get all stored invitations from local storage
 * @returns Array of stored invitations
 */
export function getStoredInvitations(): Invitation[] {
  const stored = localStorage.getItem('flowboard_invitations');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Remove an invitation from local storage
 * Filters out the specified invitation from stored invitations
 * @param inviteId - ID of the invitation to remove
 */
export function removeInvitation(inviteId: string): void {
  const invitations = getStoredInvitations();
  const filtered = invitations.filter(inv => inv.id !== inviteId);
  localStorage.setItem('flowboard_invitations', JSON.stringify(filtered));
}

/**
 * Store a join request in local storage
 * Adds join request to existing stored requests
 * @param request - Join request to store
 */
export function storeJoinRequest(request: JoinRequest): void {
  const requests = getStoredJoinRequests();
  requests.push(request);
  localStorage.setItem('flowboard_join_requests', JSON.stringify(requests));
}

/**
 * Get all stored join requests from local storage
 * @returns Array of stored join requests
 */
export function getStoredJoinRequests(): JoinRequest[] {
  const stored = localStorage.getItem('flowboard_join_requests');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Update the status of a join request in local storage
 * Finds and updates the specified request's status
 * @param requestId - ID of the request to update
 * @param status - New status to set ('approved' or 'rejected')
 */
export function updateJoinRequestStatus(requestId: string, status: 'approved' | 'rejected'): void {
  const requests = getStoredJoinRequests();
  const updated = requests.map(req =>
    req.id === requestId ? { ...req, status } : req
  );
  localStorage.setItem('flowboard_join_requests', JSON.stringify(updated));
}
