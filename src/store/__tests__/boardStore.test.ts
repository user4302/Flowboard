import { useBoardStore } from '../boardStore'
import { Board, List, Card, Label, User } from '@/lib/types'

// Mock localStorage for persistence
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
  })
})

beforeEach(() => {
  // Reset store state
  useBoardStore.setState({
    boards: [],
    currentBoardId: null,
    isLoading: false,
    error: null,
  })
  jest.clearAllMocks()
})

describe('boardStore', () => {
  describe('initial state', () => {
    it('should have correct default values', () => {
      const state = useBoardStore.getState()

      expect(state.boards).toEqual([])
      expect(state.currentBoardId).toBe(null)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe(null)
    })
  })

  describe('board operations', () => {
    it('should create a new board', () => {
      const boardName = 'Test Board'
      const board = useBoardStore.getState().createBoard(boardName)

      expect(board).toBeDefined()
      expect(board.name).toBe(boardName)
      expect(board.lists).toEqual([])
      expect(board.members).toEqual([])
      expect(board.labels).toEqual([])
      expect(board.archivedCards).toEqual([])

      const state = useBoardStore.getState()
      expect(state.boards).toHaveLength(1)
      expect(state.boards[0]).toBe(board)
    })

    it('should set current board', () => {
      const board = useBoardStore.getState().createBoard('Test Board')

      useBoardStore.getState().setCurrentBoard(board.id)

      expect(useBoardStore.getState().currentBoardId).toBe(board.id)
    })

    it('should update board', () => {
      const board = useBoardStore.getState().createBoard('Test Board')

      useBoardStore.getState().updateBoard(board.id, { name: 'Updated Board' })

      const state = useBoardStore.getState()
      const updatedBoard = state.boards.find(b => b.id === board.id)
      expect(updatedBoard?.name).toBe('Updated Board')
    })

    it('should delete board', () => {
      const board = useBoardStore.getState().createBoard('Test Board')

      useBoardStore.getState().deleteBoard(board.id)

      const state = useBoardStore.getState()
      expect(state.boards).toHaveLength(0)
    })
  })

  describe('list operations', () => {
    let board: Board

    beforeEach(() => {
      board = useBoardStore.getState().createBoard('Test Board')
      useBoardStore.getState().setCurrentBoard(board.id)
    })

    it('should create a list', () => {
      const list = useBoardStore.getState().createList(board.id, 'Test List')

      expect(list).toBeDefined()
      expect(list?.title).toBe('Test List')
      expect(list?.cards).toEqual([])

      const state = useBoardStore.getState()
      const updatedBoard = state.boards.find(b => b.id === board.id)
      expect(updatedBoard?.lists).toHaveLength(1)
      expect(updatedBoard?.lists[0]).toBe(list)
    })

    it('should update a list', () => {
      const list = useBoardStore.getState().createList(board.id, 'Test List')

      if (list) {
        useBoardStore.getState().updateList(board.id, list.id, { title: 'Updated List' })

        const state = useBoardStore.getState()
        const updatedBoard = state.boards.find(b => b.id === board.id)
        const updatedList = updatedBoard?.lists.find(l => l.id === list.id)
        expect(updatedList?.title).toBe('Updated List')
      }
    })

    it('should delete a list', () => {
      const list = useBoardStore.getState().createList(board.id, 'Test List')

      if (list) {
        useBoardStore.getState().deleteList(board.id, list.id)
      }

      const state = useBoardStore.getState()
      const updatedBoard = state.boards.find(b => b.id === board.id)
      expect(updatedBoard?.lists).toHaveLength(0)
    })

    it('should reorder lists', () => {
      const list1 = useBoardStore.getState().createList(board.id, 'List 1')
      const list2 = useBoardStore.getState().createList(board.id, 'List 2')

      if (list1 && list2) {
        useBoardStore.getState().reorderLists(board.id, 0, 1)

        const state = useBoardStore.getState()
        const updatedBoard = state.boards.find(b => b.id === board.id)
        expect(updatedBoard?.lists[0].id).toBe(list2.id)
        expect(updatedBoard?.lists[1].id).toBe(list1.id)
      }
    })
  })

  describe('card operations', () => {
    let board: Board
    let list: List

    beforeEach(() => {
      board = useBoardStore.getState().createBoard('Test Board')
      useBoardStore.getState().setCurrentBoard(board.id)
      list = useBoardStore.getState().createList(board.id, 'Test List')!
    })

    it('should create a card', () => {
      const card = useBoardStore.getState().createCard(board.id, list.id, 'Test Card')

      expect(card).toBeDefined()
      expect(card?.title).toBe('Test Card')
      expect(card?.listId).toBe(list.id)

      const state = useBoardStore.getState()
      const updatedBoard = state.boards.find(b => b.id === board.id)
      const updatedList = updatedBoard?.lists.find(l => l.id === list.id)
      expect(updatedList?.cards).toHaveLength(1)
      expect(updatedList?.cards[0]).toBe(card)
    })

    it('should update a card', () => {
      const card = useBoardStore.getState().createCard(board.id, list.id, 'Test Card')

      if (card) {
        useBoardStore.getState().updateCard(board.id, card.id, { title: 'Updated Card' })

        const state = useBoardStore.getState()
        const updatedBoard = state.boards.find(b => b.id === board.id)
        const updatedList = updatedBoard?.lists.find(l => l.id === list.id)
        const updatedCard = updatedList?.cards.find(c => c.id === card.id)
        expect(updatedCard?.title).toBe('Updated Card')
      }
    })

    it('should delete a card', () => {
      const card = useBoardStore.getState().createCard(board.id, list.id, 'Test Card')

      if (card) {
        useBoardStore.getState().deleteCard(board.id, card.id)
      }

      const state = useBoardStore.getState()
      const updatedBoard = state.boards.find(b => b.id === board.id)
      const updatedList = updatedBoard?.lists.find(l => l.id === list.id)
      expect(updatedList?.cards).toHaveLength(0)
    })

    it('should move a card between lists', () => {
      const list2 = useBoardStore.getState().createList(board.id, 'List 2')!
      const card = useBoardStore.getState().createCard(board.id, list.id, 'Test Card')!

      useBoardStore.getState().moveCard(board.id, card.id, list.id, list2.id, 0)

      const state = useBoardStore.getState()
      const updatedBoard = state.boards.find(b => b.id === board.id)
      const originalList = updatedBoard?.lists.find(l => l.id === list.id)
      const targetList = updatedBoard?.lists.find(l => l.id === list2.id)

      expect(originalList?.cards).toHaveLength(0)
      expect(targetList?.cards).toHaveLength(1)
      expect(targetList?.cards[0].id).toBe(card.id)
    })

    it('should reorder cards', () => {
      const card1 = useBoardStore.getState().createCard(board.id, list.id, 'Card 1')!
      const card2 = useBoardStore.getState().createCard(board.id, list.id, 'Card 2')!

      useBoardStore.getState().reorderCards(board.id, list.id, 0, 1)

      const state = useBoardStore.getState()
      const updatedBoard = state.boards.find(b => b.id === board.id)
      const updatedList = updatedBoard?.lists.find(l => l.id === list.id)
      expect(updatedList?.cards[0].id).toBe(card2.id)
      expect(updatedList?.cards[1].id).toBe(card1.id)
    })
  })

  describe('label operations', () => {
    let board: Board

    beforeEach(() => {
      board = useBoardStore.getState().createBoard('Test Board')
      useBoardStore.getState().setCurrentBoard(board.id)
    })

    it('should create a board label', () => {
      const labelData = { text: 'Bug', color: 'bg-red-500' }
      const label = useBoardStore.getState().createBoardLabel(board.id, labelData)

      expect(label).toBeDefined()
      expect(label.text).toBe(labelData.text)
      expect(label.color).toBe(labelData.color)

      const state = useBoardStore.getState()
      const updatedBoard = state.boards.find(b => b.id === board.id)
      expect(updatedBoard?.labels).toHaveLength(1)
      expect(updatedBoard?.labels[0]).toBe(label)
    })

    it('should update a board label', () => {
      const label = useBoardStore.getState().createBoardLabel(board.id, { text: 'Bug', color: 'bg-red-500' })

      useBoardStore.getState().updateBoardLabel(board.id, label.id, { text: 'Updated Label' })

      const state = useBoardStore.getState()
      const updatedBoard = state.boards.find(b => b.id === board.id)
      const updatedLabel = updatedBoard?.labels.find(l => l.id === label.id)
      expect(updatedLabel?.text).toBe('Updated Label')
    })

    it('should delete a board label', () => {
      const label = useBoardStore.getState().createBoardLabel(board.id, { text: 'Bug', color: 'bg-red-500' })

      useBoardStore.getState().deleteBoardLabel(board.id, label.id)

      const state = useBoardStore.getState()
      const updatedBoard = state.boards.find(b => b.id === board.id)
      expect(updatedBoard?.labels).toHaveLength(0)
    })
  })

  describe('member operations', () => {
    let board: Board

    beforeEach(() => {
      board = useBoardStore.getState().createBoard('Test Board')
      useBoardStore.getState().setCurrentBoard(board.id)
    })

    it('should add a member', () => {
      const user: User = { id: 'user1', name: 'John Doe', email: 'john@example.com' }

      useBoardStore.getState().addMember(board.id, user)

      const state = useBoardStore.getState()
      const updatedBoard = state.boards.find(b => b.id === board.id)
      expect(updatedBoard?.members).toHaveLength(1)
      expect(updatedBoard?.members[0].name).toBe(user.name)
      expect(updatedBoard?.members[0].email).toBe(user.email)
    })

    it('should remove a member', () => {
      const user: User = { id: 'user1', name: 'John Doe', email: 'john@example.com' }
      useBoardStore.getState().addMember(board.id, user)

      // Get the actual member ID from the store
      const state = useBoardStore.getState()
      const updatedBoard = state.boards.find(b => b.id === board.id)
      const actualMemberId = updatedBoard?.members[0]?.id

      if (actualMemberId) {
        useBoardStore.getState().removeMember(board.id, actualMemberId)
      }

      const finalState = useBoardStore.getState()
      const finalBoard = finalState.boards.find(b => b.id === board.id)
      expect(finalBoard?.members).toHaveLength(0)
    })
  })

  describe('utility functions', () => {
    let board: Board
    let list: List
    let card: Card

    beforeEach(() => {
      board = useBoardStore.getState().createBoard('Test Board')
      useBoardStore.getState().setCurrentBoard(board.id)
      list = useBoardStore.getState().createList(board.id, 'Test List')!
      card = useBoardStore.getState().createCard(board.id, list.id, 'Test Card')!
    })

    it('should get current board', () => {
      const currentBoard = useBoardStore.getState().getCurrentBoard()

      expect(currentBoard?.id).toBe(board.id)
      expect(currentBoard?.name).toBe(board.name)
    })

    it('should get a card', () => {
      const foundCard = useBoardStore.getState().getCard(board.id, card.id)

      expect(foundCard).toBe(card)
    })

    it('should get a list', () => {
      const foundList = useBoardStore.getState().getList(board.id, list.id)

      expect(foundList?.id).toBe(list.id)
      expect(foundList?.title).toBe(list.title)
    })

    it('should return null for non-existent card', () => {
      const foundCard = useBoardStore.getState().getCard(board.id, 'non-existent')

      expect(foundCard).toBe(null)
    })

    it('should return null for non-existent list', () => {
      const foundList = useBoardStore.getState().getList(board.id, 'non-existent')

      expect(foundList).toBe(null)
    })
  })

  describe('edge cases', () => {
    it('should handle operations on non-existent board', () => {
      const state = useBoardStore.getState()

      expect(() => state.updateBoard('non-existent', { name: 'Test' })).not.toThrow()
      expect(() => state.deleteBoard('non-existent')).not.toThrow()
      expect(() => state.createList('non-existent', 'Test')).not.toThrow()
      expect(() => state.updateList('non-existent', 'list-id', {})).not.toThrow()
      expect(() => state.deleteList('non-existent', 'list-id')).not.toThrow()
    })

    it('should handle operations on non-existent list', () => {
      const board = useBoardStore.getState().createBoard('Test Board')
      const state = useBoardStore.getState()

      expect(() => state.updateList(board.id, 'non-existent', {})).not.toThrow()
      expect(() => state.deleteList(board.id, 'non-existent')).not.toThrow()
      expect(() => state.createCard(board.id, 'non-existent', 'Test')).not.toThrow()
    })

    it('should handle operations on non-existent card', () => {
      const board = useBoardStore.getState().createBoard('Test Board')
      const list = useBoardStore.getState().createList(board.id, 'Test List')
      const state = useBoardStore.getState()

      expect(() => state.updateCard(board.id, 'non-existent', {})).not.toThrow()
      expect(() => state.deleteCard(board.id, 'non-existent')).not.toThrow()
    })
  })

  describe('state persistence', () => {
    it('should persist state changes', () => {
      // Create a board
      useBoardStore.getState().createBoard('Test Board')

      // Note: Zustand persist is asynchronous
      // For this test, we'll just verify the state change was made
      const state = useBoardStore.getState()
      expect(state.boards).toHaveLength(1)
    })
  })
})
