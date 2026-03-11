import React from 'react'
import { render } from '@testing-library/react'
import { TaskModalFormSection } from '../TaskModalFormSection'
import { Card } from '@/lib/types'

describe('TaskModalFormSection', () => {
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
    form: {},
    errors: {},
    register: jest.fn(),
    onToggleCompleted: jest.fn()
  }

  it('should render without crashing', () => {
    expect(() => render(<TaskModalFormSection {...mockProps} />)).not.toThrow()
  })

  it('should render with null card', () => {
    const propsWithNullCard = {
      ...mockProps,
      card: null
    }
    expect(() => render(<TaskModalFormSection {...propsWithNullCard} />)).not.toThrow()
  })

  it('should render with errors', () => {
    const propsWithErrors = {
      ...mockProps,
      errors: { title: 'Title is required' }
    }
    expect(() => render(<TaskModalFormSection {...propsWithErrors} />)).not.toThrow()
  })

  it('should handle onToggleCompleted', () => {
    const propsWithCallback = {
      ...mockProps,
      onToggleCompleted: jest.fn()
    }
    expect(() => render(<TaskModalFormSection {...propsWithCallback} />)).not.toThrow()
  })
})
