import { renderHook, act } from '@testing-library/react';
import { useUIStore } from '../uiStore';

describe('UI Store Scroll Position', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUIStore.setState({
      scrollPosition: {},
    });
  });

  it('should initialize with empty scroll position state', () => {
    const { result } = renderHook(() => useUIStore());
    
    expect(result.current.scrollPosition).toEqual({});
  });

  it('should set scroll position for a board', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setScrollPosition('board-1', { left: 500, top: 100 });
    });
    
    expect(result.current.scrollPosition).toEqual({
      'board-1': { left: 500, top: 100 },
    });
  });

  it('should get scroll position for a board', () => {
    const { result } = renderHook(() => useUIStore());
    
    // Set scroll position first
    act(() => {
      result.current.setScrollPosition('board-1', { left: 300, top: 150 });
    });
    
    // Get scroll position
    const position = result.current.getScrollPosition('board-1');
    
    expect(position).toEqual({ left: 300, top: 150 });
  });

  it('should return default position for board with no stored position', () => {
    const { result } = renderHook(() => useUIStore());
    
    const position = result.current.getScrollPosition('non-existent-board');
    
    expect(position).toEqual({ left: 0, top: 0 });
  });

  it('should handle multiple boards scroll positions', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setScrollPosition('board-1', { left: 100, top: 50 });
      result.current.setScrollPosition('board-2', { left: 200, top: 75 });
      result.current.setScrollPosition('board-3', { left: 300, top: 100 });
    });
    
    expect(result.current.scrollPosition).toEqual({
      'board-1': { left: 100, top: 50 },
      'board-2': { left: 200, top: 75 },
      'board-3': { left: 300, top: 100 },
    });
    
    expect(result.current.getScrollPosition('board-2')).toEqual({ left: 200, top: 75 });
  });

  it('should update scroll position for existing board', () => {
    const { result } = renderHook(() => useUIStore());
    
    // Set initial position
    act(() => {
      result.current.setScrollPosition('board-1', { left: 100, top: 50 });
    });
    
    expect(result.current.getScrollPosition('board-1')).toEqual({ left: 100, top: 50 });
    
    // Update position
    act(() => {
      result.current.setScrollPosition('board-1', { left: 400, top: 200 });
    });
    
    expect(result.current.getScrollPosition('board-1')).toEqual({ left: 400, top: 200 });
  });

  it('should not affect other boards when updating one board', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setScrollPosition('board-1', { left: 100, top: 50 });
      result.current.setScrollPosition('board-2', { left: 200, top: 75 });
    });
    
    // Update board-1
    act(() => {
      result.current.setScrollPosition('board-1', { left: 500, top: 250 });
    });
    
    // board-1 should be updated
    expect(result.current.getScrollPosition('board-1')).toEqual({ left: 500, top: 250 });
    // board-2 should remain unchanged
    expect(result.current.getScrollPosition('board-2')).toEqual({ left: 200, top: 75 });
  });

  it('should handle zero scroll position values', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setScrollPosition('board-1', { left: 0, top: 0 });
    });
    
    expect(result.current.getScrollPosition('board-1')).toEqual({ left: 0, top: 0 });
  });

  it('should handle negative scroll position values', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setScrollPosition('board-1', { left: -50, top: -25 });
    });
    
    expect(result.current.getScrollPosition('board-1')).toEqual({ left: -50, top: -25 });
  });
});
