import React from 'react'
import { render } from '@testing-library/react'
import { TaskCardCardMeta } from '../TaskCardCardMeta'
import { Card } from '@/lib/types'

describe('TaskCardCardMeta', () => {
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
    isOverdue: false,
    checklistProgress: 0
  }

  it('should render without crashing', () => {
    expect(() => render(<TaskCardCardMeta {...mockProps} />)).not.toThrow()
  })

  it('should render with due date', () => {
    const propsWithDueDate = {
      ...mockProps,
      card: createMockCard({ dueDate: new Date() })
    }
    expect(() => render(<TaskCardCardMeta {...propsWithDueDate} />)).not.toThrow()
  })

  it('should render with checklists', () => {
    const propsWithChecklists = {
      ...mockProps,
      card: createMockCard({ checklists: [{ id: 'cl1', name: 'Test', items: [], position: 0, createdAt: new Date(), updatedAt: new Date() }] })
    }
    expect(() => render(<TaskCardCardMeta {...propsWithChecklists} />)).not.toThrow()
  })

  it('should render when overdue', () => {
    const overdueProps = {
      ...mockProps,
      isOverdue: true,
      card: createMockCard({ dueDate: new Date() })
    }
    expect(() => render(<TaskCardCardMeta {...overdueProps} />)).not.toThrow()
  })
})
