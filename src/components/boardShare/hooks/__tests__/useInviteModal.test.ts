// Basic test for useInviteModal
describe('useInviteModal', () => {
  it('should exist as a module', () => {
    expect(() => require('../useInviteModal')).not.toThrow()
  })

  it('should have exports', () => {
    const module = require('../useInviteModal')
    expect(module).toBeDefined()
  })
})
