import {
  toUTCString,
  fromUTCString,
  toLocalDate,
  isUTCString,
  normalizeForStorage,
  normalizeForDisplay,
} from '../dateUtils'

describe('DateUtils', () => {
  describe('toUTCString', () => {
    it('should return undefined for undefined input', () => {
      expect(toUTCString(undefined)).toBeUndefined()
    })

    it('should convert Date object to UTC string', () => {
      const date = new Date('2026-03-10T12:00:00')
      const result = toUTCString(date)

      expect(result).toBe(date.toISOString())
      expect(typeof result).toBe('string')
    })

    it('should convert date string to UTC string', () => {
      const dateString = '2026-03-10T12:00:00'
      const date = new Date(dateString)
      const result = toUTCString(dateString)

      expect(result).toBe(date.toISOString())
    })

    it('should return undefined for invalid Date object', () => {
      const invalidDate = new Date('invalid')
      expect(toUTCString(invalidDate)).toBeUndefined()
    })

    it('should return undefined for invalid date string', () => {
      expect(toUTCString('invalid-date')).toBeUndefined()
    })

    it('should handle empty string', () => {
      expect(toUTCString('')).toBeUndefined()
    })
  })

  describe('fromUTCString', () => {
    it('should return undefined for undefined input', () => {
      expect(fromUTCString(undefined)).toBeUndefined()
    })

    it('should return Date object unchanged if valid', () => {
      const date = new Date('2026-03-10T12:00:00')
      const result = fromUTCString(date)

      expect(result).toBe(date)
    })

    it('should return undefined for invalid Date object', () => {
      const invalidDate = new Date('invalid')
      expect(fromUTCString(invalidDate)).toBeUndefined()
    })

    it('should convert UTC string to Date object', () => {
      const utcString = '2026-03-10T12:00:00.000Z'
      const result = fromUTCString(utcString)

      expect(result).toBeInstanceOf(Date)
      expect(result?.toISOString()).toBe(utcString)
    })

    it('should convert non-UTC date string to Date object', () => {
      const dateString = '2026-03-10T12:00:00'
      const date = new Date(dateString)
      const result = fromUTCString(dateString)

      expect(result).toBeInstanceOf(Date)
      expect(result?.toISOString()).toBe(date.toISOString())
    })

    it('should return undefined for invalid date string', () => {
      expect(fromUTCString('invalid-date')).toBeUndefined()
    })

    it('should handle empty string', () => {
      expect(fromUTCString('')).toBeUndefined()
    })
  })

  describe('toLocalDate', () => {
    it('should return undefined for undefined input', () => {
      expect(toLocalDate(undefined)).toBeUndefined()
    })

    it('should return Date object unchanged if valid', () => {
      const date = new Date('2026-03-10T12:00:00')
      const result = toLocalDate(date)

      expect(result).toBe(date)
    })

    it('should convert date string to Date object', () => {
      const dateString = '2026-03-10T12:00:00'
      const date = new Date(dateString)
      const result = toLocalDate(dateString)

      expect(result).toBeInstanceOf(Date)
      expect(result?.toISOString()).toBe(date.toISOString())
    })

    it('should return undefined for invalid Date object', () => {
      const invalidDate = new Date('invalid')
      expect(toLocalDate(invalidDate)).toBeUndefined()
    })

    it('should return undefined for invalid date string', () => {
      expect(toLocalDate('invalid-date')).toBeUndefined()
    })

    it('should handle empty string', () => {
      expect(toLocalDate('')).toBeUndefined()
    })
  })

  describe('isUTCString', () => {
    it('should return true for valid UTC strings', () => {
      expect(isUTCString('2026-03-10T12:00:00Z')).toBe(true)
      expect(isUTCString('2026-03-10T12:00:00.000Z')).toBe(true)
      expect(isUTCString('2026-03-10T12:00:00.123Z')).toBe(true)
    })

    it('should return false for non-UTC strings', () => {
      expect(isUTCString('2026-03-10T12:00:00')).toBe(false)
      expect(isUTCString('2026-03-10 12:00:00')).toBe(false)
      expect(isUTCString('invalid-date')).toBe(false)
      expect(isUTCString('')).toBe(false)
    })

    it('should return false for non-string values', () => {
      expect(isUTCString(123)).toBe(false)
      expect(isUTCString({})).toBe(false)
      expect(isUTCString([])).toBe(false)
      expect(isUTCString(new Date())).toBe(false)
      expect(isUTCString(null)).toBe(false)
      expect(isUTCString(undefined)).toBe(false)
    })

    it('should handle edge cases', () => {
      // isUTCString only checks format, not date validity
      expect(isUTCString('2026-13-10T12:00:00Z')).toBe(true) // Format is valid, even though month is invalid
      expect(isUTCString('2026-03-32T12:00:00Z')).toBe(true) // Format is valid, even though day is invalid
      expect(isUTCString('2026-03-10T25:00:00Z')).toBe(true) // Format is valid, even though hour is invalid
      expect(isUTCString('2026-03-10T12:60:00Z')).toBe(true) // Format is valid, even though minute is invalid
      expect(isUTCString('2026-03-10T12:00:60Z')).toBe(true) // Format is valid, even though second is invalid
      expect(isUTCString('2026-03-10T12:00:00.123456Z')).toBe(false) // Too many milliseconds
      expect(isUTCString('2026-03-10T12:00:00.123+00:00')).toBe(false) // Has timezone instead of Z
    })
  })

  describe('normalizeForStorage', () => {
    it('should be an alias for toUTCString', () => {
      const date = new Date('2026-03-10T12:00:00')
      const expected = toUTCString(date)
      const result = normalizeForStorage(date)

      expect(result).toBe(expected)
    })

    it('should handle undefined', () => {
      expect(normalizeForStorage(undefined)).toBeUndefined()
    })

    it('should handle Date objects', () => {
      const date = new Date('2026-03-10T12:00:00')
      const result = normalizeForStorage(date)

      expect(result).toBe(date.toISOString())
    })

    it('should handle date strings', () => {
      const dateString = '2026-03-10T12:00:00'
      const date = new Date(dateString)
      const result = normalizeForStorage(dateString)

      expect(result).toBe(date.toISOString())
    })
  })

  describe('normalizeForDisplay', () => {
    it('should be an alias for toLocalDate', () => {
      const dateString = '2026-03-10T12:00:00'
      const expected = toLocalDate(dateString)
      const result = normalizeForDisplay(dateString)

      expect(result).toEqual(expected)
    })

    it('should handle undefined', () => {
      expect(normalizeForDisplay(undefined)).toBeUndefined()
    })

    it('should handle Date objects', () => {
      const date = new Date('2026-03-10T12:00:00')
      const result = normalizeForDisplay(date)

      expect(result).toBe(date)
    })

    it('should handle date strings', () => {
      const dateString = '2026-03-10T12:00:00'
      const date = new Date(dateString)
      const result = normalizeForDisplay(dateString)

      expect(result).toEqual(date)
    })
  })

  describe('Edge cases and consistency', () => {
    it('should handle round-trip conversion', () => {
      const originalDate = new Date('2026-03-10T15:30:45.123')

      // Convert to UTC string and back
      const utcString = toUTCString(originalDate)
      const restoredDate = fromUTCString(utcString)

      expect(restoredDate).toBeInstanceOf(Date)
      expect(restoredDate?.toISOString()).toBe(originalDate.toISOString())
    })

    it('should handle different timezone dates', () => {
      // Create a date in a specific timezone
      const dateInUTC = new Date('2026-03-10T12:00:00Z')
      const dateInLocal = new Date('2026-03-10T12:00:00+05:00')

      const utcString1 = toUTCString(dateInUTC)
      const utcString2 = toUTCString(dateInLocal)

      expect(typeof utcString1).toBe('string')
      expect(typeof utcString2).toBe('string')
      expect(utcString1).not.toBe(utcString2)
    })

    it('should handle dates at boundaries', () => {
      const epoch = new Date(0)
      const farFuture = new Date('9999-12-31T23:59:59.999Z')
      const farPast = new Date('0001-01-01T00:00:00.000Z')

      expect(toUTCString(epoch)).toBe(epoch.toISOString())
      expect(toUTCString(farFuture)).toBe(farFuture.toISOString())
      expect(toUTCString(farPast)).toBe(farPast.toISOString())
    })
  })
})
