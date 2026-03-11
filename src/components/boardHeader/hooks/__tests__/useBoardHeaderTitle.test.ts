import { renderHook } from '@testing-library/react'
import { useBoardHeaderTitle } from '../useBoardHeaderTitle'
import { Board } from '@/lib/types'

describe('useBoardHeaderTitle', () => {
  const createMockBoard = (overrides: Partial<Board> = {}): Board => ({
    id: 'board1',
    name: 'Test Board',
    lists: [],
    members: [],
    labels: [],
    archivedCards: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  })

  it('should export useBoardHeaderTitle hook', () => {
    expect(typeof useBoardHeaderTitle).toBe('function')
  })

  it('should return title management functions', () => {
    const mockBoard = createMockBoard()
    const { result } = renderHook(() => useBoardHeaderTitle(mockBoard))

    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe('object')
  })

  it('should handle board parameter', () => {
    const mockBoard = createMockBoard({ id: 'test-board', name: 'Test Title' })
    const { result } = renderHook(() => useBoardHeaderTitle(mockBoard))

    expect(result.current).toBeDefined()
  })
})
