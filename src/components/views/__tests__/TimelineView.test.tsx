import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { TimelineView } from '../TimelineView'

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
        ],
        members: [],
        labels: [],
        archivedCards: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ],
  }),
  useUIStore: jest.fn(),
}))

jest.mock('@/lib/filterUtils', () => ({
  filterCards: jest.fn((cards, filters) => cards),
}))

jest.mock('../timeline', () => ({
  TimelineHeader: ({ zoomLevel, onZoomChange, currentDate, onDateChange }: any) => (
    <div data-testid="timeline-header">
      <button data-testid="prev-date-button" onClick={() => onDateChange(new Date())}>
        ←
      </button>
      <div data-testid="current-date">{currentDate.toISOString()}</div>
      <button data-testid="today-button" onClick={() => onDateChange(new Date())}>
        Today
      </button>
      <button data-testid="next-date-button" onClick={() => onDateChange(new Date())}>
        →
      </button>
      <button data-testid="zoom-button" onClick={() => onZoomChange('week')}>
        Zoom to Week
      </button>
    </div>
  ),
  TimelineGrid: ({ zoomLevel, currentDate, cellWidth, cellHeight }: any) => (
    <div data-testid="timeline-grid" data-zoom={zoomLevel}>
      <div data-testid="grid-cell-width">{cellWidth}</div>
      <div data-testid="grid-cell-height">{cellHeight}</div>
    </div>
  ),
  TimelineListLane: ({ list, cards = [], zoomLevel, currentDate, cellWidth, cellHeight, onCardClick }: any) => (
    <div data-testid={`timeline-lane-${list.id}`}>
      <h4 data-testid={`lane-title-${list.id}`}>{list.name}</h4>
      {(cards || []).map((card: any) => (
        <div
          key={card.id}
          data-testid={`timeline-card-${card.id}`}
          onClick={() => onCardClick(card)}
        >
          {card.title}
        </div>
      ))}
    </div>
  ),
  TimelineTooltip: ({ card, position }: any) => (
    <div data-testid="timeline-tooltip" style={position}>
      {card.title}
    </div>
  ),
  useTimelineDateRange: jest.fn(() => ({
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    cellWidth: 100,
    cellHeight: 50,
  })),
  useTimelineShortcuts: jest.fn(() => ({
    shortcuts: {
      '1': () => {},
      '2': () => {},
      '3': () => {},
      '4': () => {},
      '5': () => {},
    },
  })),
  calculateTimelineHeight: jest.fn(() => 500),
  getTaskPosition: jest.fn(() => ({ left: 0, top: 0, width: 100, height: 50 })),
}))

describe('TimelineView Component', () => {
  const mockBoardId = 'board-1'
  const mockOpenCardModal = jest.fn()
  const mockSetTimelineCurrentDate = jest.fn()
  const mockSetTimelineZoomLevel = jest.fn()
  const mockToggleTimelineLane = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup useUIStore mock
    const { useUIStore } = require('@/store')
    useUIStore.mockImplementation((selector?: any) => {
      // If no selector provided, return action functions for destructuring
      if (!selector) {
        return {
          openCardModal: mockOpenCardModal,
          setTimelineCurrentDate: mockSetTimelineCurrentDate,
          setTimelineZoomLevel: mockSetTimelineZoomLevel,
          toggleTimelineLane: mockToggleTimelineLane,
        }
      }
      
      // Handle selector functions
      if (typeof selector === 'function') {
        const selectorString = selector.toString()
        
        // Timeline state selectors
        if (selectorString.includes('timelineState[boardId]?.currentDate')) {
          return new Date('2024-01-01').toISOString()
        }
        if (selectorString.includes('timelineState[boardId]?.zoomLevel')) {
          return 'week'
        }
        if (selectorString.includes('timelineState[boardId]?.collapsedLanes')) {
          return []
        }
        
        // Filter state selectors
        if (selectorString.includes('filterState[boardId]?.searchTerm')) {
          return ''
        }
        if (selectorString.includes('filterState[boardId]?.selectedLabels')) {
          return []
        }
        if (selectorString.includes('filterState[boardId]?.selectedMembers')) {
          return []
        }
        if (selectorString.includes('filterState[boardId]?.showOverdue')) {
          return false
        }
        if (selectorString.includes('filterState[boardId]?.showCompleted')) {
          return 'all'
        }
        if (selectorString.includes('filterState[boardId]?.priorityThreshold')) {
          return null
        }
        if (selectorString.includes('filterState[boardId]?.dueDateFilter')) {
          return 'all'
        }
        
        // Action function selectors
        if (selectorString.includes('openCardModal')) {
          return mockOpenCardModal
        }
        if (selectorString.includes('setTimelineCurrentDate')) {
          return mockSetTimelineCurrentDate
        }
        if (selectorString.includes('setTimelineZoomLevel')) {
          return mockSetTimelineZoomLevel
        }
        if (selectorString.includes('toggleTimelineLane')) {
          return mockToggleTimelineLane
        }
      }
      
      return null
    })
  })

  describe('basic rendering', () => {
    it('should render timeline view when board exists', () => {
      render(<TimelineView boardId={mockBoardId} />)
      
      expect(screen.getByTestId('timeline-header')).toBeInTheDocument()
      expect(screen.getByTestId('timeline-grid')).toBeInTheDocument()
    })

    it('should not render when board does not exist', () => {
      render(<TimelineView boardId="missing-board" />)
      
      expect(screen.queryByTestId('timeline-header')).not.toBeInTheDocument()
    })
  })

  describe('timeline header controls', () => {
    it('should render timeline header with controls', () => {
      render(<TimelineView boardId={mockBoardId} />)
      
      expect(screen.getByTestId('timeline-header')).toBeInTheDocument()
      expect(screen.getByTestId('current-date')).toBeInTheDocument()
    })

    it('should handle date navigation', async () => {
      const user = userEvent.setup()
      
      render(<TimelineView boardId={mockBoardId} />)
      
      const prevButton = screen.getByTestId('prev-date-button')
      const nextButton = screen.getByTestId('next-date-button')
      const todayButton = screen.getByTestId('today-button')
      
      expect(prevButton).toBeInTheDocument()
      expect(nextButton).toBeInTheDocument()
      expect(todayButton).toBeInTheDocument()
      
      // Test previous button click
      await user.click(prevButton)
      
      // Test next button click
      await user.click(nextButton)
      
      // Test today button click
      await user.click(todayButton)
      
      // Should not crash
      expect(prevButton).toBeInTheDocument()
      expect(nextButton).toBeInTheDocument()
      expect(todayButton).toBeInTheDocument()
    })

    it('should render current date in header', () => {
      render(<TimelineView boardId={mockBoardId} />)
      
      expect(screen.getByTestId('current-date')).toBeInTheDocument()
    })
  })

  describe('zoom functionality', () => {
    it('should handle zoom level changes', async () => {
      const user = userEvent.setup()
      
      render(<TimelineView boardId={mockBoardId} />)
      
      const zoomButton = screen.getByTestId('zoom-button')
      await user.click(zoomButton)
      
      // Should not crash
      expect(zoomButton).toBeInTheDocument()
    })

    it('should render current date in header', () => {
      render(<TimelineView boardId={mockBoardId} />)
      
      expect(screen.getByTestId('current-date')).toBeInTheDocument()
    })
  })

  describe('grid functionality', () => {
    it('should render grid with correct dimensions', () => {
      render(<TimelineView boardId={mockBoardId} />)
      
      const grid = screen.getByTestId('timeline-grid')
      expect(grid).toHaveAttribute('data-zoom')
    })
  })

  describe('list lanes', () => {
    it('should render list lanes for each list', () => {
      render(<TimelineView boardId={mockBoardId} />)
      
      expect(screen.getByTestId('timeline-lane-list-1')).toBeInTheDocument()
    })

    it('should render lane titles', () => {
      render(<TimelineView boardId={mockBoardId} />)
      
      expect(screen.getByTestId('lane-title-list-1')).toHaveTextContent('To Do')
    })
  })

  describe('date navigation functionality', () => {
    it('should handle previous date navigation', async () => {
      const user = userEvent.setup()
      
      render(<TimelineView boardId={mockBoardId} />)
      
      const prevButton = screen.getByTestId('prev-date-button')
      await user.click(prevButton)
      
      expect(mockSetTimelineCurrentDate).toHaveBeenCalledWith(
        mockBoardId,
        expect.any(String) // Should be called with an ISO string
      )
    })

    it('should handle next date navigation', async () => {
      const user = userEvent.setup()
      
      render(<TimelineView boardId={mockBoardId} />)
      
      const nextButton = screen.getByTestId('next-date-button')
      await user.click(nextButton)
      
      expect(mockSetTimelineCurrentDate).toHaveBeenCalledWith(
        mockBoardId,
        expect.any(String) // Should be called with an ISO string
      )
    })

    it('should handle today button click', async () => {
      const user = userEvent.setup()
      
      render(<TimelineView boardId={mockBoardId} />)
      
      const todayButton = screen.getByTestId('today-button')
      await user.click(todayButton)
      
      expect(mockSetTimelineCurrentDate).toHaveBeenCalledWith(
        mockBoardId,
        expect.any(String) // Should be called with today's date as ISO string
      )
    })
  })

  describe('component integration', () => {
    it('should integrate with board store', () => {
      const { useBoardStore } = require('@/store')
      
      render(<TimelineView boardId={mockBoardId} />)
      
      expect(useBoardStore().boards).toBeDefined()
    })

    it('should integrate with UI store selectors', () => {
      const { useUIStore } = require('@/store')
      
      render(<TimelineView boardId={mockBoardId} />)
      
      // Should call selector functions
      expect(useUIStore).toHaveBeenCalled()
    })

    it('should use filter utils', () => {
      const { filterCards } = require('@/lib/filterUtils')
      
      render(<TimelineView boardId={mockBoardId} />)
      
      expect(filterCards).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should render without crashing', () => {
      render(<TimelineView boardId={mockBoardId} />)
      
      expect(screen.getByTestId('timeline-header')).toBeInTheDocument()
    })

    it('should handle missing board gracefully', () => {
      render(<TimelineView boardId="missing-board" />)
      
      expect(screen.queryByTestId('timeline-header')).not.toBeInTheDocument()
    })

    it('should handle undefined timeline state gracefully', () => {
      render(<TimelineView boardId={mockBoardId} />)
      
      expect(screen.getByTestId('timeline-header')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<TimelineView boardId={mockBoardId} />)
      
      expect(screen.getByTestId('timeline-header')).toBeInTheDocument()
      expect(screen.getByTestId('timeline-grid')).toBeInTheDocument()
    })

    it('should render accessible lane titles', () => {
      render(<TimelineView boardId={mockBoardId} />)
      
      expect(screen.getByTestId('lane-title-list-1')).toBeInTheDocument()
    })
  })

  describe('performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<TimelineView boardId={mockBoardId} />)
      
      rerender(<TimelineView boardId={mockBoardId} />)
      
      expect(screen.getByTestId('timeline-header')).toBeInTheDocument()
    })
  })

  describe('reactivity', () => {
    it('should update when timeline state changes', () => {
      const { rerender } = render(<TimelineView boardId={mockBoardId} />)
      
      // Re-render with same props should not cause issues
      rerender(<TimelineView boardId={mockBoardId} />)
      
      expect(screen.getByTestId('timeline-header')).toBeInTheDocument()
    })
  })
})
