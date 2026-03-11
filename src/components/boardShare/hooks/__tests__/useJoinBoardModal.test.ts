import { renderHook, act } from '@testing-library/react'
import { useJoinBoardModal } from '../useJoinBoardModal'

describe('useJoinBoardModal', () => {
  it('should export useJoinBoardModal hook', () => {
    expect(typeof useJoinBoardModal).toBe('function')
  })

  it('should return join board modal state and controls', () => {
    const { result } = renderHook(() => useJoinBoardModal())

    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe('object')
  })

  it('should provide formData state', () => {
    const { result } = renderHook(() => useJoinBoardModal())

    expect(result.current.formData).toBeDefined()
    expect(typeof result.current.formData).toBe('object')
    expect(result.current.formData.email).toBe('')
    expect(result.current.formData.username).toBe('')
    expect(result.current.formData.password).toBe('')
  })

  it('should provide isLoading state', () => {
    const { result } = renderHook(() => useJoinBoardModal())

    expect(result.current.isLoading).toBeDefined()
    expect(typeof result.current.isLoading).toBe('boolean')
    expect(result.current.isLoading).toBe(false)
  })

  it('should provide updateFormData function', () => {
    const { result } = renderHook(() => useJoinBoardModal())

    expect(typeof result.current.updateFormData).toBe('function')
  })

  it('should provide handleJoin function', () => {
    const { result } = renderHook(() => useJoinBoardModal())

    expect(typeof result.current.handleJoin).toBe('function')
  })

  it('should provide handleKeyPress function', () => {
    const { result } = renderHook(() => useJoinBoardModal())

    expect(typeof result.current.handleKeyPress).toBe('function')
  })

  it('should handle inviteId parameter', () => {
    const { result } = renderHook(() => useJoinBoardModal('invite123'))

    expect(result.current).toBeDefined()
  })

  it('should handle updateFormData calls', () => {
    const { result } = renderHook(() => useJoinBoardModal())

    expect(() => {
      act(() => {
        result.current.updateFormData('email', 'test@example.com')
      })
    }).not.toThrow()

    expect(() => {
      act(() => {
        result.current.updateFormData('username', 'testuser')
      })
    }).not.toThrow()

    expect(() => {
      act(() => {
        result.current.updateFormData('password', 'password123')
      })
    }).not.toThrow()
  })

  it('should update formData correctly', () => {
    const { result } = renderHook(() => useJoinBoardModal())

    act(() => {
      result.current.updateFormData('email', 'test@example.com')
    })
    expect(result.current.formData.email).toBe('test@example.com')

    act(() => {
      result.current.updateFormData('username', 'testuser')
    })
    expect(result.current.formData.username).toBe('testuser')

    act(() => {
      result.current.updateFormData('password', 'password123')
    })
    expect(result.current.formData.password).toBe('password123')
  })

  it('should handle handleJoin call', () => {
    const { result } = renderHook(() => useJoinBoardModal())

    expect(() => result.current.handleJoin()).not.toThrow()
  })

  it('should handle handleKeyPress call', () => {
    const { result } = renderHook(() => useJoinBoardModal())

    const mockEvent = {
      key: 'Enter'
    } as any

    expect(() => result.current.handleKeyPress(mockEvent)).not.toThrow()
  })

  it('should work without inviteId', () => {
    const { result } = renderHook(() => useJoinBoardModal())

    expect(result.current).toBeDefined()
    expect(typeof result.current.formData).toBe('object')
  })
})
