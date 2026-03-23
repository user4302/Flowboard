import { renderHook, act } from '@testing-library/react';
import { useJoinBoardModal } from '../useJoinBoardModal';

describe('useJoinBoardModal Hook', () => {
  it('returns initial form state correctly', () => {
    const { result } = renderHook(() => useJoinBoardModal('invite-123'));

    expect(result.current.formData).toEqual({
      email: '',
      username: '',
      password: ''
    });
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.updateFormData).toBe('function');
    expect(typeof result.current.handleJoin).toBe('function');
    expect(typeof result.current.handleKeyPress).toBe('function');
  });

  it('updates form data correctly', () => {
    const { result } = renderHook(() => useJoinBoardModal('invite-123'));

    act(() => {
      result.current.updateFormData('email', 'test@example.com');
    });

    expect(result.current.formData.email).toBe('test@example.com');
    expect(result.current.formData.username).toBe('');
    expect(result.current.formData.password).toBe('');
  });

  it('updates all form fields', () => {
    const { result } = renderHook(() => useJoinBoardModal('invite-123'));

    act(() => {
      result.current.updateFormData('email', 'test@example.com');
      result.current.updateFormData('username', 'testuser');
      result.current.updateFormData('password', 'password123');
    });

    expect(result.current.formData).toEqual({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123'
    });
  });

  it('does not join when no invite ID provided', async () => {
    const { result } = renderHook(() => useJoinBoardModal());

    const response = await result.current.handleJoin();
    expect(response).toBeUndefined();
  });

  it('works without invite ID', () => {
    const { result } = renderHook(() => useJoinBoardModal());

    expect(result.current.formData).toEqual({
      email: '',
      username: '',
      password: ''
    });
    expect(result.current.isLoading).toBe(false);
  });
});
