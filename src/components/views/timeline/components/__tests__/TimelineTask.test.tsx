import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TimelineTask } from '../TimelineTask'
import { Card, Label } from '@/lib/types'

describe('TimelineTask', () => {
  const createMockCard = (overrides: Partial<Card> = {}): Card => ({
    id: 'card1',
    title: 'Test Task',
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

  const createMockLabel = (overrides: Partial<Label> = {}): Label => ({
    id: 'label1',
    text: 'Test Label',
    color: 'bg-red-100',
    ...overrides
  })

  const mockProps = {
    task: createMockCard(),
    allCards: [createMockCard()],
    cardIndex: 0,
    dateRange: [new Date()],
    zoomLevel: 'day' as const,
    onOpenTaskModal: jest.fn(),
    getTaskPosition: jest.fn(() => ({ left: '100px', width: '0px', top: '0px' })),
    getTaskColor: jest.fn(() => ({ background: '#fff', text: '#000' })),
    boardLabels: []
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      expect(() => render(<TimelineTask {...mockProps} />)).not.toThrow()
    })

    it('should render task title', () => {
      render(<TimelineTask {...mockProps} />)

      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    it('should render with correct positioning', () => {
      const mockPosition = { left: '10px', width: '200px', top: '5px' }
      mockProps.getTaskPosition.mockReturnValue(mockPosition)

      render(<TimelineTask {...mockProps} />)

      const taskElement = screen.getByText('Test Task').closest('div')?.parentElement
      expect(taskElement).toHaveStyle({
        left: '10px',
        width: '200px',
        top: '5px'
      })
    })

    it('should render with correct colors', () => {
      const mockColors = { background: '#ff0000', text: '#ffffff' }
      mockProps.getTaskColor.mockReturnValue(mockColors)

      render(<TimelineTask {...mockProps} />)

      const taskElement = screen.getByText('Test Task').closest('div')?.parentElement
      expect(taskElement).toHaveStyle({
        backgroundColor: 'rgb(255, 0, 0)',
        color: 'rgb(255, 255, 255)'
      })
    })

    it('should have correct title attribute', () => {
      render(<TimelineTask {...mockProps} />)

      const taskElement = screen.getByText('Test Task').closest('div')?.parentElement
      expect(taskElement).toHaveAttribute('title', 'Test Task')
    })
  })

  describe('CSS Classes and Styling', () => {
    it('should apply correct base classes', () => {
      render(<TimelineTask {...mockProps} />)

      const taskElement = screen.getByText('Test Task').closest('div')?.parentElement
      expect(taskElement).toHaveClass('absolute')
      expect(taskElement).toHaveClass('h-8')
      expect(taskElement).toHaveClass('rounded-md')
      expect(taskElement).toHaveClass('px-2')
      expect(taskElement).toHaveClass('py-1')
      expect(taskElement).toHaveClass('text-xs')
      expect(taskElement).toHaveClass('font-medium')
      expect(taskElement).toHaveClass('shadow-sm')
      expect(taskElement).toHaveClass('cursor-pointer')
      expect(taskElement).toHaveClass('transition-all')
    })

    it('should have truncate class for text container', () => {
      render(<TimelineTask {...mockProps} />)

      const textContainer = screen.getByText('Test Task')
      expect(textContainer).toHaveClass('truncate')
    })
  })

  describe('Interactions', () => {
    it('should call onOpenTaskModal when clicked', () => {
      render(<TimelineTask {...mockProps} />)

      const taskElement = screen.getByText('Test Task').closest('div')
      fireEvent.click(taskElement!)

      expect(mockProps.onOpenTaskModal).toHaveBeenCalledWith('card1')
    })

    it('should call onOpenTaskModal with correct task ID', () => {
      const customTask = createMockCard({ id: 'custom-card-id' })
      render(<TimelineTask {...mockProps} task={customTask} />)

      const taskElement = screen.getByText('Test Task').closest('div')
      fireEvent.click(taskElement!)

      expect(mockProps.onOpenTaskModal).toHaveBeenCalledWith('custom-card-id')
    })

    it('should call getTaskPosition with correct parameters', () => {
      render(<TimelineTask {...mockProps} />)

      expect(mockProps.getTaskPosition).toHaveBeenCalledWith(
        mockProps.task,
        mockProps.allCards,
        mockProps.cardIndex
      )
    })

    it('should call getTaskColor with correct parameters', () => {
      render(<TimelineTask {...mockProps} />)

      expect(mockProps.getTaskColor).toHaveBeenCalledWith(
        mockProps.task,
        mockProps.boardLabels
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty title', () => {
      const emptyTask = createMockCard({ title: '' })
      render(<TimelineTask {...mockProps} task={emptyTask} />)

      const taskContainer = document.querySelector('[class*="absolute h-8"]')
      expect(taskContainer).toBeInTheDocument()
    })

    it('should handle very long title', () => {
      const longTask = createMockCard({ title: 'This is a very long task title that should be truncated' })
      render(<TimelineTask {...mockProps} task={longTask} />)

      const taskElement = screen.getByText('This is a very long task title that should be truncated')
      expect(taskElement).toBeInTheDocument()
      expect(taskElement).toHaveClass('truncate')
    })

    it('should handle null boardLabels', () => {
      render(<TimelineTask {...mockProps} boardLabels={null as any} />)

      expect(mockProps.getTaskColor).toHaveBeenCalledWith(
        mockProps.task,
        null
      )
    })

    it('should handle undefined boardLabels', () => {
      render(<TimelineTask {...mockProps} boardLabels={undefined as any} />)

      expect(mockProps.getTaskColor).toHaveBeenCalledWith(
        mockProps.task,
        undefined
      )
    })

    it('should handle empty allCards array', () => {
      render(<TimelineTask {...mockProps} allCards={[]} />)

      expect(mockProps.getTaskPosition).toHaveBeenCalledWith(
        mockProps.task,
        [],
        mockProps.cardIndex
      )
    })

    it('should handle negative cardIndex', () => {
      render(<TimelineTask {...mockProps} cardIndex={-1} />)

      expect(mockProps.getTaskPosition).toHaveBeenCalledWith(
        mockProps.task,
        mockProps.allCards,
        -1
      )
    })

    it('should handle empty dateRange', () => {
      render(<TimelineTask {...mockProps} dateRange={[]} />)

      const taskElement = screen.getByText('Test Task').closest('div')
      expect(taskElement).toBeInTheDocument()
    })
  })

  describe('Different Zoom Levels', () => {
    const zoomLevels = ['day', 'week', '2weeks', 'month', 'year'] as const

    zoomLevels.forEach(zoomLevel => {
      it(`should render with ${zoomLevel} zoom level`, () => {
        render(<TimelineTask {...mockProps} zoomLevel={zoomLevel} />)

        const taskElement = screen.getByText('Test Task').closest('div')
        expect(taskElement).toBeInTheDocument()
      })
    })
  })

  describe('Component Structure', () => {
    it('should render single root element', () => {
      render(<TimelineTask {...mockProps} />)

      const taskElements = document.querySelectorAll('[class*="absolute h-8"]')
      expect(taskElements).toHaveLength(1)
    })

    it('should have proper key prop', () => {
      render(<TimelineTask {...mockProps} />)

      // React keys are not accessible as DOM attributes, so we just check the component renders
      const taskElement = screen.getByText('Test Task').closest('div')?.parentElement
      expect(taskElement).toBeInTheDocument()
    })

    it('should have nested text container', () => {
      render(<TimelineTask {...mockProps} />)

      const textContainer = screen.getByText('Test Task')
      expect(textContainer).toBeInTheDocument()
      expect(textContainer).toHaveClass('truncate')
      expect(textContainer.textContent).toBe('Test Task')
    })
  })

  describe('Mock Function Behavior', () => {
    it('should use provided getTaskPosition function', () => {
      const customPosition = { left: '50%', width: '25%', top: '10%' }
      mockProps.getTaskPosition.mockReturnValue(customPosition)

      render(<TimelineTask {...mockProps} />)

      const taskElement = screen.getByText('Test Task').closest('div')?.parentElement
      expect(taskElement).toHaveStyle(customPosition)
    })

    it('should use provided getTaskColor function', () => {
      const customColors = { background: 'linear-gradient(45deg, #ff0000, #00ff00)', text: '#ffffff' }
      mockProps.getTaskColor.mockReturnValue(customColors)

      render(<TimelineTask {...mockProps} />)

      const taskElement = screen.getByText('Test Task').closest('div')?.parentElement
      expect(taskElement).toHaveStyle({
        backgroundColor: 'linear-gradient(45deg, #ff0000, #00ff00)',
        color: '#ffffff'
      })
    })

    it('should call onOpenTaskModal when provided', () => {
      const customOnOpen = jest.fn()
      render(<TimelineTask {...mockProps} onOpenTaskModal={customOnOpen} />)

      const taskElement = screen.getByText('Test Task').closest('div')
      fireEvent.click(taskElement!)

      expect(customOnOpen).toHaveBeenCalledWith('card1')
    })
  })
})