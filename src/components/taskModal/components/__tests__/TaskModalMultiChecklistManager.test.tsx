import React from 'react'
import { render } from '@testing-library/react'
import { TaskModalMultiChecklistManager } from '../TaskModalMultiChecklistManager'
import { Checklist, ChecklistItem } from '@/lib/types'

describe('TaskModalMultiChecklistManager', () => {
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
    checklists: [],
    onAddChecklist: jest.fn(),
    onUpdateChecklist: jest.fn(),
    onRemoveChecklist: jest.fn(),
    onAddChecklistItem: jest.fn(),
    onAddChecklistItems: jest.fn(),
    onUpdateChecklistItem: jest.fn(),
    onRemoveChecklistItem: jest.fn()
  }

  it('should render without crashing', () => {
    expect(() => render(<TaskModalMultiChecklistManager {...mockProps} />)).not.toThrow()
  })

  it('should render with empty checklists', () => {
    expect(() => render(<TaskModalMultiChecklistManager {...mockProps} />)).not.toThrow()
  })

  it('should render with checklists', () => {
    const mockChecklist = createMockChecklist({
      items: [createMockChecklistItem()]
    })
    const propsWithChecklists = {
      ...mockProps,
      checklists: [mockChecklist]
    }

    expect(() => render(<TaskModalMultiChecklistManager {...propsWithChecklists} />)).not.toThrow()
  })
})
