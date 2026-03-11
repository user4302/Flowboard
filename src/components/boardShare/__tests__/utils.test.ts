import { validateJoinForm, formatDate, formatDateWithRelative } from '../utils'

describe('boardShare utils', () => {
  describe('validateJoinForm', () => {
    it('should export validateJoinForm function', () => {
      expect(typeof validateJoinForm).toBe('function')
    })

    it('should handle form validation', () => {
      const formData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      }
      const result = validateJoinForm(formData)
      expect(result).toBeDefined()
    })
  })

  describe('formatDate', () => {
    it('should export formatDate function', () => {
      expect(typeof formatDate).toBe('function')
    })

    it('should handle date formatting', () => {
      const result = formatDate('2023-01-01T00:00:00.000Z')
      expect(result).toBeDefined()
    })
  })

  describe('formatDateWithRelative', () => {
    it('should export formatDateWithRelative function', () => {
      expect(typeof formatDateWithRelative).toBe('function')
    })

    it('should handle relative date formatting', () => {
      const result = formatDateWithRelative('2023-01-01T00:00:00.000Z')
      expect(result).toBeDefined()
    })
  })
})
