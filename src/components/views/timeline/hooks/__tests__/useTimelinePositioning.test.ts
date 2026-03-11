import { renderHook } from '@testing-library/react'
import { useTimelinePositioning } from '../useTimelinePositioning'
import { Card } from '@/lib/types'

describe('useTimelinePositioning', () => {
  const createMockCard = (overrides: Partial<Card> = {}): Card => ({
    id: '1',
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

  it('should export useTimelinePositioning hook', () => {
    expect(typeof useTimelinePositioning).toBe('function')
  })

  it('should return position data for valid card', () => {
    const mockCard = createMockCard({
      startDate: new Date(),
      dueDate: new Date()
    })

    const { result } = renderHook(() =>
      useTimelinePositioning(mockCard, [mockCard], 0, [new Date()], 'day')
    )

    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe('object')
  })

  it('should handle card without dates', () => {
    const mockCard = createMockCard()

    const { result } = renderHook(() =>
      useTimelinePositioning(mockCard, [mockCard], 0, [new Date()], 'day')
    )

    expect(result.current).toBeDefined()
  })

  it('should handle empty cards array', () => {
    const mockCard = createMockCard({
      startDate: new Date(),
      dueDate: new Date()
    })

    const { result } = renderHook(() =>
      useTimelinePositioning(mockCard, [], 0, [new Date()], 'day')
    )

    expect(result.current).toBeDefined()
  })

  it('should handle different zoom levels', () => {
    const mockCard = createMockCard({
      startDate: new Date(),
      dueDate: new Date()
    })

    const zoomLevels = ['day', 'week', '2weeks', 'month', 'year'] as const

    zoomLevels.forEach(zoomLevel => {
      const { result } = renderHook(() =>
        useTimelinePositioning(mockCard, [mockCard], 0, [new Date()], zoomLevel)
      )

      expect(result.current).toBeDefined()
    })
  })
})
