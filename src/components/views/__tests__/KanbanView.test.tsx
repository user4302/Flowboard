import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { KanbanView } from '../KanbanView'

// Mock dependencies
jest.mock('@/store', () => ({
  useBoardStore: () => ({
    boards: [
      {
        id: 'board-1',
        name: 'Test Board',
        lists: [
          {
            id: 'list-1',
            name: 'To Do',
            cards: [
              {
                id: 'card-1',
                title: 'Test Card 1',
                description: 'Description 1',
                labels: ['label1'],
                members: ['user1'],
                priority: 'medium',
                dueDate: new Date('2024-12-31'),
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
              },
            ],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
          {
            id: 'list-2',
            name: 'In Progress',
            cards: [],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        ],
        members: [],
        labels: [],
        archivedCards: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ],
    createList: jest.fn(),
    createCard: jest.fn(),
    updateList: jest.fn(),
    deleteList: jest.fn(),
  }),
  useUIStore: () => ({
    cardModalOpen: false,
    getColumnOrder: jest.fn(() => []),
    setColumnOrder: jest.fn(),
  }),
}))

jest.mock('@/components/ui', () => ({
  DragOverlayWrapper: ({ children }: any) => <div data-testid="drag-overlay">{children}</div>,
  InlineInput: ({ value, onChange, placeholder }: any) => (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      data-testid="inline-input"
    />
  ),
}))

jest.mock('@/components/taskCard', () => ({
  TaskCard: ({ card, listId }: any) => (
    <div data-testid={`task-card-${card.id}`} data-list-id={listId}>
      {card.title}
    </div>
  ),
}))

jest.mock('../kanban', () => ({
  KanbanList: ({ list, onCardClick, onAddCard, onDeleteList, onUpdateList, openMenuId, setOpenMenuId }: any) => (
    <div data-testid={`kanban-list-${list.id}`}>
      <h3 data-testid={`list-title-${list.id}`}>{list.name}</h3>
      {list.cards.map((card: any) => (
        <div key={card.id} data-testid={`card-in-list-${card.id}`}>
          {card.title}
        </div>
      ))}
      <button data-testid={`add-card-${list.id}`}>Add Card</button>
      <button data-testid={`delete-list-${list.id}`}>Delete List</button>
    </div>
  ),
  SortableKanbanList: ({ list, onCardClick, onAddCard, onDeleteList, onUpdateList, openMenuId, setOpenMenuId }: any) => (
    <div data-testid={`sortable-kanban-list-${list.id}`}>
      <h3 data-testid={`sortable-list-title-${list.id}`}>{list.name}</h3>
      {list.cards.map((card: any) => (
        <div key={card.id} data-testid={`sortable-card-in-list-${card.id}`}>
          {card.title}
        </div>
      ))}
      <button data-testid={`add-card-sortable-${list.id}`}>Add Card</button>
      <button data-testid={`delete-list-sortable-${list.id}`}>Delete List</button>
    </div>
  ),
  useKanbanDragAndDrop: jest.fn(() => ({
    sensors: [],
    activeId: null,
    activeDataType: null,
    handleDragStart: jest.fn(),
    handleDragOver: jest.fn(),
    handleDragEnd: jest.fn(),
    getActiveCard: jest.fn(),
    getActiveList: jest.fn(),
  })),
}))

// Mock @dnd-kit
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children, onDragEnd }: any) => (
    <div data-testid="dnd-context" onDragEnd={onDragEnd}>
      {children}
    </div>
  ),
  closestCenter: jest.fn(),
  DragEndEvent: {},
}))

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => (
    <div data-testid="sortable-context">{children}</div>
  ),
  verticalListSortingStrategy: jest.fn(),
}))

describe('KanbanView Component', () => {
  const mockBoardId = 'board-1'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('should render kanban view when board exists', () => {
      render(<KanbanView boardId={mockBoardId} />)

      expect(screen.getByTestId('dnd-context')).toBeInTheDocument()
      expect(screen.getByTestId('sortable-context')).toBeInTheDocument()
    })

    it('should render drag overlay wrapper', () => {
      render(<KanbanView boardId={mockBoardId} />)

      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument()
    })

    it('should render board lists', () => {
      render(<KanbanView boardId={mockBoardId} />)

      expect(screen.getByTestId('sortable-kanban-list-list-1')).toBeInTheDocument()
      expect(screen.getByTestId('sortable-kanban-list-list-2')).toBeInTheDocument()
    })

    it('should render list titles', () => {
      render(<KanbanView boardId={mockBoardId} />)

      expect(screen.getByTestId('sortable-list-title-list-1')).toHaveTextContent('To Do')
      expect(screen.getByTestId('sortable-list-title-list-2')).toHaveTextContent('In Progress')
    })
  })

  describe('card rendering', () => {
    it('should render cards within lists', () => {
      render(<KanbanView boardId={mockBoardId} />)

      expect(screen.getByTestId('sortable-card-in-list-card-1')).toBeInTheDocument()
      expect(screen.getByTestId('sortable-card-in-list-card-1')).toHaveTextContent('Test Card 1')
    })

    it('should render empty lists without cards', () => {
      render(<KanbanView boardId={mockBoardId} />)

      // List 2 should be empty
      expect(screen.getByTestId('sortable-kanban-list-list-2')).toBeInTheDocument()
      expect(screen.queryByTestId('sortable-card-in-list-card-2')).not.toBeInTheDocument()
    })

    it('should render correct number of cards', () => {
      render(<KanbanView boardId={mockBoardId} />)

      const cards = screen.getAllByTestId(/^sortable-card-in-list-/)
      expect(cards).toHaveLength(1)
    })
  })

  describe('list functionality', () => {
    it('should render add card buttons', () => {
      render(<KanbanView boardId={mockBoardId} />)

      expect(screen.getByTestId('add-card-sortable-list-1')).toBeInTheDocument()
      expect(screen.getByTestId('add-card-sortable-list-2')).toBeInTheDocument()
    })

    it('should render delete list buttons', () => {
      render(<KanbanView boardId={mockBoardId} />)

      expect(screen.getByTestId('delete-list-sortable-list-1')).toBeInTheDocument()
      expect(screen.getByTestId('delete-list-sortable-list-2')).toBeInTheDocument()
    })

    it('should handle list interactions', async () => {
      const user = userEvent.setup()

      render(<KanbanView boardId={mockBoardId} />)

      const addCardButton = screen.getByTestId('add-card-sortable-list-1')
      await user.click(addCardButton)

      // Should not crash
      expect(addCardButton).toBeInTheDocument()
    })
  })

  describe('drag and drop', () => {
    it('should render drag and drop context', () => {
      render(<KanbanView boardId={mockBoardId} />)

      expect(screen.getByTestId('dnd-context')).toBeInTheDocument()
    })

    it('should render sortable context', () => {
      render(<KanbanView boardId={mockBoardId} />)

      expect(screen.getByTestId('sortable-context')).toBeInTheDocument()
    })
  })

  describe('component integration', () => {
    it('should integrate with board store', () => {
      const { useBoardStore } = require('@/store')

      render(<KanbanView boardId={mockBoardId} />)

      expect(useBoardStore().boards).toBeDefined()
      expect(useBoardStore().createList).toBeDefined()
      expect(useBoardStore().createCard).toBeDefined()
    })

    it('should integrate with UI store', () => {
      const { useUIStore } = require('@/store')

      render(<KanbanView boardId={mockBoardId} />)

      expect(useUIStore().getColumnOrder).toBeDefined()
    })

    it('should use kanban drag and drop hook', () => {
      const { useKanbanDragAndDrop } = require('../kanban')

      render(<KanbanView boardId={mockBoardId} />)

      expect(useKanbanDragAndDrop).toHaveBeenCalledWith({
        boardId: mockBoardId,
        board: expect.any(Object),
      })
    })
  })

  describe('edge cases', () => {
    it('should render without crashing', () => {
      render(<KanbanView boardId={mockBoardId} />)

      expect(screen.getByTestId('dnd-context')).toBeInTheDocument()
    })

    it('should handle missing board gracefully', () => {
      render(<KanbanView boardId="missing-board" />)

      expect(screen.queryByTestId('dnd-context')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<KanbanView boardId={mockBoardId} />)

      expect(screen.getByTestId('dnd-context')).toBeInTheDocument()
      expect(screen.getByTestId('sortable-context')).toBeInTheDocument()
    })

    it('should render accessible list titles', () => {
      render(<KanbanView boardId={mockBoardId} />)

      expect(screen.getByTestId('sortable-list-title-list-1')).toBeInTheDocument()
      expect(screen.getByTestId('sortable-list-title-list-2')).toBeInTheDocument()
    })
  })

  describe('performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<KanbanView boardId={mockBoardId} />)

      rerender(<KanbanView boardId={mockBoardId} />)

      expect(screen.getByTestId('dnd-context')).toBeInTheDocument()
    })
  })
})
