import { renderHook, act } from '@testing-library/react'
import { useBoard } from '../useBoard'
import { useBoardStore } from '@/store'
import { useSharingStore } from '@/store/sharingStore'

// Mock the stores
jest.mock('@/store')
jest.mock('@/store/sharingStore')

// Mock store implementations
const mockBoardStore = {
  boards: [] as any[],
  currentBoardId: null as string | null,
  createBoard: jest.fn(),
  createList: jest.fn(),
  createCard: jest.fn(),
  setCurrentBoard: jest.fn(),
}

const mockSharingStore = {
  setUserInfo: jest.fn(),
}

// Setup mocks before each test
beforeEach(() => {
  jest.clearAllMocks()

    // Mock the store hooks
    ; (useBoardStore as unknown as jest.Mock).mockReturnValue(mockBoardStore)
    ; (useSharingStore as unknown as jest.Mock).mockReturnValue(mockSharingStore)
})

describe('useBoard', () => {
  describe('initial state', () => {
    it('should return default values when no boards exist', () => {
      const { result } = renderHook(() => useBoard())

      expect(result.current.boards).toEqual([])
      expect(result.current.currentBoard).toBe(null)
      expect(result.current.currentBoardId).toBe(null)
      expect(typeof result.current.setCurrentBoard).toBe('function')
      expect(typeof result.current.createBoard).toBe('function')
      expect(typeof result.current.createList).toBe('function')
      expect(typeof result.current.createCard).toBe('function')
    })

    it('should return current board when boards exist', () => {
      const mockBoards = [
        { id: 'board1', name: 'Board 1', lists: [], members: [], labels: [], archivedCards: [] }
      ]

      mockBoardStore.boards = mockBoards as any
      mockBoardStore.currentBoardId = 'board1'

      const { result } = renderHook(() => useBoard())

      expect(result.current.currentBoard).toEqual(mockBoards[0])
    })
  })

  describe('board operations', () => {
    it('should provide access to board store functions', () => {
      const { result } = renderHook(() => useBoard())

      // Call the functions and verify they delegate to the store
      act(() => {
        result.current.createBoard('Test Board')
      })

      act(() => {
        result.current.setCurrentBoard('board1')
      })

      expect(mockBoardStore.createBoard).toHaveBeenCalledWith('Test Board')
      expect(mockBoardStore.setCurrentBoard).toHaveBeenCalledWith('board1')
    })

    it('should provide access to list and card creation', () => {
      const { result } = renderHook(() => useBoard())

      act(() => {
        result.current.createList('board1', 'Test List')
      })

      act(() => {
        result.current.createCard('board1', 'list1', 'Test Card')
      })

      expect(mockBoardStore.createList).toHaveBeenCalledWith('board1', 'Test List')
      expect(mockBoardStore.createCard).toHaveBeenCalledWith('board1', 'list1', 'Test Card')
    })
  })

  describe('sharing setup effect', () => {
    it('should set user info when board is loaded', () => {
      const mockBoards = [
        { id: 'board1', name: 'Board 1', lists: [], members: [], labels: [], archivedCards: [] }
      ]

      mockBoardStore.boards = mockBoards as any
      mockBoardStore.currentBoardId = 'board1'

      const { result } = renderHook(() => useBoard())

      // Effect should run after render
      expect(mockSharingStore.setUserInfo).toHaveBeenCalledWith(
        'owner-123',
        'Board Owner',
        'owner@flowboard.app',
        true
      )
    })

    it('should not set user info when no boards exist', () => {
      mockBoardStore.boards = [] as any
      mockBoardStore.currentBoardId = null

      renderHook(() => useBoard())

      expect(mockSharingStore.setUserInfo).not.toHaveBeenCalled()
    })

    it('should not set user info when no current board is selected', () => {
      const mockBoards = [
        { id: 'board1', name: 'Board 1', lists: [], members: [], labels: [], archivedCards: [] }
      ]

      mockBoardStore.boards = mockBoards as any
      mockBoardStore.currentBoardId = null

      renderHook(() => useBoard())

      expect(mockSharingStore.setUserInfo).not.toHaveBeenCalled()
    })

    it('should set user info when current board changes', () => {
      const mockBoards = [
        { id: 'board1', name: 'Board 1', lists: [], members: [], labels: [], archivedCards: [] },
        { id: 'board2', name: 'Board 2', lists: [], members: [], labels: [], archivedCards: [] }
      ]

      mockBoardStore.boards = mockBoards as any

      const { rerender } = renderHook(() => useBoard())

      // Initial render - no current board
      expect(mockSharingStore.setUserInfo).not.toHaveBeenCalled()

      // Update current board
      mockBoardStore.currentBoardId = 'board1'
      rerender()

      expect(mockSharingStore.setUserInfo).toHaveBeenCalledWith(
        'owner-123',
        'Board Owner',
        'owner@flowboard.app',
        true
      )

      // Change to different board
      mockBoardStore.currentBoardId = 'board2'
      mockSharingStore.setUserInfo.mockClear()
      rerender()

      expect(mockSharingStore.setUserInfo).toHaveBeenCalledWith(
        'owner-123',
        'Board Owner',
        'owner@flowboard.app',
        true
      )
    })

    it('should set user info when boards are added', () => {
      mockBoardStore.boards = [] as any
      mockBoardStore.currentBoardId = null

      const { rerender } = renderHook(() => useBoard())

      // Initial render - no boards
      expect(mockSharingStore.setUserInfo).not.toHaveBeenCalled()

      // Add boards and set current board
      const mockBoards = [
        { id: 'board1', name: 'Board 1', lists: [], members: [], labels: [], archivedCards: [] }
      ]
      mockBoardStore.boards = mockBoards as any
      mockBoardStore.currentBoardId = 'board1'
      rerender()

      expect(mockSharingStore.setUserInfo).toHaveBeenCalledWith(
        'owner-123',
        'Board Owner',
        'owner@flowboard.app',
        true
      )
    })
  })

  describe('reactivity', () => {
    it('should update current board when store changes', () => {
      const mockBoards = [
        { id: 'board1', name: 'Board 1', lists: [], members: [], labels: [], archivedCards: [] },
        { id: 'board2', name: 'Board 2', lists: [], members: [], labels: [], archivedCards: [] }
      ]

      mockBoardStore.boards = mockBoards as any
      mockBoardStore.currentBoardId = 'board1'

      const { result, rerender } = renderHook(() => useBoard())

      expect(result.current.currentBoard?.id).toBe('board1')

      // Change current board
      mockBoardStore.currentBoardId = 'board2'
      rerender()

      expect(result.current.currentBoard?.id).toBe('board2')
    })

    it('should return null when current board is not found', () => {
      mockBoardStore.boards = [
        { id: 'board1', name: 'Board 1', lists: [], members: [], labels: [], archivedCards: [] }
      ] as any
      mockBoardStore.currentBoardId = 'non-existent'

      const { result } = renderHook(() => useBoard())

      expect(result.current.currentBoard).toBe(null)
    })
  })

  describe('edge cases', () => {
    it('should handle empty boards array', () => {
      mockBoardStore.boards = [] as any
      mockBoardStore.currentBoardId = 'some-id'

      const { result } = renderHook(() => useBoard())

      expect(result.current.currentBoard).toBe(null)
    })

    it('should handle undefined currentBoardId', () => {
      mockBoardStore.boards = [
        { id: 'board1', name: 'Board 1', lists: [], members: [], labels: [], archivedCards: [] }
      ] as any
      mockBoardStore.currentBoardId = null

      const { result } = renderHook(() => useBoard())

      expect(result.current.currentBoard).toBe(null)
    })

    it('should handle store functions being undefined', () => {
      // Mock store with undefined functions
      ; (useBoardStore as unknown as jest.Mock).mockReturnValue({
        ...mockBoardStore,
        createBoard: undefined,
        createList: undefined,
        createCard: undefined,
        setCurrentBoard: undefined,
      })

      const { result } = renderHook(() => useBoard())

      // The hook should still return the functions (even if undefined)
      expect(result.current.createBoard).toBeUndefined()
      expect(result.current.createList).toBeUndefined()
      expect(result.current.createCard).toBeUndefined()
      expect(result.current.setCurrentBoard).toBeUndefined()
    })
  })

  describe('integration with stores', () => {
    it('should call store functions with correct parameters', () => {
      const { result } = renderHook(() => useBoard())

      act(() => {
        result.current.createBoard('New Board')
      })

      act(() => {
        result.current.createList('board1', 'New List', 0)
      })

      act(() => {
        result.current.createCard('board1', 'list1', 'New Card', 0)
      })

      act(() => {
        result.current.setCurrentBoard('board2')
      })

      expect(mockBoardStore.createBoard).toHaveBeenCalledWith('New Board')
      expect(mockBoardStore.createList).toHaveBeenCalledWith('board1', 'New List', 0)
      expect(mockBoardStore.createCard).toHaveBeenCalledWith('board1', 'list1', 'New Card', 0)
      expect(mockBoardStore.setCurrentBoard).toHaveBeenCalledWith('board2')
    })
  })
})
