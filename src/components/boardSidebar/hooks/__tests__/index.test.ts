describe('boardSidebar/hooks/index.ts', () => {
  it('exports useBoardSidebarState', () => {
    const { useBoardSidebarState } = require('../index');
    expect(useBoardSidebarState).toBeDefined();
  });

  it('exports useBoardSidebarActions', () => {
    const { useBoardSidebarActions } = require('../index');
    expect(useBoardSidebarActions).toBeDefined();
  });

  it('exports all expected hooks', () => {
    const exports = require('../index');

    expect(Object.keys(exports)).toContain('useBoardSidebarState');
    expect(Object.keys(exports)).toContain('useBoardSidebarActions');
  });

  it('has correct number of exports', () => {
    const exports = require('../index');
    expect(Object.keys(exports)).toHaveLength(2);
  });

  it('exports are functions (hooks)', () => {
    const exports = require('../index');

    Object.values(exports).forEach(exported => {
      expect(typeof exported).toBe('function');
    });
  });

  it('can import all exports simultaneously', () => {
    const imports = require('../index');

    expect(imports.useBoardSidebarState).toBeDefined();
    expect(imports.useBoardSidebarActions).toBeDefined();
  });

  it('module exists and can be required', () => {
    expect(() => require('../index')).not.toThrow();
  });

  it('has no default export', () => {
    const exports = require('../index');
    expect(exports.default).toBeUndefined();
  });
});
