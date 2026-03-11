import { renderHook, act } from '@testing-library/react'
import { useClickOutside } from '../useClickOutside'

describe('useClickOutside', () => {
  describe('basic functionality', () => {
    it('should return a ref object', () => {
      const callback = jest.fn()
      const { result } = renderHook(() => useClickOutside(callback))

      expect(result.current).toHaveProperty('current')
      expect(result.current.current === null || typeof result.current.current === 'object').toBe(true)
    })

    it('should set up event listeners on mount', () => {
      const callback = jest.fn()
      const mockAddEventListener = jest.spyOn(document, 'addEventListener')

      renderHook(() => useClickOutside(callback))

      expect(mockAddEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function))
      expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))

      mockAddEventListener.mockRestore()
    })

    it('should clean up event listeners on unmount', () => {
      const callback = jest.fn()
      const mockRemoveEventListener = jest.spyOn(document, 'removeEventListener')
      const { unmount } = renderHook(() => useClickOutside(callback))

      unmount()

      expect(mockRemoveEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function))
      expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))

      mockRemoveEventListener.mockRestore()
    })
  })

  describe('callback dependencies', () => {
    it('should update event listeners when callback changes', () => {
      const callback1 = jest.fn()
      const mockAddEventListener = jest.spyOn(document, 'addEventListener')
      const { rerender } = renderHook(({ callback }) => useClickOutside(callback), {
        initialProps: { callback: callback1 }
      })

      // Clear mock calls from initial render
      mockAddEventListener.mockClear()

      const callback2 = jest.fn()
      rerender({ callback: callback2 })

      // Should have set up new event listeners
      expect(mockAddEventListener).toHaveBeenCalledTimes(2)

      mockAddEventListener.mockRestore()
    })
  })

  describe('edge cases', () => {
    it('should handle null callback gracefully', () => {
      const { result } = renderHook(() => useClickOutside(null as any))

      expect(result.current).toHaveProperty('current')
    })

    it('should handle empty additional refs array', () => {
      const callback = jest.fn()
      const { result } = renderHook(() => useClickOutside(callback, []))

      expect(result.current).toHaveProperty('current')
    })

    it('should handle undefined additional refs', () => {
      const callback = jest.fn()
      const { result } = renderHook(() => useClickOutside(callback, undefined))

      expect(result.current).toHaveProperty('current')
    })
  })
})
