import React from 'react'
import { render } from '@testing-library/react'
import { BoardSidebarItem } from '../BoardSidebarItem'
import { Board } from '@/lib/types'

describe('BoardSidebarItem', () => {
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
    board: createMockBoard(),
    isActive: false,
    onClick: jest.fn()
  }

  it('should render without crashing', () => {
    expect(() => render(<BoardSidebarItem {...mockProps} />)).not.toThrow()
  })

  it('should render when active', () => {
    const activeProps = { ...mockProps, isActive: true }
    expect(() => render(<BoardSidebarItem {...activeProps} />)).not.toThrow()
  })
})