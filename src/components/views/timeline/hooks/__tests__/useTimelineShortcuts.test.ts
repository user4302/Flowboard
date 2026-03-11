// Basic test for useTimelineShortcuts
describe('useTimelineShortcuts', () => {
  it('should exist as a module', () => {
    expect(() => require('../useTimelineShortcuts')).not.toThrow()
  })

  it('should have exports', () => {
    const module = require('../useTimelineShortcuts')
    expect(module).toBeDefined()
  })
})
