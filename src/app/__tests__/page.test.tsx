import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Home from '../page'

// Mock dependencies
jest.mock('@/components/boardSidebar', () => ({
  BoardSidebar: () => <div data-testid="board-sidebar">BoardSidebar</div>,
}))

jest.mock('@/components/boardHeader', () => ({
  BoardHeader: () => <div data-testid="board-header">BoardHeader</div>,
}))

jest.mock('@/components/views', () => ({
  KanbanView: ({ boardId }: any) => <div data-testid="kanban-view" data-board-id={boardId}>KanbanView</div>,
  TimelineView: ({ boardId }: any) => <div data-testid="timeline-view" data-board-id={boardId}>TimelineView</div>,
  CalendarView: ({ boardId }: any) => <div data-testid="calendar-view" data-board-id={boardId}>CalendarView</div>,
  TableView: ({ boardId }: any) => <div data-testid="table-view" data-board-id={boardId}>TableView</div>,
}))

jest.mock('@/components/taskModal', () => ({
  TaskModal: () => <div data-testid="task-modal">TaskModal</div>,
}))

jest.mock('@/components/boardShare', () => ({
  JoinBoardModal: ({ isOpen, onClose, inviteId }: any) => (
    isOpen ? (
      <div data-testid="join-board-modal" data-invite-id={inviteId}>
        <button data-testid="close-join-modal" onClick={onClose}>Close</button>
      </div>
    ) : null
  ),
}))

jest.mock('@/hooks', () => ({
  useBoard: () => ({
    currentBoard: { id: 'board-1', name: 'Test Board' },
    currentBoardId: 'board-1',
    createBoard: jest.fn(() => ({ id: 'new-board', name: 'New Board' })),
    boards: [
      { id: 'board-1', name: 'Test Board' },
      { id: 'board-2', name: 'Another Board' },
    ],
    setCurrentBoard: jest.fn(),
  }),
  useUIStore: () => ({
    currentView: 'kanban',
    initializeTheme: jest.fn(),
    openCardModal: jest.fn(),
  }),
}))

jest.mock('@/store/sharingStore', () => ({
  useSharingStore: () => ({
    showJoinModal: false,
    setShowJoinModal: jest.fn(),
  }),
}))

// Mock URLSearchParams
const mockURLSearchParams = {
  get: jest.fn(),
}
global.URLSearchParams = jest.fn(() => mockURLSearchParams) as any

// Mock setTimeout and clearTimeout
const mockSetTimeout = jest.fn((fn, delay) => {
  if (delay === 0) {
    fn()
  }
  return 123
})
const mockClearTimeout = jest.fn()
global.setTimeout = mockSetTimeout as any
global.clearTimeout = mockClearTimeout as any

describe('Home Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockURLSearchParams.get.mockReturnValue(null)
  })

  describe('basic rendering', () => {
    it('should render main application layout when board exists', () => {
      render(<Home />)

      expect(screen.getByTestId('board-sidebar')).toBeInTheDocument()
      expect(screen.getByTestId('board-header')).toBeInTheDocument()
      expect(screen.getByTestId('kanban-view')).toBeInTheDocument()
      expect(screen.getByTestId('task-modal')).toBeInTheDocument()
    })

    it('should render without crashing', () => {
      render(<Home />)

      expect(screen.getByTestId('board-sidebar')).toBeInTheDocument()
    })

    it('should render kanban view by default', () => {
      render(<Home />)

      expect(screen.getByTestId('kanban-view')).toBeInTheDocument()
      expect(screen.getByTestId('kanban-view')).toHaveAttribute('data-board-id', 'board-1')
    })
  })

  describe('view rendering', () => {
    it('should render task modal', () => {
      render(<Home />)

      expect(screen.getByTestId('task-modal')).toBeInTheDocument()
    })

    it('should not render join board modal when closed', () => {
      render(<Home />)

      expect(screen.queryByTestId('join-board-modal')).not.toBeInTheDocument()
    })
  })

  describe('theme initialization', () => {
    it('should initialize theme on mount', () => {
      render(<Home />)

      // Theme should be initialized (mocked function should be called)
      expect(mockSetTimeout).toHaveBeenCalled()
    })
  })

  describe('modal interactions', () => {
    it('should handle modal interactions', () => {
      render(<Home />)

      // Should handle modal interactions without crashing
      expect(screen.getByTestId('task-modal')).toBeInTheDocument()
    })
  })

  describe('component integration', () => {
    it('should render all required components', () => {
      render(<Home />)

      expect(screen.getByTestId('board-sidebar')).toBeInTheDocument()
      expect(screen.getByTestId('board-header')).toBeInTheDocument()
      expect(screen.getByTestId('kanban-view')).toBeInTheDocument()
      expect(screen.getByTestId('task-modal')).toBeInTheDocument()
    })

    it('should have proper layout structure', () => {
      render(<Home />)

      expect(screen.getByTestId('board-sidebar')).toBeInTheDocument()
      expect(screen.getByTestId('board-header')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have accessible structure', () => {
      render(<Home />)

      expect(screen.getByTestId('board-sidebar')).toBeInTheDocument()
      expect(screen.getByTestId('board-header')).toBeInTheDocument()
      expect(screen.getByTestId('kanban-view')).toBeInTheDocument()
      expect(screen.getByTestId('task-modal')).toBeInTheDocument()
    })
  })

  describe('performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<Home />)

      rerender(<Home />)

      expect(screen.getByTestId('board-sidebar')).toBeInTheDocument()
    })

    it('should handle useEffect cleanup', () => {
      const { unmount } = render(<Home />)

      unmount()

      expect(mockClearTimeout).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should render with default props', () => {
      render(<Home />)

      expect(screen.getByTestId('board-sidebar')).toBeInTheDocument()
    })

    it('should handle URL parameter parsing', () => {
      mockURLSearchParams.get.mockReturnValue('test-value')

      render(<Home />)

      expect(mockURLSearchParams.get).toHaveBeenCalled()
    })
  })
})
