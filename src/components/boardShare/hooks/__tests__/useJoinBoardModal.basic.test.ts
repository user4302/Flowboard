import { renderHook } from '@testing-library/react';
import { useJoinBoardModal } from '../useJoinBoardModal';

// Simple test to see if the hook works
describe('useJoinBoardModal Basic Test', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useJoinBoardModal('test-invite-id'));
    
    console.log('Hook result:', result.current);
    
    expect(result.current).toBeDefined();
    expect(result.current.formData).toBeDefined();
  });
});
