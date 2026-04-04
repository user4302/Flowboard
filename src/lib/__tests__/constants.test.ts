import {
  APP_VERSION,
  BASIC_LABEL_COLORS,
  LIST_COLORS_HEX,
  VIEWS,
  ANIMATION_DURATION,
  BREAKPOINTS,
  STORAGE_KEYS,
} from '../constants'

// Mock package.json
jest.mock('../../../package.json', () => ({
  version: '1.4.0',
}))

describe('Constants', () => {
  describe('APP_VERSION', () => {
    it('should match package.json version', () => {
      expect(APP_VERSION).toBe('1.4.0')
    })
  })

  describe('VIEWS', () => {
    it('should contain all expected views', () => {
      const viewIds = VIEWS.map(view => view.id)
      expect(viewIds).toContain('kanban')
      expect(viewIds).toContain('timeline')
      expect(viewIds).toContain('calendar')
      expect(viewIds).toContain('table')
    })

    it('should have proper view structure', () => {
      VIEWS.forEach(view => {
        expect(view).toHaveProperty('id')
        expect(view).toHaveProperty('name')
        expect(view).toHaveProperty('icon')
        expect(typeof view.id).toBe('string')
        expect(typeof view.name).toBe('string')
        expect(typeof view.icon).toBe('string')
      })
    })

    it('should have unique view IDs', () => {
      const viewIds = VIEWS.map(view => view.id)
      const uniqueIds = new Set(viewIds)
      expect(uniqueIds.size).toBe(viewIds.length)
    })

    it('should have unique view names', () => {
      const viewNames = VIEWS.map(view => view.name)
      const uniqueNames = new Set(viewNames)
      expect(uniqueNames.size).toBe(viewNames.length)
    })
  })

  describe('ANIMATION_DURATION', () => {
    it('should contain expected duration values', () => {
      expect(ANIMATION_DURATION).toHaveProperty('fast')
      expect(ANIMATION_DURATION).toHaveProperty('normal')
      expect(ANIMATION_DURATION).toHaveProperty('slow')
    })

    it('should have numeric values', () => {
      expect(typeof ANIMATION_DURATION.fast).toBe('number')
      expect(typeof ANIMATION_DURATION.normal).toBe('number')
      expect(typeof ANIMATION_DURATION.slow).toBe('number')
    })

    it('should have logical duration ordering', () => {
      expect(ANIMATION_DURATION.fast).toBeLessThan(ANIMATION_DURATION.normal)
      expect(ANIMATION_DURATION.normal).toBeLessThan(ANIMATION_DURATION.slow)
    })

    it('should have reasonable duration values', () => {
      expect(ANIMATION_DURATION.fast).toBeGreaterThan(50)
      expect(ANIMATION_DURATION.slow).toBeLessThan(2000)
    })
  })

  describe('BREAKPOINTS', () => {
    it('should contain expected breakpoint values', () => {
      expect(BREAKPOINTS).toHaveProperty('sm')
      expect(BREAKPOINTS).toHaveProperty('md')
      expect(BREAKPOINTS).toHaveProperty('lg')
      expect(BREAKPOINTS).toHaveProperty('xl')
    })

    it('should have string values ending with px', () => {
      Object.values(BREAKPOINTS).forEach(breakpoint => {
        expect(typeof breakpoint).toBe('string')
        expect(breakpoint).toMatch(/^\d+px$/)
      })
    })

    it('should have logical breakpoint ordering', () => {
      const numericValues = Object.values(BREAKPOINTS).map(bp => parseInt(bp))
      expect(numericValues[0]).toBeLessThan(numericValues[1]) // sm < md
      expect(numericValues[1]).toBeLessThan(numericValues[2]) // md < lg
      expect(numericValues[2]).toBeLessThan(numericValues[3]) // lg < xl
    })

    it('should have reasonable breakpoint values', () => {
      expect(parseInt(BREAKPOINTS.sm)).toBeGreaterThan(500)
      expect(parseInt(BREAKPOINTS.xl)).toBeLessThan(2000)
    })
  })

  describe('STORAGE_KEYS', () => {
    it('should contain expected storage keys', () => {
      expect(STORAGE_KEYS).toHaveProperty('BOARDS')
      expect(STORAGE_KEYS).toHaveProperty('CURRENT_BOARD')
      expect(STORAGE_KEYS).toHaveProperty('UI_STATE')
      expect(STORAGE_KEYS).toHaveProperty('THEME')
    })

    it('should have string values', () => {
      Object.values(STORAGE_KEYS).forEach(key => {
        expect(typeof key).toBe('string')
      })
    })

    it('should have app-prefixed keys', () => {
      Object.values(STORAGE_KEYS).forEach(key => {
        expect(key).toMatch(/^flowboard-/)
      })
    })

    it('should have descriptive key names', () => {
      expect(STORAGE_KEYS.BOARDS).toBe('flowboard-boards')
      expect(STORAGE_KEYS.CURRENT_BOARD).toBe('flowboard-current-board')
      expect(STORAGE_KEYS.UI_STATE).toBe('flowboard-ui-state')
      expect(STORAGE_KEYS.THEME).toBe('flowboard-theme')
    })
  })

  describe('Constants structure', () => {
    it('should have properly structured constants', () => {
      // Verify that constants are properly exported and accessible
      expect(Array.isArray(BASIC_LABEL_COLORS)).toBe(true)
      expect(Array.isArray(LIST_COLORS_HEX)).toBe(true)
      expect(Array.isArray(VIEWS)).toBe(true)
      expect(typeof ANIMATION_DURATION).toBe('object')
      expect(typeof BREAKPOINTS).toBe('object')
      expect(typeof STORAGE_KEYS).toBe('object')
    })
  })
})
