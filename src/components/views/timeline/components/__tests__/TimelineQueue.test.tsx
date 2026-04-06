import React from 'react'
import { render } from '@testing-library/react'
import { TimelineQueue } from '../TimelineQueue'
import { Card, Label } from '@/lib/types'

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
    priority: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  })

  const mockProps = {
    hiddenTasksBefore: [createMockCard()],
    hiddenTasksAfter: [createMockCard()],
    onOpenTaskModal: jest.fn(),
    getTaskColor: jest.fn(() => ({ background: '#e5e7eb', text: '#000000' })),
    boardLabels: []
  }

  it('should render without crashing', () => {
    expect(() => render(<TimelineQueue {...mockProps} />)).not.toThrow()
  })
})