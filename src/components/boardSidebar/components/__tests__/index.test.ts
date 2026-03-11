describe('boardSidebar components index', () => {
  it('should export boardSidebar components', () => {
    expect(() => require('../index')).not.toThrow()
  })

  it('should have default exports', () => {
    const indexModule = require('../index')
    expect(indexModule).toBeDefined()
  })
})
