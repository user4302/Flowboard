import { renderHook } from '@testing-library/react'
import { useCardContextMenu } from '../useCardContextMenu'

describe('useCardContextMenu', () => {
  it('should export useCardContextMenu hook', () => {
    expect(typeof useCardContextMenu).toBe('function')
  })

  it('should return context menu state and controls', () => {
    const { result } = renderHook(() => useCardContextMenu())

    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe('object')
  })

  it('should provide isOpen state', () => {
    const { result } = renderHook(() => useCardContextMenu())

    expect(result.current.isOpen).toBeDefined()
    expect(typeof result.current.isOpen).toBe('boolean')
  })

  it('should provide position state', () => {
    const { result } = renderHook(() => useCardContextMenu())

    expect(result.current.position).toBeDefined()
    expect(typeof result.current.position).toBe('object')
    expect(result.current.position.x).toBeDefined()
    expect(result.current.position.y).toBeDefined()
  })

  it('should provide handleContextMenu function', () => {
    const { result } = renderHook(() => useCardContextMenu())

    expect(typeof result.current.handleContextMenu).toBe('function')
  })

  it('should provide handleButtonClick function', () => {
    const { result } = renderHook(() => useCardContextMenu())

    expect(typeof result.current.handleButtonClick).toBe('function')
  })

  it('should provide closeContextMenu function', () => {
    const { result } = renderHook(() => useCardContextMenu())

    expect(typeof result.current.closeContextMenu).toBe('function')
  })

  it('should provide cardRef', () => {
    const { result } = renderHook(() => useCardContextMenu())

    expect(result.current.cardRef).toBeDefined()
    expect(result.current.cardRef.current).toBe(null)
  })

  it('should have default closed state', () => {
    const { result } = renderHook(() => useCardContextMenu())

    expect(result.current.isOpen).toBe(false)
  })

  it('should have default position', () => {
    const { result } = renderHook(() => useCardContextMenu())

    expect(result.current.position).toEqual({ x: 0, y: 0 })
  })

  it('should handle handleContextMenu call', () => {
    const { result } = renderHook(() => useCardContextMenu())

    // Create a mock event
    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    } as any

    expect(() => result.current.handleContextMenu(mockEvent)).not.toThrow()
  })

  it('should handle closeContextMenu call', () => {
    const { result } = renderHook(() => useCardContextMenu())

    expect(() => result.current.closeContextMenu()).not.toThrow()
  })
})
