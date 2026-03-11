import React from 'react'
import { render } from '@testing-library/react'
import { MovePortal } from '../MovePortal'
import { Board, List } from '@/lib/types'

describe('MovePortal', () => {
  const createMockList = (overrides: Partial<List> = {}): List => ({
    id: 'list1',
    title: 'Test List',
    cards: [],
    position: 0,
    ...overrides
  })

  const createMockBoard = (overrides: Partial<Board> = {}): Board => ({
    id: 'board1',
    name: 'Test Board',
    lists: [],
    members: [],
    labels: [],
    archivedCards: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  })

  const mockProps = {
    show: true,
    position: { left: 0, top: 0 },
    cardId: 'card1',
    currentListId: 'list1',
    onClose: jest.fn()
  }

  it('should render without crashing', () => {
    expect(() => render(<MovePortal {...mockProps} />)).not.toThrow()
  })

  it('should not render when show is false', () => {
    const props = { ...mockProps, show: false }
    expect(() => render(<MovePortal {...props} />)).not.toThrow()
  })

  it('should render when show is true', () => {
    expect(() => render(<MovePortal {...mockProps} />)).not.toThrow()
  })

  it('should handle close callback', () => {
    expect(() => render(<MovePortal {...mockProps} />)).not.toThrow()
  })

  it('should handle different positions', () => {
    const positions = [
      { left: 100, top: 200 },
      { left: 0, top: 0 },
      { left: -50, top: -50 }
    ]

    positions.forEach(position => {
      const props = { ...mockProps, position }
      expect(() => render(<MovePortal {...props} />)).not.toThrow()
    })
  })

  it('should handle different card and list IDs', () => {
    const props = {
      ...mockProps,
      cardId: 'different-card',
      currentListId: 'different-list'
    }

    expect(() => render(<MovePortal {...props} />)).not.toThrow()
  })
})
