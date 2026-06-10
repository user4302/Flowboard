import React from 'react'
import { render } from '@testing-library/react'
import { TaskModalChecklistSection } from '../TaskModalChecklistSection'
import { Checklist, ChecklistItem } from '@/lib/types'

describe('TaskModalChecklistSection', () => {
  const createMockChecklistItem = (overrides: Partial<ChecklistItem> = {}): ChecklistItem => ({
    id: 'item1',
    text: 'Test Item',
    done: false,
    ...overrides
  })

  const createMockChecklist = (overrides: Partial<Checklist> = {}): Checklist => ({
    id: 'checklist1',
    name: 'Test Checklist',
    items: [],
    position: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  })

  const mockProps = {
    cardId: 'card1',
    boardId: 'board1',
    checklists: [createMockChecklist()],
    checklistHook: {
      addChecklist: jest.fn(),
      updateChecklist: jest.fn(),
      removeChecklist: jest.fn(),
      addChecklistItem: jest.fn(),
      addChecklistItems: jest.fn(),
      updateChecklistItem: jest.fn(),
      removeChecklistItem: jest.fn(),
      syncChecklistToStore: jest.fn(),
      resetChecklist: jest.fn()
    }
  }

  it('should render without crashing', () => {
    expect(() => render(<TaskModalChecklistSection {...mockProps} />)).not.toThrow()
  })

  it('should render with empty checklists', () => {
    const propsWithEmptyChecklists = {
      ...mockProps,
      checklists: []
    }
    expect(() => render(<TaskModalChecklistSection {...propsWithEmptyChecklists} />)).not.toThrow()
  })

  it('should render with multiple checklists', () => {
    const propsWithMultipleChecklists = {
      ...mockProps,
      checklists: [
        createMockChecklist({ id: 'checklist1', name: 'Checklist 1' }),
        createMockChecklist({ id: 'checklist2', name: 'Checklist 2' })
      ]
    }
    expect(() => render(<TaskModalChecklistSection {...propsWithMultipleChecklists} />)).not.toThrow()
  })
})
