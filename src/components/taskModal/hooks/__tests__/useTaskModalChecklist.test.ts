import { renderHook } from '@testing-library/react'
import { useTaskModalChecklist } from '../useTaskModalChecklist'
import { Checklist, ChecklistItem } from '@/lib/types'

describe('useTaskModalChecklist', () => {
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
    boardId: 'board1',
    cardId: 'card1',
    initialChecklists: []
  }

  it('should export useTaskModalChecklist hook', () => {
    expect(typeof useTaskModalChecklist).toBe('function')
  })

  it('should return checklist management functions', () => {
    const { result } = renderHook(() => useTaskModalChecklist(mockProps))
    
    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe('object')
    expect(typeof result.current.addChecklist).toBe('function')
    expect(typeof result.current.updateChecklist).toBe('function')
    expect(typeof result.current.removeChecklist).toBe('function')
    expect(typeof result.current.addChecklistItem).toBe('function')
    expect(typeof result.current.addChecklistItems).toBe('function')
    expect(typeof result.current.updateChecklistItem).toBe('function')
    expect(typeof result.current.removeChecklistItem).toBe('function')
  })

  it('should handle empty initial checklists', () => {
    const { result } = renderHook(() => useTaskModalChecklist(mockProps))
    
    expect(result.current.localChecklists).toBeDefined()
    expect(Array.isArray(result.current.localChecklists)).toBe(true)
  })

  it('should handle initial checklists', () => {
    const mockChecklist = createMockChecklist()
    const propsWithChecklists = {
      ...mockProps,
      initialChecklists: [mockChecklist]
    }
    
    const { result } = renderHook(() => useTaskModalChecklist(propsWithChecklists))
    
    expect(result.current).toBeDefined()
  })

  it('should provide addChecklist function', () => {
    const { result } = renderHook(() => useTaskModalChecklist(mockProps))
    
    expect(typeof result.current.addChecklist).toBe('function')
    
    // Should not throw when called
    expect(() => result.current.addChecklist('Test Checklist')).not.toThrow()
  })

  it('should provide updateChecklist function', () => {
    const { result } = renderHook(() => useTaskModalChecklist(mockProps))
    
    expect(typeof result.current.updateChecklist).toBe('function')
  })

  it('should provide removeChecklist function', () => {
    const { result } = renderHook(() => useTaskModalChecklist(mockProps))
    
    expect(typeof result.current.removeChecklist).toBe('function')
  })

  it('should provide item management functions', () => {
    const { result } = renderHook(() => useTaskModalChecklist(mockProps))
    
    expect(typeof result.current.addChecklistItem).toBe('function')
    expect(typeof result.current.updateChecklistItem).toBe('function')
    expect(typeof result.current.removeChecklistItem).toBe('function')
  })
})
