describe('boardShare/hooks/index.ts', () => {
  it('exports useInviteModal hook', () => {
    const { useInviteModal } = require('../index');
    expect(useInviteModal).toBeDefined();
  });

  it('exports useJoinBoardModal hook', () => {
    const { useJoinBoardModal } = require('../index');
    expect(useJoinBoardModal).toBeDefined();
  });

  it('exports useMemberManagement hook', () => {
    const { useMemberManagement } = require('../index');
    expect(useMemberManagement).toBeDefined();
  });

  it('exports all expected hooks', () => {
    const exports = require('../index');

    expect(Object.keys(exports)).toContain('useInviteModal');
    expect(Object.keys(exports)).toContain('useJoinBoardModal');
    expect(Object.keys(exports)).toContain('useMemberManagement');
  });

  it('has correct number of exports', () => {
    const exports = require('../index');
    // Should have at least the 3 main hooks
    expect(Object.keys(exports).length).toBeGreaterThanOrEqual(3);
  });

  it('exports are functions (hooks)', () => {
    const exports = require('../index');

    expect(typeof exports.useInviteModal).toBe('function');
    expect(typeof exports.useJoinBoardModal).toBe('function');
    expect(typeof exports.useMemberManagement).toBe('function');
  });

  it('can import all exports simultaneously', () => {
    const imports = require('../index');

    expect(imports.useInviteModal).toBeDefined();
    expect(imports.useJoinBoardModal).toBeDefined();
    expect(imports.useMemberManagement).toBeDefined();
  });

  it('module exists and can be required', () => {
    expect(() => require('../index')).not.toThrow();
  });

  it('has no default export', () => {
    const exports = require('../index');
    expect(exports.default).toBeUndefined();
  });

  it('re-exports from correct modules', () => {
    // This test ensures the re-exports are working correctly
    const exports = require('../index');

    // If any of these are undefined, it means the re-export failed
    expect(exports.useInviteModal).toBeDefined();
    expect(exports.useJoinBoardModal).toBeDefined();
    expect(exports.useMemberManagement).toBeDefined();
  });

  it('uses export * syntax correctly', () => {
    // Since we use export *, all exports from the individual modules should be available
    const exports = require('../index');

    // At minimum, the main hooks should be available
    expect(exports.useInviteModal).toBeDefined();
    expect(exports.useJoinBoardModal).toBeDefined();
    expect(exports.useMemberManagement).toBeDefined();
  });
});
