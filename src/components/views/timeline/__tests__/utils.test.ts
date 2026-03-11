import { calculateTimelineHeight, getTaskPosition, getTaskColor } from '../utils'
import { Card, Label } from '@/lib/types'

describe('Timeline Utils', () => {
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

  describe('calculateTimelineHeight', () => {
    it('should export calculateTimelineHeight function', () => {
      expect(typeof calculateTimelineHeight).toBe('function')
    })

    it('should return 60px for empty tasks array', () => {
      const result = calculateTimelineHeight([], [])
      expect(result).toBe(60)
    })

    it('should return a positive number for non-empty tasks array', () => {
      const mockTask = createMockCard({
        startDate: new Date(),
        dueDate: new Date()
      })
      const dateRange = [new Date()]
      const result = calculateTimelineHeight([mockTask], dateRange)
      expect(result).toBeGreaterThan(0)
    })

    it('should handle tasks without dates', () => {
      const mockTask = createMockCard()
      const dateRange = [new Date()]
      const result = calculateTimelineHeight([mockTask], dateRange)
      expect(result).toBeGreaterThan(0)
    })
  })

  describe('getTaskPosition', () => {
    it('should export getTaskPosition function', () => {
      expect(typeof getTaskPosition).toBe('function')
    })

    it('should return position data for valid inputs', () => {
      const mockTask = createMockCard({
        startDate: new Date(),
        dueDate: new Date()
      })
      const dateRange = [new Date()]
      const result = getTaskPosition(mockTask, [mockTask], 0, dateRange, 'day')
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    })
  })

  describe('getTaskColor', () => {
    it('should export getTaskColor function', () => {
      expect(typeof getTaskColor).toBe('function')
    })

    it('should return color data for task without labels', () => {
      const mockTask = createMockCard()
      const result = getTaskColor(mockTask)
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    })

    it('should return color data for task with labels', () => {
      const mockLabel: Label = {
        id: 'label1',
        text: 'Test Label',
        color: '#ff0000'
      }
      const mockTask = createMockCard({
        labelIds: ['label1']
      })
      const result = getTaskColor(mockTask, [mockLabel])
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    })
  })
})
