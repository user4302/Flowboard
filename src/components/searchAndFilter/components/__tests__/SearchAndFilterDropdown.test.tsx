import React from 'react'
import { render } from '@testing-library/react'
import { SearchAndFilterDropdown } from '../SearchAndFilterDropdown'

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
    isOpen: false,
    position: { x: 0, y: 0 },
    onClose: jest.fn(),
    children: <div>Test Content</div>
  }

  it('should render without crashing', () => {
    expect(() => render(<SearchAndFilterDropdown {...mockProps} />)).not.toThrow()
  })

  it('should render when open', () => {
    const openProps = { ...mockProps, isOpen: true }
    expect(() => render(<SearchAndFilterDropdown {...openProps} />)).not.toThrow()
  })
})