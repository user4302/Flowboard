import React from 'react'
import { render } from '@testing-library/react'
import { TimelineGrid } from '../TimelineGrid'
import { Card } from '@/lib/types'

describe('TimelineGrid', () => {
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
    tasks: [createMockCard()],
    dateRange: [new Date()],
    onTaskClick: jest.fn(),
    hiddenTasksBefore: [],
    hiddenTasksAfter: []
  }

  it('should render without crashing', () => {
    expect(() => render(<TimelineGrid {...mockProps} />)).not.toThrow()
  })
})