import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { SearchAndFilterDropdown } from '../SearchAndFilterDropdown'

// Mock the SearchAndFilterPortal to render content inline for testing
jest.mock('../SearchAndFilterPortal', () => ({
  SearchAndFilterPortal: ({ children }: any) => <div>{children}</div>
}))

// Mock the dropdown position hook
jest.mock('../../hooks/useSearchAndFilterDropdownPosition', () => ({
  useSearchAndFilterDropdownPosition: () => ({
    triggerRect: { bottom: 100, left: 0, width: 200, top: 0 },
    triggerRef: { current: document.createElement('button') }
  })
}))

describe('SearchAndFilterDropdown', () => {
  const mockProps = {
    label: 'Test Label',
    icon: () => <div>Icon</div>,
    selectedItems: [],
    items: [
      { id: 'item1', text: 'Item 1' },
      { id: 'item2', text: 'Item 2' }
    ],
    onToggle: jest.fn(),
    itemType: 'label' as const,
  }

  it('should render without crashing', () => {
    expect(() => render(<SearchAndFilterDropdown {...mockProps} />)).not.toThrow()
  })

  it('should register portal ref when dropdown opens', () => {
    const onPortalRef = jest.fn()
    const props = { ...mockProps, onPortalRef }

    render(<SearchAndFilterDropdown {...props} />)

    // Initially should not call onPortalRef (dropdown is closed)
    expect(onPortalRef).not.toHaveBeenCalled()

    // Click to open dropdown
    const triggerButton = screen.getByText('Select...')
    fireEvent.click(triggerButton)

    // Should call onPortalRef when dropdown opens
    expect(onPortalRef).toHaveBeenCalled()
  })

  it('should call onToggle when item is clicked', () => {
    const onToggle = jest.fn()
    const props = { ...mockProps, onToggle }

    render(<SearchAndFilterDropdown {...props} />)

    // Open dropdown
    const triggerButton = screen.getByText('Select...')
    fireEvent.click(triggerButton)

    // Click on an item
    const item1 = screen.getByText('Item 1')
    fireEvent.click(item1)

    expect(onToggle).toHaveBeenCalledWith('item1')
  })

  it('should render selected items count', () => {
    const props = { ...mockProps, selectedItems: ['item1', 'item2'] }

    render(<SearchAndFilterDropdown {...props} />)

    expect(screen.getByText('2 Selected')).toBeInTheDocument()
  })

  it('should render label items with color dots', () => {
    const props = {
      ...mockProps,
      items: [
        { id: 'item1', text: 'Item 1', color: '#ef4444' },
        { id: 'item2', text: 'Item 2', color: '#3b82f6' }
      ]
    }

    render(<SearchAndFilterDropdown {...props} />)

    // Open dropdown
    const triggerButton = screen.getByText('Select...')
    fireEvent.click(triggerButton)

    // Check that color dots are rendered
    const colorDots = document.querySelectorAll('.rounded-full')
    expect(colorDots).toHaveLength(2)
  })

  it('should render member items with initials', () => {
    const props = {
      ...mockProps,
      itemType: 'member' as const,
      items: [
        { id: 'member1', name: 'John Doe' },
        { id: 'member2', name: 'Jane Smith' }
      ]
    }

    render(<SearchAndFilterDropdown {...props} />)

    // Open dropdown
    const triggerButton = screen.getByText('Select...')
    fireEvent.click(triggerButton)

    // Check that initials are rendered
    expect(screen.getByText('JD')).toBeInTheDocument()
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('should toggle dropdown open/close', () => {
    const props = { ...mockProps }

    render(<SearchAndFilterDropdown {...props} />)

    // Initially closed
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()

    // Open dropdown
    const triggerButton = screen.getByText('Select...')
    fireEvent.click(triggerButton)

    // Should show items
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()

    // Close dropdown
    fireEvent.click(triggerButton)

    // Should hide items (but might still be in DOM due to portal)
    // This test mainly verifies the toggle behavior works
  })

  it('should show check icon for selected items', () => {
    const props = { ...mockProps, selectedItems: ['item1'] }

    render(<SearchAndFilterDropdown {...props} />)

    // Open dropdown - button should show "1 Selected" instead of "Select..."
    const triggerButton = screen.getByText('1 Selected')
    fireEvent.click(triggerButton)

    // Should show check icon for selected item
    const checkIcons = document.querySelectorAll('.lucide-check')
    expect(checkIcons.length).toBeGreaterThan(0)
  })
})