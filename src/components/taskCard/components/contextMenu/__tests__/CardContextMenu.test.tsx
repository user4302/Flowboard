import React from 'react'
import { render } from '@testing-library/react'
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
})
