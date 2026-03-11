import { renderHook } from '@testing-library/react'
import { useKanbanDragAndDrop } from '../useKanbanDragAndDrop'
import { Board, List, Card } from '@/lib/types'

describe('useKanbanDragAndDrop', () => {
  const createMockCard = (overrides: Partial<Card> = {}): Card => ({
    id: 'card1',
    title: 'Test Card',
    labelIds: [],
    members: [],
    checklists: [],
    completed: false,
    position: 0,
    listId: 'list1',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  })

  const createMockList = (overrides: Partial<List> = {}): List => ({
    id: 'list1',
    title: 'Test List',
    cards: [],
    position: 0,
    ...overrides
  })

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

  it('should export useKanbanDragAndDrop hook', () => {
    expect(typeof useKanbanDragAndDrop).toBe('function')
  })

  it('should return drag and drop handlers for valid board', () => {
    const mockBoard = createMockBoard({
      lists: [createMockList()]
    })
    
    const { result } = renderHook(() => 
      useKanbanDragAndDrop({ boardId: 'board1', board: mockBoard })
    )
    
    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe('object')
  })

  it('should handle empty board', () => {
    const mockBoard = createMockBoard()
    
    const { result } = renderHook(() => 
      useKanbanDragAndDrop({ boardId: 'board1', board: mockBoard })
    )
    
    expect(result.current).toBeDefined()
  })

  it('should handle board with multiple lists', () => {
    const mockBoard = createMockBoard({
      lists: [
        createMockList({ id: 'list1', title: 'List 1' }),
        createMockList({ id: 'list2', title: 'List 2' })
      ]
    })
    
    const { result } = renderHook(() => 
      useKanbanDragAndDrop({ boardId: 'board1', board: mockBoard })
    )
    
    expect(result.current).toBeDefined()
  })

  it('should handle board with cards', () => {
    const mockCard = createMockCard()
    const mockBoard = createMockBoard({
      lists: [
        createMockList({ 
          id: 'list1', 
          cards: [mockCard] 
        })
      ]
    })
    
    const { result } = renderHook(() => 
      useKanbanDragAndDrop({ boardId: 'board1', board: mockBoard })
    )
    
    expect(result.current).toBeDefined()
  })
})
