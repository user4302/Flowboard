import {
  cn,
  generateId,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  isCardOverdue,
  isCardDueSoon,
  getChecklistProgress,
  debounce,
  reorderArray,
  moveArrayItem,
  getInitials,
  getAvatarColor,
} from '../utils'

// Mock date-fns functions
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  format: jest.fn(),
  isToday: jest.fn(),
  isPast: jest.fn(),
  formatDistanceToNow: jest.fn(),
}))

import { format, isToday, isPast, formatDistanceToNow } from 'date-fns'

describe('Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
    })

    it('should handle conditional classes', () => {
      expect(cn('bg-red-500', false && 'hidden', 'text-white')).toBe('bg-red-500 text-white')
    })

    it('should handle empty input', () => {
      expect(cn()).toBe('')
    })
  })

  describe('generateId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateId()
      const id2 = generateId()

      expect(id1.length).toBeGreaterThan(15) // Minimum reasonable length
      expect(id2.length).toBeGreaterThan(15)
      expect(id1).not.toBe(id2)
    })

    it('should generate alphanumeric IDs', () => {
      const id = generateId()
      expect(/^[a-z0-9]+$/i.test(id)).toBe(true)
    })
  })

  describe('formatDate', () => {
    it('should return empty string for null/undefined date', () => {
      expect(formatDate(null)).toBe('')
      expect(formatDate(undefined)).toBe('')
    })

    it('should format date correctly', () => {
      const mockDate = new Date('2026-03-10')
        ; (format as jest.Mock).mockReturnValue('Mar 10, 2026')

      const result = formatDate(mockDate)

      expect(format).toHaveBeenCalledWith(mockDate, 'MMM d, yyyy')
      expect(result).toBe('Mar 10, 2026')
    })
  })

  describe('formatDateTime', () => {
    it('should return empty string for null/undefined date', () => {
      expect(formatDateTime(null)).toBe('')
      expect(formatDateTime(undefined)).toBe('')
    })

    it('should format date-time correctly', () => {
      const mockDate = new Date('2026-03-10T08:30:00')
        ; (format as jest.Mock).mockReturnValue('Mar 10, 2026 8:30 AM')

      const result = formatDateTime(mockDate)

      expect(format).toHaveBeenCalledWith(mockDate, 'MMM d, yyyy h:mm a')
      expect(result).toBe('Mar 10, 2026 8:30 AM')
    })
  })

  describe('formatRelativeTime', () => {
    it('should return empty string for null/undefined date', () => {
      expect(formatRelativeTime(null)).toBe('')
      expect(formatRelativeTime(undefined)).toBe('')
    })

    it('should format relative time correctly', () => {
      const mockDate = new Date('2026-03-10')
        ; (formatDistanceToNow as jest.Mock).mockReturnValue('2 hours ago')

      const result = formatRelativeTime(mockDate)

      expect(formatDistanceToNow).toHaveBeenCalledWith(mockDate, { addSuffix: true })
      expect(result).toBe('2 hours ago')
    })
  })

  describe('isCardOverdue', () => {
    it('should return false for cards without due date', () => {
      expect(isCardOverdue({})).toBe(false)
      expect(isCardOverdue({ dueDate: undefined })).toBe(false)
    })

    it('should return true for past due dates (not today)', () => {
      const pastDate = new Date('2026-03-09')
        ; (isPast as jest.Mock).mockReturnValue(true)
        ; (isToday as jest.Mock).mockReturnValue(false)

      expect(isCardOverdue({ dueDate: pastDate })).toBe(true)
    })

    it('should return false for today\'s due date', () => {
      const today = new Date()
        ; (isPast as jest.Mock).mockReturnValue(true)
        ; (isToday as jest.Mock).mockReturnValue(true)

      expect(isCardOverdue({ dueDate: today })).toBe(false)
    })

    it('should return false for future dates', () => {
      const futureDate = new Date('2026-03-15')
        ; (isPast as jest.Mock).mockReturnValue(false)

      expect(isCardOverdue({ dueDate: futureDate })).toBe(false)
    })
  })

  describe('isCardDueSoon', () => {
    it('should return false for cards without due date', () => {
      expect(isCardDueSoon({})).toBe(false)
      expect(isCardDueSoon({ dueDate: undefined })).toBe(false)
    })

    it('should return true for cards due within specified days', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      expect(isCardDueSoon({ dueDate: tomorrow }, 3)).toBe(true)
    })

    it('should return false for cards due after specified days', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 10)

      expect(isCardDueSoon({ dueDate: futureDate }, 3)).toBe(false)
    })

    it('should use default 3 days when not specified', () => {
      const twoDaysFromNow = new Date()
      twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2)

      expect(isCardDueSoon({ dueDate: twoDaysFromNow })).toBe(true)
    })
  })

  describe('getChecklistProgress', () => {
    it('should return 0 for null/undefined checklists', () => {
      expect(getChecklistProgress(null)).toBe(0)
      expect(getChecklistProgress(undefined)).toBe(0)
    })

    it('should return 0 for empty checklists array', () => {
      expect(getChecklistProgress([])).toBe(0)
    })

    it('should calculate progress correctly', () => {
      const checklists = [
        {
          items: [
            { done: true },
            { done: false },
            { done: true },
          ],
        },
        {
          items: [
            { done: false },
            { done: true },
          ],
        },
      ]

      // 3 completed out of 5 total = 60%
      expect(getChecklistProgress(checklists)).toBe(60)
    })

    it('should return 0 for checklists with no items', () => {
      const checklists = [{ items: [] }]
      expect(getChecklistProgress(checklists)).toBe(0)
    })

    it('should handle 100% completion', () => {
      const checklists = [
        {
          items: [
            { done: true },
            { done: true },
          ],
        },
      ]

      expect(getChecklistProgress(checklists)).toBe(100)
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should delay function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1', 'arg2')

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should cancel previous call when called again', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('first')
      debouncedFn('second')

      jest.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledWith('second')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('reorderArray', () => {
    it('should reorder array correctly', () => {
      const array = ['a', 'b', 'c', 'd']
      const result = reorderArray(array, 1, 3)

      expect(result).toEqual(['a', 'c', 'd', 'b'])
    })

    it('should handle moving to earlier position', () => {
      const array = ['a', 'b', 'c', 'd']
      const result = reorderArray(array, 2, 0)

      expect(result).toEqual(['c', 'a', 'b', 'd'])
    })

    it('should not modify original array', () => {
      const array = ['a', 'b', 'c', 'd']
      reorderArray(array, 1, 3)

      expect(array).toEqual(['a', 'b', 'c', 'd'])
    })

    it('should handle same index', () => {
      const array = ['a', 'b', 'c', 'd']
      const result = reorderArray(array, 1, 1)

      expect(result).toEqual(['a', 'b', 'c', 'd'])
    })
  })

  describe('moveArrayItem', () => {
    it('should move item within same array', () => {
      const array = ['a', 'b', 'c', 'd']
      const result = moveArrayItem(array, 1, 3)

      expect(result.source).toEqual(['a', 'c', 'd', 'b'])
      expect(result.target).toEqual(['a', 'c', 'd', 'b'])
    })

    it('should move item to different array', () => {
      const source = ['a', 'b', 'c']
      const target = ['x', 'y', 'z']
      const result = moveArrayItem(source, 1, 0, target)

      expect(result.source).toEqual(['a', 'c'])
      expect(result.target).toEqual(['b', 'x', 'y', 'z'])
    })

    it('should not modify original arrays', () => {
      const source = ['a', 'b', 'c']
      const target = ['x', 'y', 'z']
      moveArrayItem(source, 1, 0, target)

      expect(source).toEqual(['a', 'b', 'c'])
      expect(target).toEqual(['x', 'y', 'z'])
    })
  })

  describe('getInitials', () => {
    it('should get initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD')
    })

    it('should handle single word names', () => {
      expect(getInitials('John')).toBe('J')
    })

    it('should limit to 2 characters', () => {
      expect(getInitials('John Michael Doe')).toBe('JM')
    })

    it('should uppercase initials', () => {
      expect(getInitials('john doe')).toBe('JD')
    })

    it('should handle empty string', () => {
      expect(getInitials('')).toBe('')
    })

    it('should handle extra spaces', () => {
      expect(getInitials('  John  Doe  ')).toBe('JD')
    })
  })

  describe('getAvatarColor', () => {
    it('should return a valid color class', () => {
      const color = getAvatarColor('John Doe')
      const validColors = [
        'bg-red-500',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-green-500',
        'bg-teal-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500',
      ]

      expect(validColors).toContain(color)
    })

    it('should return consistent color for same name', () => {
      const name = 'John Doe'
      const color1 = getAvatarColor(name)
      const color2 = getAvatarColor(name)

      expect(color1).toBe(color2)
    })

    it('should return different colors for different names', () => {
      const color1 = getAvatarColor('John Doe')
      const color2 = getAvatarColor('Jane Smith')

      expect(color1).not.toBe(color2)
    })

    it('should handle empty string', () => {
      const color = getAvatarColor('')
      const validColors = [
        'bg-red-500',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-green-500',
        'bg-teal-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500',
      ]

      expect(validColors).toContain(color)
    })
  })
})
