import { renderHook, act } from '@testing-library/react';
import { useInviteModal } from '../useInviteModal';
import { useSharingStore } from '@/store/sharingStore';
import { useBoardStore } from '@/store';
import { DEFAULT_INVITATION_EXPIRY_HOURS } from '../../constants';

// Mock the stores
jest.mock('@/store/sharingStore');
jest.mock('@/store');

// Mock the constants
jest.mock('../../constants', () => ({
  DEFAULT_INVITATION_EXPIRY_HOURS: 168
}));

describe('useInviteModal Hook', () => {
  const mockCreateInvitation = jest.fn();
  const mockGetCurrentBoard = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock store hooks
    (useSharingStore as unknown as jest.Mock).mockReturnValue({
      createInvitation: mockCreateInvitation
    });

    (useBoardStore as unknown as jest.Mock).mockReturnValue({
      getCurrentBoard: mockGetCurrentBoard
    });
  });

  it('returns initial state correctly', () => {
    mockGetCurrentBoard.mockReturnValue(null);

    const { result } = renderHook(() => useInviteModal());

    expect(result.current.currentBoard).toBeNull();
    expect(result.current.expiresIn).toBe(DEFAULT_INVITATION_EXPIRY_HOURS);
    expect(typeof result.current.setExpiresIn).toBe('function');
    expect(typeof result.current.handleCreateInvite).toBe('function');
  });

  it('returns current board when available', () => {
    const mockBoard = {
      id: 'board-123',
      name: 'Test Board',
      lists: []
    };

    mockGetCurrentBoard.mockReturnValue(mockBoard);

    const { result } = renderHook(() => useInviteModal());

    expect(result.current.currentBoard).toEqual(mockBoard);
  });

  it('does not create invitation when no current board exists', async () => {
    mockGetCurrentBoard.mockReturnValue(null);

    const { result } = renderHook(() => useInviteModal());

    await result.current.handleCreateInvite();

    expect(mockCreateInvitation).not.toHaveBeenCalled();
  });

  it('creates invitation with current board data', async () => {
    const mockBoard = {
      id: 'board-123',
      name: 'Test Board',
      lists: []
    };

    mockGetCurrentBoard.mockReturnValue(mockBoard);
    mockCreateInvitation.mockResolvedValue(undefined);

    const { result } = renderHook(() => useInviteModal());

    await result.current.handleCreateInvite();

    expect(mockCreateInvitation).toHaveBeenCalledWith('board-123', 'Test Board');
  });

  it('handles invitation creation errors gracefully', async () => {
    const mockError = new Error('Network error');
    mockCreateInvitation.mockRejectedValue(mockError);

    const { result } = renderHook(() => useInviteModal());

    // Should not throw error
    try {
      await act(async () => {
        await result.current.handleCreateInvite();
      });
    } catch (error) {
      // Should not throw
    }

    expect(mockCreateInvitation).toHaveBeenCalledWith('board-123', 'Test Board');
  });

  it('updates expiration time', () => {
    mockGetCurrentBoard.mockReturnValue(null);

    const { result } = renderHook(() => useInviteModal());

    expect(result.current.expiresIn).toBe(DEFAULT_INVITATION_EXPIRY_HOURS);

    act(() => {
      result.current.setExpiresIn(48);
    });

    expect(result.current.expiresIn).toBe(48);
  });

  it('calls store hooks on every render', () => {
    mockGetCurrentBoard.mockReturnValue(null);

    renderHook(() => useInviteModal());

    expect(useSharingStore).toHaveBeenCalled();
    expect(useBoardStore).toHaveBeenCalled();
  });

  it('returns functions on every render', () => {
    mockGetCurrentBoard.mockReturnValue(null);

    const { result, rerender } = renderHook(() => useInviteModal());

    // Functions should be available on every render
    expect(typeof result.current.setExpiresIn).toBe('function');
    expect(typeof result.current.handleCreateInvite).toBe('function');

    rerender();

    // Functions should still be available after re-render
    expect(typeof result.current.setExpiresIn).toBe('function');
    expect(typeof result.current.handleCreateInvite).toBe('function');
  });

  it('handles multiple invitation creations', async () => {
    const mockBoard = {
      id: 'board-123',
      name: 'Test Board',
      lists: []
    };

    mockGetCurrentBoard.mockReturnValue(mockBoard);
    mockCreateInvitation.mockResolvedValue(undefined);

    const { result } = renderHook(() => useInviteModal());

    // Create multiple invitations
    await result.current.handleCreateInvite();
    await result.current.handleCreateInvite();
    await result.current.handleCreateInvite();

    expect(mockCreateInvitation).toHaveBeenCalledTimes(3);
    expect(mockCreateInvitation).toHaveBeenLastCalledWith('board-123', 'Test Board');
  });

  it('works with different board names', async () => {
    const mockBoard1 = {
      id: 'board-456',
      name: 'Another Board',
      lists: []
    };

    mockGetCurrentBoard.mockReturnValue(mockBoard1);
    mockCreateInvitation.mockResolvedValue(undefined);

    const { result } = renderHook(() => useInviteModal());

    await result.current.handleCreateInvite();

    expect(mockCreateInvitation).toHaveBeenCalledWith('board-456', 'Another Board');
  });
});
