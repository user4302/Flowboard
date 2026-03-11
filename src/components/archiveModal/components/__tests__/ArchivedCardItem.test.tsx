import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ArchivedCardItem } from '../ArchivedCardItem'

// Mock dependencies
jest.mock('lucide-react', () => ({
  RotateCcw: () => <div data-testid="rotate-ccw-icon">RotateCcw</div>,
  Trash2: () => <div data-testid="trash-icon">Trash2</div>,
  Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
}))

describe('ArchivedCardItem Component', () => {
  const mockArchivedCard = {
    id: 'archived-1',
    title: 'Archived Card 1',
    description: 'This is a test description',
    listId: 'list-1',
    originalListId: 'list-1',
    originalPosition: 0,
    archivedAt: new Date('2023-01-01'),
    card: {
      id: 'card-1',
      title: 'Archived Card 1',
      description: 'This is a test description',
      listId: 'list-1',
      position: 0,
      labelIds: [],
      members: [],
      checklists: [],
      dueDate: undefined,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }

  const mockCurrentBoard = {
    id: 'board-1',
    name: 'Test Board',
    lists: [
      { id: 'list-1', title: 'To Do', position: 0, cards: [] },
      { id: 'list-2', title: 'In Progress', position: 1, cards: [] },
    ],
    members: [],
    labels: [],
    archivedCards: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockOnUnarchive = jest.fn()
  const mockOnPermanentlyDelete = jest.fn()
  const mockFormatDate = jest.fn((date) => 'January 1, 2023')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('should render archived card item', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      expect(screen.getByText('Archived Card 1')).toBeInTheDocument()
      expect(screen.getByText('This is a test description')).toBeInTheDocument()
    })

    it('should render card title', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      expect(screen.getByText('Archived Card 1')).toBeInTheDocument()
    })

    it('should render card description when present', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      expect(screen.getByText('This is a test description')).toBeInTheDocument()
    })

    it('should not render description when absent', () => {
      const cardWithoutDescription = {
        ...mockArchivedCard,
        description: '',
        card: { ...mockArchivedCard.card, description: '' },
      }

      render(
        <ArchivedCardItem
          archivedCard={cardWithoutDescription}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      expect(screen.queryByText('This is a test description')).not.toBeInTheDocument()
    })

    it('should render action buttons', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      expect(screen.getByText('Restore')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })

    it('should render icons', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      expect(screen.getByTestId('rotate-ccw-icon')).toBeInTheDocument()
      expect(screen.getByTestId('trash-icon')).toBeInTheDocument()
      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
    })
  })

  describe('card metadata', () => {
    it('should render archived date', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      expect(screen.getByText('Archived January 1, 2023')).toBeInTheDocument()
      expect(mockFormatDate).toHaveBeenCalledWith(mockArchivedCard.archivedAt)
    })

    it('should render original list name', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      expect(screen.getByText('From: To Do')).toBeInTheDocument()
    })

    it('should render unknown list when list not found', () => {
      const cardFromUnknownList = {
        ...mockArchivedCard,
        originalListId: 'unknown-list',
      }

      render(
        <ArchivedCardItem
          archivedCard={cardFromUnknownList}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      expect(screen.getByText('From: Unknown list')).toBeInTheDocument()
    })
  })

  describe('button interactions', () => {
    it('should call onUnarchive when restore button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      const restoreButton = screen.getByText('Restore')
      await user.click(restoreButton)

      expect(mockOnUnarchive).toHaveBeenCalledWith('archived-1')
    })

    it('should call onPermanentlyDelete when delete button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      const deleteButton = screen.getByText('Delete')
      await user.click(deleteButton)

      expect(mockOnPermanentlyDelete).toHaveBeenCalledWith('archived-1', 'Archived Card 1')
    })
  })

  describe('processing state', () => {
    it('should disable buttons when processing', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={true}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      const restoreButton = screen.getByText('Restore')
      const deleteButton = screen.getByText('Delete')

      expect(restoreButton).toBeDisabled()
      expect(deleteButton).toBeDisabled()
    })

    it('should enable buttons when not processing', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      const restoreButton = screen.getByText('Restore')
      const deleteButton = screen.getByText('Delete')

      expect(restoreButton).not.toBeDisabled()
      expect(deleteButton).not.toBeDisabled()
    })
  })

  describe('component structure', () => {
    it('should have correct container classes', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      const container = document.querySelector('.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg.p-4')
      expect(container).toBeInTheDocument()
    })

    it('should have proper layout structure', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      const flexContainer = document.querySelector('.flex.items-start.justify-between')
      expect(flexContainer).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have accessible button labels', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      expect(screen.getByRole('button', { name: 'RotateCcw Restore' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Trash2 Delete' })).toBeInTheDocument()
    })

    it('should have proper semantic structure', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      expect(screen.getByRole('heading', { name: 'Archived Card 1' })).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle card without currentBoard', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={null as any}
          formatDate={mockFormatDate}
        />
      )

      expect(screen.getByText('From: Unknown list')).toBeInTheDocument()
    })

    it('should handle card with empty lists in currentBoard', () => {
      const boardWithEmptyLists = {
        ...mockCurrentBoard,
        lists: [],
      }

      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={boardWithEmptyLists}
          formatDate={mockFormatDate}
        />
      )

      expect(screen.getByText('From: Unknown list')).toBeInTheDocument()
    })

    it('should render card without crashing', () => {
      render(
        <ArchivedCardItem
          archivedCard={mockArchivedCard}
          onUnarchive={mockOnUnarchive}
          onPermanentlyDelete={mockOnPermanentlyDelete}
          isProcessing={false}
          currentBoard={mockCurrentBoard}
          formatDate={mockFormatDate}
        />
      )

      expect(screen.getByText('Archived Card 1')).toBeInTheDocument()
    })
  })
})
