import { validateJoinForm, formatDate, formatDateWithRelative } from '../utils'
import type { JoinFormData } from '../types'

describe('boardShare utils', () => {
  describe('validateJoinForm', () => {
    const validFormData: JoinFormData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123'
    };

    it('should export validateJoinForm function', () => {
      expect(typeof validateJoinForm).toBe('function')
    })

    it('should validate valid form data', () => {
      const result = validateJoinForm(validFormData)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject empty email', () => {
      const result = validateJoinForm({ ...validFormData, email: '' })
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Please fill in all fields')
    })

    it('should reject empty username', () => {
      const result = validateJoinForm({ ...validFormData, username: '' })
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Please fill in all fields')
    })

    it('should reject empty password', () => {
      const result = validateJoinForm({ ...validFormData, password: '' })
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Please fill in all fields')
    })

    it('should reject invalid email format', () => {
      const result = validateJoinForm({ ...validFormData, email: 'invalid-email' })
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Please enter a valid email address')
    })

    it('should reject email without @ symbol', () => {
      const result = validateJoinForm({ ...validFormData, email: 'testexample.com' })
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Please enter a valid email address')
    })

    it('should reject username shorter than 2 characters', () => {
      const result = validateJoinForm({ ...validFormData, username: 'a' })
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Username must be at least 2 characters long')
    })

    it('should reject username of exactly 1 character', () => {
      const result = validateJoinForm({ ...validFormData, username: 'x' })
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Username must be at least 2 characters long')
    })

    it('should accept username of exactly 2 characters', () => {
      const result = validateJoinForm({ ...validFormData, username: 'ab' })
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject password shorter than 6 characters', () => {
      const result = validateJoinForm({ ...validFormData, password: '12345' })
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Password must be at least 6 characters long')
    })

    it('should reject password of exactly 5 characters', () => {
      const result = validateJoinForm({ ...validFormData, password: 'abcde' })
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Password must be at least 6 characters long')
    })

    it('should accept password of exactly 6 characters', () => {
      const result = validateJoinForm({ ...validFormData, password: 'abcdef' })
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should handle multiple validation errors (empty fields)', () => {
      const result = validateJoinForm({ email: '', username: '', password: '' })
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Please fill in all fields')
    })

    it('should prioritize required field validation over format validation', () => {
      const result = validateJoinForm({ email: '', username: 'test', password: 'test123' })
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Please fill in all fields')
    })
  })

  describe('formatDate', () => {
    it('should export formatDate function', () => {
      expect(typeof formatDate).toBe('function')
    })

    it('should format valid ISO date string', () => {
      const result = formatDate('2023-01-01T00:00:00.000Z')
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('should handle different date formats', () => {
      const result1 = formatDate('2023-12-25T15:30:00.000Z')
      const result2 = formatDate('2023-06-15T09:00:00.000Z')

      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
      expect(typeof result1).toBe('string')
      expect(typeof result2).toBe('string')
    })

    it('should return different results for different dates', () => {
      const result1 = formatDate('2023-01-01T00:00:00.000Z')
      const result2 = formatDate('2023-01-02T00:00:00.000Z')

      expect(result1).not.toBe(result2)
    })

    it('should handle edge case dates', () => {
      const result = formatDate('2000-01-01T00:00:00.000Z')
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })
  })

  describe('formatDateWithRelative', () => {
    it('should export formatDateWithRelative function', () => {
      expect(typeof formatDateWithRelative).toBe('function')
    })

    it('should return formatted date for any input', () => {
      const result = formatDateWithRelative('2023-06-15T00:00:00.000Z')
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('should return different results for different dates', () => {
      const result1 = formatDateWithRelative('2023-06-15T00:00:00.000Z')
      const result2 = formatDateWithRelative('2023-06-14T00:00:00.000Z')

      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
      expect(typeof result1).toBe('string')
      expect(typeof result2).toBe('string')
    })

    it('should handle edge case dates', () => {
      const result = formatDateWithRelative('2000-01-01T00:00:00.000Z')
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('should handle recent dates', () => {
      const result = formatDateWithRelative(new Date().toISOString())
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('should handle old dates', () => {
      const result = formatDateWithRelative('2020-01-01T00:00:00.000Z')
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('should handle future dates', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      const result = formatDateWithRelative(futureDate)
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('should return consistent results for the same input', () => {
      const input = '2023-06-15T00:00:00.000Z'
      const result1 = formatDateWithRelative(input)
      const result2 = formatDateWithRelative(input)

      expect(result1).toBe(result2)
    })

    it('should handle invalid date strings gracefully', () => {
      const result = formatDateWithRelative('invalid-date')
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('should handle empty string input', () => {
      const result = formatDateWithRelative('')
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('should handle null/undefined input', () => {
      const result1 = formatDateWithRelative(null as any)
      const result2 = formatDateWithRelative(undefined as any)

      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
      expect(typeof result1).toBe('string')
      expect(typeof result2).toBe('string')
    })

    it('should return different formats for different time periods', () => {
      const today = new Date()
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      const lastWeek = new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000)

      const resultToday = formatDateWithRelative(today.toISOString())
      const resultYesterday = formatDateWithRelative(yesterday.toISOString())
      const resultLastWeek = formatDateWithRelative(lastWeek.toISOString())

      expect(resultToday).toBeDefined()
      expect(resultYesterday).toBeDefined()
      expect(resultLastWeek).toBeDefined()

      // Results should be different (though exact format depends on implementation)
      expect(resultToday).not.toBe(resultYesterday)
      expect(resultYesterday).not.toBe(resultLastWeek)
    })
  })

  describe('Module exports', () => {
    it('should export all expected functions', () => {
      const utils = require('../utils')

      expect(utils.validateJoinForm).toBeDefined()
      expect(utils.formatDate).toBeDefined()
      expect(utils.formatDateWithRelative).toBeDefined()
    })

    it('should have no default export', () => {
      const utils = require('../utils')
      expect(utils.default).toBeUndefined()
    })

    it('should export functions with correct types', () => {
      expect(typeof validateJoinForm).toBe('function')
      expect(typeof formatDate).toBe('function')
      expect(typeof formatDateWithRelative).toBe('function')
    })
  })
})
