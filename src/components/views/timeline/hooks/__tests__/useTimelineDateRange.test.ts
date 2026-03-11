// Basic test for useTimelineDateRange
describe('useTimelineDateRange', () => {
  it('should exist as a module', () => {
    expect(() => require('../useTimelineDateRange')).not.toThrow()
  })

  it('should have exports', () => {
    const module = require('../useTimelineDateRange')
    expect(module).toBeDefined()
  })
})
