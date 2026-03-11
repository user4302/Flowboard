import React from 'react'
import { render } from '@testing-library/react'
import { BoardSidebarBoardList } from '../BoardSidebarBoardList'
import { Board } from '@/lib/types'

describe('BoardSidebarBoardList', () => {
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
    boards: [createMockBoard()],
    currentBoardId: 'board1',
    isCreatingBoard: false,
    onSelectBoard: jest.fn(),
    onDeleteBoard: jest.fn(),
    onCreateBoard: jest.fn(),
    onCancelCreation: jest.fn(),
    onCloseSidebar: jest.fn()
  }

  it('should render without crashing', () => {
    expect(() => render(<BoardSidebarBoardList {...mockProps} />)).not.toThrow()
  })

  it('should render with empty boards', () => {
    const propsWithEmptyBoards = {
      ...mockProps,
      boards: []
    }
    expect(() => render(<BoardSidebarBoardList {...propsWithEmptyBoards} />)).not.toThrow()
  })

  it('should render when creating board', () => {
    const propsWithCreating = {
      ...mockProps,
      isCreatingBoard: true
    }
    expect(() => render(<BoardSidebarBoardList {...propsWithCreating} />)).not.toThrow()
  })

  it('should render with multiple boards', () => {
    const propsWithMultipleBoards = {
      ...mockProps,
      boards: [
        createMockBoard({ id: 'board1', name: 'Board 1' }),
        createMockBoard({ id: 'board2', name: 'Board 2' })
      ]
    }
    expect(() => render(<BoardSidebarBoardList {...propsWithMultipleBoards} />)).not.toThrow()
  })
})
