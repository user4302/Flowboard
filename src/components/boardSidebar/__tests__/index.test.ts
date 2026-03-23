describe('boardSidebar/index.ts', () => {
  it('exports BoardSidebar main component', () => {
    const { BoardSidebar } = require('../index');
    expect(BoardSidebar).toBeDefined();
  });

  it('exports all sub-components', () => {
    const {
      BoardSidebarBackdrop,
      BoardSidebarHeader,
      BoardSidebarBoardList,
      BoardSidebarItem,
      BoardSidebarCreationForm
    } = require('../index');

    expect(BoardSidebarBackdrop).toBeDefined();
    expect(BoardSidebarHeader).toBeDefined();
    expect(BoardSidebarBoardList).toBeDefined();
    expect(BoardSidebarItem).toBeDefined();
    expect(BoardSidebarCreationForm).toBeDefined();
  });

  it('exports all hooks', () => {
    const { useBoardSidebarState, useBoardSidebarActions } = require('../index');

    expect(useBoardSidebarState).toBeDefined();
    expect(useBoardSidebarActions).toBeDefined();
  });

  it('exports all types', () => {
    const types = require('../index');

    // Type exports should be available
    expect(types).toBeDefined();
  });

  it('exports all expected items', () => {
    const exports = require('../index');

    expect(Object.keys(exports)).toContain('BoardSidebar');
    expect(Object.keys(exports)).toContain('BoardSidebarBackdrop');
    expect(Object.keys(exports)).toContain('BoardSidebarHeader');
    expect(Object.keys(exports)).toContain('BoardSidebarBoardList');
    expect(Object.keys(exports)).toContain('BoardSidebarItem');
    expect(Object.keys(exports)).toContain('BoardSidebarCreationForm');
    expect(Object.keys(exports)).toContain('useBoardSidebarState');
    expect(Object.keys(exports)).toContain('useBoardSidebarActions');
  });

  it('has correct number of exports', () => {
    const exports = require('../index');
    expect(Object.keys(exports)).toHaveLength(8);
  });

  it('exports are functions (components and hooks)', () => {
    const exports = require('../index');

    const functionExports = [
      'BoardSidebar',
      'BoardSidebarBackdrop',
      'BoardSidebarHeader',
      'BoardSidebarBoardList',
      'BoardSidebarItem',
      'BoardSidebarCreationForm',
      'useBoardSidebarState',
      'useBoardSidebarActions'
    ];

    functionExports.forEach(exportName => {
      if (exports[exportName]) {
        expect(typeof exports[exportName]).toBe('function');
      }
    });
  });

  it('can import all exports simultaneously', () => {
    const imports = require('../index');

    expect(imports.BoardSidebar).toBeDefined();
    expect(imports.BoardSidebarBackdrop).toBeDefined();
    expect(imports.BoardSidebarHeader).toBeDefined();
    expect(imports.BoardSidebarBoardList).toBeDefined();
    expect(imports.BoardSidebarItem).toBeDefined();
    expect(imports.BoardSidebarCreationForm).toBeDefined();
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

  it('re-exports from correct modules', () => {
    // This test ensures the re-exports are working correctly
    const exports = require('../index');

    // If any of these are undefined, it means the re-export failed
    expect(exports.BoardSidebar).toBeDefined();
    expect(exports.BoardSidebarBackdrop).toBeDefined();
    expect(exports.BoardSidebarHeader).toBeDefined();
    expect(exports.BoardSidebarBoardList).toBeDefined();
    expect(exports.BoardSidebarItem).toBeDefined();
    expect(exports.BoardSidebarCreationForm).toBeDefined();
    expect(exports.useBoardSidebarState).toBeDefined();
    expect(exports.useBoardSidebarActions).toBeDefined();
  });
});
