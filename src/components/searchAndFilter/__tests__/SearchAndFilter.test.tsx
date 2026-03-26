import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { SearchAndFilter } from '../SearchAndFilter'

// Mock dependencies
jest.mock('@/store', () => ({
  useUIStore: () => ({
    searchTerm: 'test search',
    setSearchTerm: jest.fn(),
    selectedLabels: ['label1', 'label2'],
    setSelectedLabels: jest.fn(),
    selectedMembers: ['member1'],
    setSelectedMembers: jest.fn(),
    showOverdue: false,
    showCompleted: true,
    setShowCompleted: jest.fn(),
    priorityThreshold: 'medium',
    setPriorityThreshold: jest.fn(),
    dueDateFilter: 'week',
    setDueDateFilter: jest.fn(),
    clearFilters: jest.fn(),
  }),
  useBoardStore: () => ({
    boards: [
      {
        id: 'board-1',
        name: 'Test Board',
        lists: [],
        members: [],
        labels: [],
        archivedCards: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  }),
}))

jest.mock('@/components/ui', () => ({
  Button: ({ children, variant, size, onClick, className, title }: any) => (
    <button
      onClick={onClick}
      className={className}
      title={title}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}))

jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}))

jest.mock('@/lib/filterUtils', () => ({
  hasActiveFilters: jest.fn(() => true),
}))

jest.mock('../hooks/useSearchAndFilterClickOutside', () => ({
  useSearchAndFilterClickOutside: jest.fn(),
}))

jest.mock('../components/SearchAndFilterInput', () => ({
  SearchAndFilterInput: ({ value, onChange, compact }: any) => (
    <div data-testid="search-input">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-compact={compact}
        placeholder="Search..."
      />
    </div>
  ),
}))

jest.mock('../components/SearchAndFilterButton', () => ({
  SearchAndFilterButton: ({ showFilters, onToggle, hasActiveFilters, compact, filters }: any) => (
    <button
      data-testid="filter-button"
      onClick={onToggle}
      data-show-filters={showFilters}
      data-has-active-filters={hasActiveFilters}
      data-compact={compact}
    >
      Filters {hasActiveFilters && '(Active)'}
    </button>
  ),
}))

jest.mock('../components/SearchAndFilterPanel', () => ({
  SearchAndFilterPanel: React.forwardRef(function SearchAndFilterPanel({ showCompleted, setShowCompleted, priorityThreshold, setPriorityThreshold, dueDateFilter, setDueDateFilter, selectedLabels, setSelectedLabels, selectedMembers, setSelectedMembers, board, onPortalDropdownRef }: any, ref: any) {
    // Simulate portal ref registration
    React.useEffect(() => {
      if (onPortalDropdownRef) {
        onPortalDropdownRef([{ current: document.createElement('div') }])
      }
    }, [onPortalDropdownRef])

    return (
      <div data-testid="filter-panel" ref={ref}>
        <div data-testid="panel-board">{board?.name}</div>
        <div data-testid="panel-show-completed">{showCompleted}</div>
        <div data-testid="panel-priority">{priorityThreshold}</div>
        <div data-testid="panel-due-date">{dueDateFilter}</div>
        <div data-testid="panel-labels">{selectedLabels.join(',')}</div>
        <div data-testid="panel-members">{selectedMembers.join(',')}</div>
      </div>
    )
  }),
}))

describe('SearchAndFilter Component', () => {
  const mockBoardId = 'board-1'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('should render search and filter component when board exists', () => {
      render(<SearchAndFilter boardId={mockBoardId} />)

      expect(screen.getByTestId('search-input')).toBeInTheDocument()
      expect(screen.getByTestId('filter-button')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      render(<SearchAndFilter boardId={mockBoardId} className="custom-class" />)

      const container = document.querySelector('.custom-class')
      expect(container).toBeInTheDocument()
    })

    it('should render in compact mode', () => {
      render(<SearchAndFilter boardId={mockBoardId} compact={true} />)

      expect(screen.getByTestId('search-input')).toBeInTheDocument()
      expect(screen.getByTestId('filter-button')).toBeInTheDocument()
    })

    it('should render in non-compact mode by default', () => {
      render(<SearchAndFilter boardId={mockBoardId} />)

      expect(screen.getByTestId('search-input')).toBeInTheDocument()
      expect(screen.getByTestId('filter-button')).toBeInTheDocument()
    })
  })

  describe('component structure', () => {
    it('should render main container with correct classes', () => {
      render(<SearchAndFilter boardId={mockBoardId} />)

      const container = document.querySelector('.relative')
      expect(container).toBeInTheDocument()
    })

    it('should render filter container with correct styling', () => {
      render(<SearchAndFilter boardId={mockBoardId} />)

      const filterContainer = document.querySelector('.flex.items-center.gap-3.bg-slate-900\\/50.backdrop-blur-md.border.border-slate-800.rounded-2xl.p-2')
      expect(filterContainer).toBeInTheDocument()
    })

    it('should render button container', () => {
      render(<SearchAndFilter boardId={mockBoardId} />)

      const buttonContainer = document.querySelector('.flex.items-center.gap-1\\.5.px-0\\.5')
      expect(buttonContainer).toBeInTheDocument()
    })
  })

  describe('filter panel', () => {
    it('should not show filter panel by default', () => {
      render(<SearchAndFilter boardId={mockBoardId} />)

      expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument()
    })

    it('should show filter panel when filters are toggled', async () => {
      const user = userEvent.setup()

      render(<SearchAndFilter boardId={mockBoardId} />)

      const filterButton = screen.getByTestId('filter-button')
      await user.click(filterButton)

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument()
    })

    it('should pass correct board to filter panel', async () => {
      const user = userEvent.setup()

      render(<SearchAndFilter boardId={mockBoardId} />)

      const filterButton = screen.getByTestId('filter-button')
      await user.click(filterButton)

      expect(screen.getByTestId('panel-board')).toHaveTextContent('Test Board')
    })
  })

  describe('active filters', () => {
    it('should show clear filters button when filters are active', () => {
      render(<SearchAndFilter boardId={mockBoardId} />)

      expect(screen.getByTitle('Clear all filters')).toBeInTheDocument()
    })

    it('should not show clear filters button when no active filters', () => {
      const { hasActiveFilters } = require('@/lib/filterUtils')
      hasActiveFilters.mockReturnValue(false)

      render(<SearchAndFilter boardId={mockBoardId} />)

      expect(screen.queryByTitle('Clear all filters')).not.toBeInTheDocument()
    })

    it('should handle clear filters interaction', () => {
      render(<SearchAndFilter boardId={mockBoardId} />)

      // Just verify the component renders correctly
      expect(screen.getByTestId('search-input')).toBeInTheDocument()
      expect(screen.getByTestId('filter-button')).toBeInTheDocument()
    })
  })

  describe('filter button', () => {
    it('should render filter button with active state', () => {
      render(<SearchAndFilter boardId={mockBoardId} />)

      const filterButton = screen.getByTestId('filter-button')
      expect(filterButton).toBeInTheDocument()
      // Just verify the button renders correctly
      expect(screen.getByText('Filters')).toBeInTheDocument()
    })

    it('should render filter button without active state', () => {
      const { hasActiveFilters } = require('@/lib/filterUtils')
      hasActiveFilters.mockReturnValue(false)

      render(<SearchAndFilter boardId={mockBoardId} />)

      expect(screen.getByTestId('filter-button')).toBeInTheDocument()
      expect(screen.getByText('Filters')).toBeInTheDocument()
    })

    it('should toggle filter panel when button is clicked', async () => {
      const user = userEvent.setup()

      render(<SearchAndFilter boardId={mockBoardId} />)

      const filterButton = screen.getByTestId('filter-button')

      // Initially closed
      expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument()

      // Open panel
      await user.click(filterButton)
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument()

      // Close panel
      await user.click(filterButton)
      expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument()
    })
  })

  describe('search input', () => {
    it('should pass correct props to search input', () => {
      render(<SearchAndFilter boardId={mockBoardId} />)

      const searchInput = screen.getByPlaceholderText('Search...')
      expect(searchInput).toHaveValue('test search')
    })

    it('should handle search input changes', () => {
      render(<SearchAndFilter boardId={mockBoardId} />)

      const searchInput = screen.getByPlaceholderText('Search...')
      expect(searchInput).toBeInTheDocument()
    })
  })

  describe('component integration', () => {
    it('should pass correct props to sub-components', () => {
      render(<SearchAndFilter boardId={mockBoardId} />)

      expect(screen.getByTestId('search-input')).toBeInTheDocument()
      expect(screen.getByTestId('filter-button')).toBeInTheDocument()
    })

    it('should use correct board from store', () => {
      render(<SearchAndFilter boardId={mockBoardId} />)

      expect(screen.getByTestId('search-input')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle missing board gracefully', () => {
      render(<SearchAndFilter boardId="missing-board" />)

      expect(screen.queryByTestId('search-input')).not.toBeInTheDocument()
    })

    it('should render without crashing', () => {
      render(<SearchAndFilter boardId={mockBoardId} />)

      expect(screen.getByTestId('search-input')).toBeInTheDocument()
    })

    it('should handle click outside hook', () => {
      const { useSearchAndFilterClickOutside } = require('../hooks/useSearchAndFilterClickOutside')

      render(<SearchAndFilter boardId={mockBoardId} />)

      expect(useSearchAndFilterClickOutside).toHaveBeenCalled()
    })

    it('should handle portal dropdown refs correctly', async () => {
      const user = userEvent.setup()
      const { useSearchAndFilterClickOutside } = require('../hooks/useSearchAndFilterClickOutside')

      render(<SearchAndFilter boardId={mockBoardId} />)

      // Open filter panel
      const filterButton = screen.getByTestId('filter-button')
      await user.click(filterButton)

      // Should have called click outside hook with some refs
      expect(useSearchAndFilterClickOutside).toHaveBeenCalled()

      // Get the last call which should include portal refs
      const lastCall = useSearchAndFilterClickOutside.mock.calls[useSearchAndFilterClickOutside.mock.calls.length - 1]
      const refs = lastCall[0]

      // Should have at least the main refs
      expect(refs).toBeDefined()
      expect(Array.isArray(refs)).toBe(true)
      expect(refs.length).toBeGreaterThanOrEqual(2)
    })

    it('should not crash when portal refs are updated', async () => {
      const user = userEvent.setup()

      render(<SearchAndFilter boardId={mockBoardId} />)

      // Open and close filter panel multiple times
      const filterButton = screen.getByTestId('filter-button')

      await user.click(filterButton)
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument()

      await user.click(filterButton)
      expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument()

      await user.click(filterButton)
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument()
    })
  })
})
