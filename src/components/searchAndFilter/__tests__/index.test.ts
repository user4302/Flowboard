// Basic test for index
describe('index', () => {
  it('should exist as a module', () => {
    expect(() => require('../index')).not.toThrow()
  })

  it('should have exports', () => {
    const module = require('../index')
    expect(module).toBeDefined()
  })
})
