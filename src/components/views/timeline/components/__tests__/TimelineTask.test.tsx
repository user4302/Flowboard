import React from 'react'
import { render } from '@testing-library/react'
import { TimelineTask } from '../TimelineTask'
import { Card, Label } from '@/lib/types'

describe('TimelineTask', () => {
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
    task: createMockCard(),
    allCards: [createMockCard()],
    cardIndex: 0,
    dateRange: [new Date()],
    zoomLevel: 'day' as const,
    onOpenTaskModal: jest.fn(),
    getTaskPosition: jest.fn(() => ({ left: '0px', width: '100px', top: '0px' })),
    getTaskColor: jest.fn(() => ({ background: '#fff', text: '#000' })),
    boardLabels: []
  }

  it('should render without crashing', () => {
    expect(() => render(<TimelineTask {...mockProps} />)).not.toThrow()
  })
})