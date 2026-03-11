import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TaskCard } from '../TaskCard'
import { Card, User } from '@/lib/types'

// Mock dependencies
jest.mock('@/store', () => ({
  useBoardStore: () => ({
    boards: [
      {
        id: 'board-1',
        name: 'Test Board',
        lists: [],
        members: [],
        labels: [
          { id: 'label-1', text: 'Bug', color: 'bg-red-500' },
          { id: 'label-2', text: 'Feature', color: 'bg-blue-500' },
        ],
        archivedCards: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    currentBoardId: 'board-1',
  }),
}))

jest.mock('@/components/taskModal/hooks/useTaskModalActions', () => ({
  useTaskModalActions: () => ({
    handleCardClick: jest.fn(),
    handleToggleCompleted: jest.fn(),
  }),
}))

jest.mock('../hooks/useCardContextMenu', () => ({
  useCardContextMenu: () => ({
    isOpen: false,
    position: { x: 0, y: 0 },
    handleContextMenu: jest.fn(),
    handleButtonClick: jest.fn(),
    closeContextMenu: jest.fn(),
  }),
}))

jest.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}))

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Translate: {
      toString: jest.fn(() => ''),
    },
  },
}))

jest.mock('../utils', () => ({
  getCardMembers: jest.fn((card, members) => members.filter((m: User) => card.members?.includes(m.id))),
  getCardMetadata: jest.fn((card) => ({
    isOverdue: false,
    checklistProgress: { completed: 1, total: 3 },
  })),
  getCardClasses: jest.fn(() => 'mock-card-class'),
  getCardTitleClasses: jest.fn(() => 'mock-title-class'),
}))

jest.mock('../components/TaskCardCardLabels', () => ({
  TaskCardCardLabels: ({ labelIds, labels }: any) => (
    <div data-testid="card-labels">
      {labelIds.map((id: string) => {
        const label = labels.find((l: any) => l.id === id)
        return label ? <span key={id}>{label.text}</span> : null
      })}
    </div>
  ),
}))

jest.mock('../components/TaskCardCardMembers', () => ({
  TaskCardCardMembers: ({ members }: any) => (
    <div data-testid="card-members">
      {members.map((m: User) => (
        <span key={m.id} data-testid={`member-${m.id}`}>
          {m.name}
        </span>
      ))}
    </div>
  ),
}))

jest.mock('../components/TaskCardCardMeta', () => ({
  TaskCardCardMeta: ({ card, isOverdue, checklistProgress }: any) => (
    <div data-testid="card-meta">
      <span data-testid="due-date">{card.dueDate?.toString()}</span>
      <span data-testid="checklist-progress">
        {checklistProgress.completed}/{checklistProgress.total}
      </span>
    </div>
  ),
}))

jest.mock('../components/TaskCardCardCompletion', () => ({
  TaskCardCardCompletion: ({ completed, onToggle }: any) => (
    <button
      data-testid="completion-toggle"
      onClick={onToggle}
      data-completed={completed}
    >
      {completed ? '✓' : '○'}
    </button>
  ),
}))

jest.mock('../components/contextMenu/CardContextMenu', () => ({
  CardContextMenu: ({ card, isOpen, onClose, position }: any) => (
    isOpen ? (
      <div data-testid="context-menu" style={{ left: position.x, top: position.y }}>
        Context Menu for {card.title}
      </div>
    ) : null
  ),
}))

jest.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon">User</div>,
  MoreHorizontal: () => <div data-testid="more-icon">More</div>,
}))

describe('TaskCard Component', () => {
  const mockCard: Card = {
    id: 'card-1',
    title: 'Test Card',
    description: 'Test description',
    listId: 'list-1',
    labelIds: ['label-1'],
    members: ['user-1'],
    completed: false,
    dueDate: new Date('2024-01-15'),
    checklists: [],
    position: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  }

  const mockMembers: User[] = [
    { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
    { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' },
  ]

  const mockOnClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('should render card with title', () => {
      render(<TaskCard card={mockCard} members={mockMembers} onClick={mockOnClick} />)

      expect(screen.getByText('Test Card')).toBeInTheDocument()
    })

    it('should render description when provided', () => {
      render(<TaskCard card={mockCard} members={mockMembers} onClick={mockOnClick} />)

      expect(screen.getByText('Test description')).toBeInTheDocument()
    })

    it('should not render description when not provided', () => {
      const cardWithoutDesc = { ...mockCard, description: undefined }

      render(<TaskCard card={cardWithoutDesc} members={mockMembers} onClick={mockOnClick} />)

      expect(screen.queryByText('Test description')).not.toBeInTheDocument()
    })

    it('should render labels', () => {
      render(<TaskCard card={mockCard} members={mockMembers} onClick={mockOnClick} />)

      expect(screen.getByTestId('card-labels')).toBeInTheDocument()
      expect(screen.getByText('Bug')).toBeInTheDocument()
    })

    it('should render members', () => {
      render(<TaskCard card={mockCard} members={mockMembers} onClick={mockOnClick} />)

      expect(screen.getByTestId('card-members')).toBeInTheDocument()
      expect(screen.getByTestId('member-user-1')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should render completion toggle', () => {
      render(<TaskCard card={mockCard} members={mockMembers} onClick={mockOnClick} />)

      const toggle = screen.getByTestId('completion-toggle')
      expect(toggle).toBeInTheDocument()
      expect(toggle).toHaveAttribute('data-completed', 'false')
    })

    it('should render meta information', () => {
      render(<TaskCard card={mockCard} members={mockMembers} onClick={mockOnClick} />)

      expect(screen.getByTestId('card-meta')).toBeInTheDocument()
      expect(screen.getByTestId('due-date')).toBeInTheDocument()
      expect(screen.getByTestId('checklist-progress')).toHaveTextContent('1/3')
    })
  })

  describe('card states', () => {
    it('should render completed card', () => {
      const completedCard = { ...mockCard, completed: true }

      render(<TaskCard card={completedCard} members={mockMembers} onClick={mockOnClick} />)

      const toggle = screen.getByTestId('completion-toggle')
      expect(toggle).toHaveAttribute('data-completed', 'true')
    })

    it('should render card without labels', () => {
      const cardWithoutLabels = { ...mockCard, labelIds: [] }

      render(<TaskCard card={cardWithoutLabels} members={mockMembers} onClick={mockOnClick} />)

      expect(screen.getByTestId('card-labels')).toBeInTheDocument()
      expect(screen.queryByText('Bug')).not.toBeInTheDocument()
    })

    it('should render card without members', () => {
      const cardWithoutMembers = { ...mockCard, members: [] }

      render(<TaskCard card={cardWithoutMembers} members={mockMembers} onClick={mockOnClick} />)

      expect(screen.getByTestId('card-members')).toBeInTheDocument()
      expect(screen.queryByTestId('member-user-1')).not.toBeInTheDocument()
    })
  })

  describe('hover actions', () => {
    it('should show member count when members exist', () => {
      render(<TaskCard card={mockCard} members={mockMembers} onClick={mockOnClick} />)

      expect(screen.getByTestId('user-icon')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('should not show member count when no members', () => {
      const cardWithoutMembers = { ...mockCard, members: [] }

      render(<TaskCard card={cardWithoutMembers} members={mockMembers} onClick={mockOnClick} />)

      expect(screen.queryByTestId('user-icon')).not.toBeInTheDocument()
      expect(screen.queryByText('1')).not.toBeInTheDocument()
    })

    it('should render more button', () => {
      render(<TaskCard card={mockCard} members={mockMembers} onClick={mockOnClick} />)

      expect(screen.getByTestId('more-icon')).toBeInTheDocument()
    })
  })

  describe('drag and drop', () => {
    it('should apply transform styles', () => {
      const { CSS } = require('@dnd-kit/utilities')

      render(<TaskCard card={mockCard} members={mockMembers} onClick={mockOnClick} />)

      expect(CSS.Translate.toString).toHaveBeenCalled()
    })
  })

  describe('utility functions integration', () => {
    it('should call getCardMembers with correct parameters', () => {
      const { getCardMembers } = require('../utils')

      render(<TaskCard card={mockCard} members={mockMembers} onClick={mockOnClick} />)

      expect(getCardMembers).toHaveBeenCalledWith(mockCard, mockMembers)
    })

    it('should call getCardMetadata with correct parameters', () => {
      const { getCardMetadata } = require('../utils')

      render(<TaskCard card={mockCard} members={mockMembers} onClick={mockOnClick} />)

      expect(getCardMetadata).toHaveBeenCalledWith(mockCard)
    })

    it('should call getCardClasses with correct parameters', () => {
      const { getCardClasses } = require('../utils')

      render(<TaskCard card={mockCard} members={mockMembers} onClick={mockOnClick} />)

      expect(getCardClasses).toHaveBeenCalledWith(false, false, false)
    })

    it('should call getCardTitleClasses with correct parameters', () => {
      const { getCardTitleClasses } = require('../utils')

      render(<TaskCard card={mockCard} members={mockMembers} onClick={mockOnClick} />)

      expect(getCardTitleClasses).toHaveBeenCalledWith(false)
    })
  })

  describe('edge cases', () => {
    it('should handle empty members array', () => {
      render(<TaskCard card={mockCard} members={[]} onClick={mockOnClick} />)

      expect(screen.getByTestId('card-members')).toBeInTheDocument()
      expect(screen.queryByTestId('member-user-1')).not.toBeInTheDocument()
    })

    it('should handle card with no labels', () => {
      const cardWithoutLabels = { ...mockCard, labelIds: [] }

      render(<TaskCard card={cardWithoutLabels} members={mockMembers} onClick={mockOnClick} />)

      expect(screen.getByTestId('card-labels')).toBeInTheDocument()
      expect(screen.queryByText('Bug')).not.toBeInTheDocument()
    })

    it('should handle card with multiple labels', () => {
      const cardWithMultipleLabels = { ...mockCard, labelIds: ['label-1', 'label-2'] }

      render(<TaskCard card={cardWithMultipleLabels} members={mockMembers} onClick={mockOnClick} />)

      expect(screen.getByText('Bug')).toBeInTheDocument()
      expect(screen.getByText('Feature')).toBeInTheDocument()
    })

    it('should handle card with multiple members', () => {
      const cardWithMultipleMembers = { ...mockCard, members: ['user-1', 'user-2'] }

      render(<TaskCard card={cardWithMultipleMembers} members={mockMembers} onClick={mockOnClick} />)

      expect(screen.getByTestId('member-user-1')).toBeInTheDocument()
      expect(screen.getByTestId('member-user-2')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })
})
