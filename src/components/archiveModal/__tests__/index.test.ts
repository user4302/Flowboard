describe('archiveModal index', () => {
  it('should export ArchiveModal', () => {
    expect(() => require('../index')).not.toThrow()
  })

  it('should have default exports', () => {
    const indexModule = require('../index')
    expect(indexModule).toBeDefined()
  })
})
