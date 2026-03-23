import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CardContextMenu } from '../CardContextMenu'
import { Card } from '@/lib/types'

describe('CardContextMenu', () => {
  const createMockCard = (overrides: Partial<Card> = {}): Card => ({
    id: 'card1',
    title: 'Test Card',
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

  const mockProps = {
    card: createMockCard(),
    isOpen: true,
    onClose: jest.fn(),
    position: { x: 0, y: 0 },
    onOpenCard: jest.fn()
  }

  it('should render without crashing', () => {
    expect(() => render(<CardContextMenu {...mockProps} />)).not.toThrow()
  })

  it('should not render when isOpen is false', () => {
    const props = { ...mockProps, isOpen: false }
    expect(() => render(<CardContextMenu {...props} />)).not.toThrow()
  })

  it('should render when isOpen is true', () => {
    expect(() => render(<CardContextMenu {...mockProps} />)).not.toThrow()
  })

  it('should handle different positions', () => {
    const positions = [
      { x: 100, y: 200 },
      { x: 0, y: 0 },
      { x: -50, y: -50 }
    ]

    positions.forEach(position => {
      const props = { ...mockProps, position }
      expect(() => render(<CardContextMenu {...props} />)).not.toThrow()
    })
  })

  it('should handle different cards', () => {
    const differentCards = [
      createMockCard({ id: 'card1', title: 'Card 1' }),
      createMockCard({ id: 'card2', title: 'Card 2' }),
      createMockCard({ id: 'card3', title: 'Card 3', completed: true })
    ]

    differentCards.forEach(card => {
      const props = { ...mockProps, card }
      expect(() => render(<CardContextMenu {...props} />)).not.toThrow()
    })
  })

  it('should handle onOpenCard callback', () => {
    expect(() => render(<CardContextMenu {...mockProps} />)).not.toThrow()
  })

  describe('Backdrop right-click behavior', () => {
    beforeEach(() => {
      // Reset mock before each test
      mockProps.onClose.mockClear()
    })

    it('should close context menu when right-clicking on backdrop', () => {
      render(<CardContextMenu {...mockProps} />)

      // Find the backdrop using test ID
      const backdrop = screen.getByTestId('context-menu-backdrop')
      expect(backdrop).toBeInTheDocument()

      // Right-click on backdrop
      fireEvent.contextMenu(backdrop)

      // Should call onClose
      expect(mockProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('should prevent default context menu behavior on backdrop right-click', () => {
      render(<CardContextMenu {...mockProps} />)

      const backdrop = screen.getByTestId('context-menu-backdrop')

      // Spy on the event methods
      const preventDefaultSpy = jest.fn()
      const stopPropagationSpy = jest.fn()

      // Create a custom event with spies
      const customEvent = new Event('contextmenu', { bubbles: true, cancelable: true })
      Object.defineProperty(customEvent, 'preventDefault', { value: preventDefaultSpy })
      Object.defineProperty(customEvent, 'stopPropagation', { value: stopPropagationSpy })

      // Dispatch the custom event
      backdrop.dispatchEvent(customEvent)

      // Should prevent default behavior and stop propagation
      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(stopPropagationSpy).toHaveBeenCalled()
    })

    it('should stop event propagation on backdrop right-click', () => {
      render(<CardContextMenu {...mockProps} />)

      const backdrop = screen.getByTestId('context-menu-backdrop')

      // Spy on the event methods
      const preventDefaultSpy = jest.fn()
      const stopPropagationSpy = jest.fn()

      // Create a custom event with spies
      const customEvent = new Event('contextmenu', { bubbles: true, cancelable: true })
      Object.defineProperty(customEvent, 'preventDefault', { value: preventDefaultSpy })
      Object.defineProperty(customEvent, 'stopPropagation', { value: stopPropagationSpy })

      // Dispatch the custom event
      backdrop.dispatchEvent(customEvent)

      // Should stop propagation
      expect(stopPropagationSpy).toHaveBeenCalled()
    })

    it('should still close menu on left-click (regression test)', () => {
      render(<CardContextMenu {...mockProps} />)

      const backdrop = screen.getByTestId('context-menu-backdrop')

      // Left-click on backdrop
      fireEvent.click(backdrop)

      // Should call onClose
      expect(mockProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple rapid right-clicks on backdrop', () => {
      render(<CardContextMenu {...mockProps} />)

      const backdrop = screen.getByTestId('context-menu-backdrop')

      // Multiple rapid right-clicks
      fireEvent.contextMenu(backdrop)
      fireEvent.contextMenu(backdrop)
      fireEvent.contextMenu(backdrop)

      // Should call onClose for each right-click
      expect(mockProps.onClose).toHaveBeenCalledTimes(3)
    })

    it('should work with different backdrop positions', () => {
      const positions = [
        { x: 100, y: 200 },
        { x: 0, y: 0 },
        { x: -50, y: -50 }
      ]

      positions.forEach(position => {
        const { unmount } = render(<CardContextMenu {...mockProps} position={position} />)

        const backdrop = screen.getByTestId('context-menu-backdrop')

        // Right-click should work regardless of menu position
        fireEvent.contextMenu(backdrop)

        expect(mockProps.onClose).toHaveBeenCalled()

        // Reset mock for next iteration
        mockProps.onClose.mockClear()
        unmount()
      })
    })

    it('should not interfere with context menu item interactions', () => {
      render(<CardContextMenu {...mockProps} />)

      // Find context menu (not backdrop)
      const contextMenu = screen.getByTestId('context-menu')
      expect(contextMenu).toBeInTheDocument()

      // Right-click on context menu should not close it (only backdrop should)
      fireEvent.contextMenu(contextMenu)

      // Should not call onClose when right-clicking on menu itself
      expect(mockProps.onClose).not.toHaveBeenCalled()
    })
  })
})
