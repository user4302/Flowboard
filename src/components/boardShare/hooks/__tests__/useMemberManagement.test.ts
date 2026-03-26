import { renderHook, act } from '@testing-library/react';
import { useMemberManagement } from '../useMemberManagement';
import { useSharingStore } from '@/store/sharingStore';
import { JoinRequest } from '@/lib/invitation-utils';

// Mock the sharing store
jest.mock('@/store/sharingStore');

describe('useMemberManagement Hook', () => {
  const mockApproveJoinRequest = jest.fn();
  const mockRejectJoinRequest = jest.fn();
  const mockJoinRequests: JoinRequest[] = [
    {
      id: '1',
      userId: 'user-1',
      inviteId: 'invite-1',
      username: 'john_doe',
      email: 'john@example.com',
      passwordHash: 'hashed-password-1',
      status: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      userId: 'user-2',
      inviteId: 'invite-2',
      username: 'jane_smith',
      email: 'jane@example.com',
      passwordHash: 'hashed-password-2',
      status: 'approved',
      createdAt: '2024-01-02T00:00:00.000Z'
    },
    {
      id: '3',
      userId: 'user-3',
      inviteId: 'invite-3',
      username: 'bob_wilson',
      email: 'bob@example.com',
      passwordHash: 'hashed-password-3',
      status: 'rejected',
      createdAt: '2024-01-03T00:00:00.000Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock store hook
    (useSharingStore as unknown as jest.Mock).mockReturnValue({
      joinRequests: mockJoinRequests,
      approveJoinRequest: mockApproveJoinRequest,
      rejectJoinRequest: mockRejectJoinRequest,
      userId: 'owner-123',
      isOwner: true
    });
  });

  it('returns initial state correctly', () => {
    const { result } = renderHook(() => useMemberManagement());

    expect(result.current.joinRequests).toEqual(mockJoinRequests);
    expect(result.current.pendingRequests).toHaveLength(1);
    expect(result.current.approvedRequests).toHaveLength(1);
    expect(result.current.userId).toBe('owner-123');
    expect(result.current.isOwner).toBe(true);
    expect(result.current.activeTab).toBe('pending');
    expect(typeof result.current.setActiveTab).toBe('function');
    expect(typeof result.current.handleApprove).toBe('function');
    expect(typeof result.current.handleReject).toBe('function');
  });

  it('filters pending requests correctly', () => {
    const { result } = renderHook(() => useMemberManagement());

    expect(result.current.pendingRequests).toEqual([
      mockJoinRequests[0] // Only the pending one
    ]);
  });

  it('filters approved requests correctly', () => {
    const { result } = renderHook(() => useMemberManagement());

    expect(result.current.approvedRequests).toEqual([
      mockJoinRequests[1] // Only the approved one
    ]);
  });

  it('handles tab changes', () => {
    const { result } = renderHook(() => useMemberManagement());

    expect(result.current.activeTab).toBe('pending');

    act(() => {
      result.current.setActiveTab('members');
    });

    expect(result.current.activeTab).toBe('members');
  });

  it('calls approveJoinRequest when handleApprove is called', () => {
    const { result } = renderHook(() => useMemberManagement());

    act(() => {
      result.current.handleApprove('request-123');
    });

    expect(mockApproveJoinRequest).toHaveBeenCalledWith('request-123');
  });

  it('calls rejectJoinRequest when handleReject is called', () => {
    const { result } = renderHook(() => useMemberManagement());

    act(() => {
      result.current.handleReject('request-456');
    });

    expect(mockRejectJoinRequest).toHaveBeenCalledWith('request-456');
  });

  it('handles empty join requests list', () => {
    (useSharingStore as unknown as jest.Mock).mockReturnValue({
      joinRequests: [],
      approveJoinRequest: mockApproveJoinRequest,
      rejectJoinRequest: mockRejectJoinRequest,
      userId: 'owner-123',
      isOwner: true
    });

    const { result } = renderHook(() => useMemberManagement());

    expect(result.current.joinRequests).toEqual([]);
    expect(result.current.pendingRequests).toEqual([]);
    expect(result.current.approvedRequests).toEqual([]);
  });

  it('handles all approved requests', () => {
    const allApprovedRequests = mockJoinRequests.map(req => ({ ...req, status: 'approved' as const }));
    (useSharingStore as unknown as jest.Mock).mockReturnValue({
      joinRequests: allApprovedRequests,
      approveJoinRequest: mockApproveJoinRequest,
      rejectJoinRequest: mockRejectJoinRequest,
      userId: 'owner-123',
      isOwner: true
    });

    const { result } = renderHook(() => useMemberManagement());

    expect(result.current.pendingRequests).toEqual([]);
    expect(result.current.approvedRequests).toEqual(allApprovedRequests);
  });

  it('handles all pending requests', () => {
    const allPendingRequests = mockJoinRequests.map(req => ({ ...req, status: 'pending' as const }));
    (useSharingStore as unknown as jest.Mock).mockReturnValue({
      joinRequests: allPendingRequests,
      approveJoinRequest: mockApproveJoinRequest,
      rejectJoinRequest: mockRejectJoinRequest,
      userId: 'owner-123',
      isOwner: true
    });

    const { result } = renderHook(() => useMemberManagement());

    expect(result.current.pendingRequests).toEqual(allPendingRequests);
    expect(result.current.approvedRequests).toEqual([]);
  });

  it('returns user information from store', () => {
    (useSharingStore as unknown as jest.Mock).mockReturnValue({
      joinRequests: mockJoinRequests,
      approveJoinRequest: mockApproveJoinRequest,
      rejectJoinRequest: mockRejectJoinRequest,
      userId: 'user-456',
      isOwner: false
    });

    const { result } = renderHook(() => useMemberManagement());

    expect(result.current.userId).toBe('user-456');
    expect(result.current.isOwner).toBe(false);
  });

  it('returns functions on every render', () => {
    const { result, rerender } = renderHook(() => useMemberManagement());

    // Functions should be available on every render
    expect(typeof result.current.setActiveTab).toBe('function');
    expect(typeof result.current.handleApprove).toBe('function');
    expect(typeof result.current.handleReject).toBe('function');

    rerender();

    // Functions should still be available after re-render
    expect(typeof result.current.setActiveTab).toBe('function');
    expect(typeof result.current.handleApprove).toBe('function');
    expect(typeof result.current.handleReject).toBe('function');
  });

  it('handles multiple approvals', () => {
    const { result } = renderHook(() => useMemberManagement());

    act(() => {
      result.current.handleApprove('request-1');
      result.current.handleApprove('request-2');
      result.current.handleApprove('request-3');
    });

    expect(mockApproveJoinRequest).toHaveBeenCalledTimes(3);
    expect(mockApproveJoinRequest).toHaveBeenLastCalledWith('request-3');
  });

  it('handles multiple rejections', () => {
    const { result } = renderHook(() => useMemberManagement());

    act(() => {
      result.current.handleReject('request-1');
      result.current.handleReject('request-2');
    });

    expect(mockRejectJoinRequest).toHaveBeenCalledTimes(2);
    expect(mockRejectJoinRequest).toHaveBeenLastCalledWith('request-2');
  });

  it('filters out rejected requests', () => {
    const { result } = renderHook(() => useMemberManagement());

    // Should not include rejected requests in either pending or approved
    expect(result.current.pendingRequests).not.toContainEqual(
      expect.objectContaining({ status: 'rejected' })
    );
    expect(result.current.approvedRequests).not.toContainEqual(
      expect.objectContaining({ status: 'rejected' })
    );
  });
});
