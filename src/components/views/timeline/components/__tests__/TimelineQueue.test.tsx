import React from 'react'
import { render } from '@testing-library/react'
import { TimelineQueue } from '../TimelineQueue'
import { Card } from '@/lib/types'

describe('TimelineQueue', () => {
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

  const mockProps = {
    queuedTasks: [createMockCard()],
    hiddenTasksBefore: [],
    hiddenTasksAfter: [],
    onTaskClick: jest.fn(),
    listId: 'list1',
    onOpenTaskModal: jest.fn()
  }

  it('should render without crashing', () => {
    expect(() => render(<TimelineQueue {...mockProps} />)).not.toThrow()
  })
})