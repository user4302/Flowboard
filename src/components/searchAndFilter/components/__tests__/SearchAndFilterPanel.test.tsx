import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { SearchAndFilterPanel } from '../SearchAndFilterPanel'

// Mock the dropdown components to simplify testing
jest.mock('../SearchAndFilterDropdown', () => ({
  SearchAndFilterDropdown: ({ label, onPortalRef, onToggle, selectedItems }: any) => (
    <div data-testid={`dropdown-${label}`}>
      <span data-testid={`${label}-selected-count`}>{selectedItems.length}</span>
      <button onClick={() => onPortalRef({ current: document.createElement('div') })}>
        {label} Portal Ref
      </button>
      <button onClick={() => onToggle('test-id')}>{label} Toggle</button>
    </div>
  )
}))

jest.mock('../SearchAndFilterStatus', () => ({
  SearchAndFilterStatus: ({ onChange }: any) => (
    <div data-testid="status-filter">
      <button onClick={() => onChange('completed')}>Status</button>
    </div>
  )
}))

jest.mock('../SearchAndFilterPriority', () => ({
  SearchAndFilterPriority: ({ onChange }: any) => (
    <div data-testid="priority-filter">
      <button onClick={() => onChange(5)}>Priority</button>
    </div>
  )
}))

jest.mock('../SearchAndFilterTimeline', () => ({
  SearchAndFilterTimeline: ({ onChange }: any) => (
    <div data-testid="timeline-filter">
      <button onClick={() => onChange('today')}>Timeline</button>
    </div>
  )
}))

describe('SearchAndFilterPanel', () => {
  const mockProps = {
    showCompleted: 'all',
    setShowCompleted: jest.fn(),
    priorityThreshold: null,
    setPriorityThreshold: jest.fn(),
    dueDateFilter: 'all',
    setDueDateFilter: jest.fn(),
    selectedLabels: [],
    setSelectedLabels: jest.fn(),
    selectedMembers: [],
    setSelectedMembers: jest.fn(),
    board: {
      labels: [
        { id: 'label1', text: 'Label 1', color: 'bg-red-500' },
        { id: 'label2', text: 'Label 2', color: 'bg-blue-500' }
      ],
      members: [
        { id: 'member1', name: 'John Doe' },
        { id: 'member2', name: 'Jane Smith' }
      ]
    }
  }

  it('should render without crashing', () => {
    expect(() => render(<SearchAndFilterPanel {...mockProps} />)).not.toThrow()
  })

  it('should render all filter sections', () => {
    render(<SearchAndFilterPanel {...mockProps} />)

    expect(screen.getByTestId('status-filter')).toBeInTheDocument()
    expect(screen.getByTestId('priority-filter')).toBeInTheDocument()
    expect(screen.getByTestId('timeline-filter')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-Labels')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-Members')).toBeInTheDocument()
  })

  it('should register portal refs when dropdowns are rendered', () => {
    const onPortalDropdownRef = jest.fn()
    const props = { ...mockProps, onPortalDropdownRef }

    render(<SearchAndFilterPanel {...props} />)

    // Click on dropdowns to trigger portal ref registration
    const labelsPortalButton = screen.getByText('Labels Portal Ref')
    const membersPortalButton = screen.getByText('Members Portal Ref')

    fireEvent.click(labelsPortalButton)
    fireEvent.click(membersPortalButton)

    // Should have called the portal ref callback
    expect(onPortalDropdownRef).toHaveBeenCalled()
  })

  it('should handle label selection correctly', () => {
    const setSelectedLabels = jest.fn()
    const props = { ...mockProps, setSelectedLabels }

    render(<SearchAndFilterPanel {...props} />)

    // Click the toggle button in the labels dropdown
    const toggleButton = screen.getByText('Labels Toggle')
    fireEvent.click(toggleButton)

    expect(setSelectedLabels).toHaveBeenCalledWith(['test-id'])
  })

  it('should handle member selection correctly', () => {
    const setSelectedMembers = jest.fn()
    const props = { ...mockProps, setSelectedMembers }

    render(<SearchAndFilterPanel {...props} />)

    // Click the toggle button in the members dropdown
    const toggleButton = screen.getByText('Members Toggle')
    fireEvent.click(toggleButton)

    expect(setSelectedMembers).toHaveBeenCalledWith(['test-id'])
  })

  it('should handle status filter changes', () => {
    const setShowCompleted = jest.fn()
    const props = { ...mockProps, setShowCompleted }

    render(<SearchAndFilterPanel {...props} />)

    const statusButton = screen.getByText('Status')
    fireEvent.click(statusButton)

    expect(setShowCompleted).toHaveBeenCalledWith('completed')
  })

  it('should handle priority filter changes', () => {
    const setPriorityThreshold = jest.fn()
    const props = { ...mockProps, setPriorityThreshold }

    render(<SearchAndFilterPanel {...props} />)

    const priorityButton = screen.getByText('Priority')
    fireEvent.click(priorityButton)

    expect(setPriorityThreshold).toHaveBeenCalledWith(5)
  })

  it('should handle timeline filter changes', () => {
    const setDueDateFilter = jest.fn()
    const props = { ...mockProps, setDueDateFilter }

    render(<SearchAndFilterPanel {...props} />)

    const timelineButton = screen.getByText('Timeline')
    fireEvent.click(timelineButton)

    expect(setDueDateFilter).toHaveBeenCalledWith('today')
  })

  it('should render selected counts correctly', () => {
    const props = {
      ...mockProps,
      selectedLabels: ['label1', 'label2'],
      selectedMembers: ['member1']
    }

    render(<SearchAndFilterPanel {...props} />)

    expect(screen.getByTestId('Labels-selected-count')).toHaveTextContent('2')
    expect(screen.getByTestId('Members-selected-count')).toHaveTextContent('1')
  })

  it('should remove label from selection when already selected', () => {
    const setSelectedLabels = jest.fn()
    const props = { ...mockProps, selectedLabels: ['test-id'], setSelectedLabels }

    render(<SearchAndFilterPanel {...props} />)

    const toggleButton = screen.getByText('Labels Toggle')
    fireEvent.click(toggleButton)

    expect(setSelectedLabels).toHaveBeenCalledWith([])
  })

  it('should remove member from selection when already selected', () => {
    const setSelectedMembers = jest.fn()
    const props = { ...mockProps, selectedMembers: ['test-id'], setSelectedMembers }

    render(<SearchAndFilterPanel {...props} />)

    const toggleButton = screen.getByText('Members Toggle')
    fireEvent.click(toggleButton)

    expect(setSelectedMembers).toHaveBeenCalledWith([])
  })
})
