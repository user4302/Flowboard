describe('boardSidebar hooks index', () => {
  it('should export boardSidebar hooks', () => {
    expect(() => require('../index')).not.toThrow()
  })

  it('should have default exports', () => {
    const indexModule = require('../index')
    expect(indexModule).toBeDefined()
  })
})
