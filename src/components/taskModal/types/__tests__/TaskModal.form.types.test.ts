import { cardSchema } from '../TaskModal.form.types'

// Basic test for TaskModal.form.types
describe('TaskModal.form.types', () => {
  it('should exist as a module', () => {
    expect(() => require('../TaskModal.form.types')).not.toThrow()
  })

  it('should have exports', () => {
    const module = require('../TaskModal.form.types')
    expect(module).toBeDefined()
  })

  describe('cardSchema validation', () => {
    it('should validate card with priority 0', () => {
      const validData = {
        title: 'Test Card',
        description: 'Test Description',
        priority: 0,
        startDate: '2024-01-01',
        dueDate: '2024-12-31'
      }

      const result = cardSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.priority).toBe(0)
      }
    })

    it('should validate card with priority null', () => {
      const validData = {
        title: 'Test Card',
        description: 'Test Description',
        priority: null,
        startDate: '2024-01-01',
        dueDate: '2024-12-31'
      }

      const result = cardSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.priority).toBeNull()
      }
    })

    it('should validate card with priority undefined', () => {
      const validData = {
        title: 'Test Card',
        description: 'Test Description',
        priority: undefined,
        startDate: '2024-01-01',
        dueDate: '2024-12-31'
      }

      const result = cardSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.priority).toBeNull() // Schema converts undefined to null
      }
    })

    it('should validate card with positive priority', () => {
      const validData = {
        title: 'Test Card',
        description: 'Test Description',
        priority: 50,
        startDate: '2024-01-01',
        dueDate: '2024-12-31'
      }

      const result = cardSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.priority).toBe(50)
      }
    })

    it('should validate card with priority 100', () => {
      const validData = {
        title: 'Test Card',
        description: 'Test Description',
        priority: 100,
        startDate: '2024-01-01',
        dueDate: '2024-12-31'
      }

      const result = cardSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.priority).toBe(100)
      }
    })

    it('should reject card with negative priority', () => {
      const invalidData = {
        title: 'Test Card',
        description: 'Test Description',
        priority: -1,
        startDate: '2024-01-01',
        dueDate: '2024-12-31'
      }

      const result = cardSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Priority must be between 0-100')
      }
    })

    it('should reject card with priority over 100', () => {
      const invalidData = {
        title: 'Test Card',
        description: 'Test Description',
        priority: 101,
        startDate: '2024-01-01',
        dueDate: '2024-12-31'
      }

      const result = cardSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Priority must be between 0-100')
      }
    })

    it('should handle empty string priority and convert to null', () => {
      const validData = {
        title: 'Test Card',
        description: 'Test Description',
        priority: '',
        startDate: '2024-01-01',
        dueDate: '2024-12-31'
      }

      const result = cardSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.priority).toBeNull()
      }
    })

    it('should handle string number priority and convert to number', () => {
      const validData = {
        title: 'Test Card',
        description: 'Test Description',
        priority: '50',
        startDate: '2024-01-01',
        dueDate: '2024-12-31'
      }

      const result = cardSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.priority).toBe(50)
      }
    })

    it('should handle string zero priority and convert to number', () => {
      const validData = {
        title: 'Test Card',
        description: 'Test Description',
        priority: '0',
        startDate: '2024-01-01',
        dueDate: '2024-12-31'
      }

      const result = cardSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.priority).toBe(0)
      }
    })

    it('should require title', () => {
      const invalidData = {
        title: '',
        description: 'Test Description',
        priority: 50,
        startDate: '2024-01-01',
        dueDate: '2024-12-31'
      }

      const result = cardSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title is required')
      }
    })
  })
})
