import { renderHook } from '@testing-library/react'
import { useBoardHeaderActions } from '../useBoardHeaderActions'
import { Board } from '@/lib/types'

describe('useBoardHeaderActions', () => {
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

  it('should export useBoardHeaderActions hook', () => {
    expect(typeof useBoardHeaderActions).toBe('function')
  })

  it('should return board header actions', () => {
    const mockBoard = createMockBoard()
    const { result } = renderHook(() => useBoardHeaderActions(mockBoard))

    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe('object')
  })

  it('should handle board parameter', () => {
    const mockBoard = createMockBoard({ id: 'test-board' })
    const { result } = renderHook(() => useBoardHeaderActions(mockBoard))

    expect(result.current).toBeDefined()
  })
})
