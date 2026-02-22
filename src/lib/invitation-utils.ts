// Utility functions for invitation management

export interface Invitation {
  id: string;
  boardId: string;
  boardName: string;
  ownerId: string;
  createdAt: string;
  expiresAt: string;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  inviteUrl?: string;
}

export interface JoinRequest {
  id: string;
  userId: string;
  inviteId: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PeerInfo {
  userId: string;
  peerId: string;
  lastSeen: string;
  isOnline: boolean;
}

export interface PeerRegistry {
  boardId: string;
  peers: PeerInfo[];
  timestamp: string;
}

// API functions for Netlify functions
const API_BASE = '/.netlify/functions';

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

export async function validateInvite(inviteId: string): Promise<{ valid: boolean; boardName: string; expiresAt: string }> {
  const response = await fetch(`${API_BASE}/validate-invite/${inviteId}`);
  
  if (!response.ok) {
    throw new Error('Failed to validate invitation');
  }

  return response.json();
}

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
export function storeInvitation(invitation: Invitation): void {
  const invitations = getStoredInvitations();
  invitations.push(invitation);
  localStorage.setItem('flowboard_invitations', JSON.stringify(invitations));
}

export function getStoredInvitations(): Invitation[] {
  const stored = localStorage.getItem('flowboard_invitations');
  return stored ? JSON.parse(stored) : [];
}

export function removeInvitation(inviteId: string): void {
  const invitations = getStoredInvitations();
  const filtered = invitations.filter(inv => inv.id !== inviteId);
  localStorage.setItem('flowboard_invitations', JSON.stringify(filtered));
}

export function storeJoinRequest(request: JoinRequest): void {
  const requests = getStoredJoinRequests();
  requests.push(request);
  localStorage.setItem('flowboard_join_requests', JSON.stringify(requests));
}

export function getStoredJoinRequests(): JoinRequest[] {
  const stored = localStorage.getItem('flowboard_join_requests');
  return stored ? JSON.parse(stored) : [];
}

export function updateJoinRequestStatus(requestId: string, status: 'approved' | 'rejected'): void {
  const requests = getStoredJoinRequests();
  const updated = requests.map(req => 
    req.id === requestId ? { ...req, status } : req
  );
  localStorage.setItem('flowboard_join_requests', JSON.stringify(updated));
}
