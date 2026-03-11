// Basic test for utils
describe('utils', () => {
  it('should exist as a module', () => {
    expect(() => require('../utils')).not.toThrow()
  })

  it('should have exports', () => {
    const module = require('../utils')
    expect(module).toBeDefined()
  })
})
