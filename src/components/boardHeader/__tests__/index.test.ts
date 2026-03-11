describe('boardHeader index', () => {
  it('should export boardHeader components', () => {
    expect(() => require('../index')).not.toThrow()
  })

  it('should have default exports', () => {
    const indexModule = require('../index')
    expect(indexModule).toBeDefined()
  })
})
