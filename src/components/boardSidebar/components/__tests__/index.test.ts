describe('boardSidebar/components/index.ts', () => {
  it('exports BoardSidebarBackdrop', () => {
    const { BoardSidebarBackdrop } = require('../index');
    expect(BoardSidebarBackdrop).toBeDefined();
  });

  it('exports BoardSidebarHeader', () => {
    const { BoardSidebarHeader } = require('../index');
    expect(BoardSidebarHeader).toBeDefined();
  });

  it('exports BoardSidebarBoardList', () => {
    const { BoardSidebarBoardList } = require('../index');
    expect(BoardSidebarBoardList).toBeDefined();
  });

  it('exports BoardSidebarItem', () => {
    const { BoardSidebarItem } = require('../index');
    expect(BoardSidebarItem).toBeDefined();
  });

  it('exports BoardSidebarCreationForm', () => {
    const { BoardSidebarCreationForm } = require('../index');
    expect(BoardSidebarCreationForm).toBeDefined();
  });

  it('exports all expected components', () => {
    const exports = require('../index');

    expect(Object.keys(exports)).toContain('BoardSidebarBackdrop');
    expect(Object.keys(exports)).toContain('BoardSidebarHeader');
    expect(Object.keys(exports)).toContain('BoardSidebarBoardList');
    expect(Object.keys(exports)).toContain('BoardSidebarItem');
    expect(Object.keys(exports)).toContain('BoardSidebarCreationForm');
  });

  it('has correct number of exports', () => {
    const exports = require('../index');
    expect(Object.keys(exports)).toHaveLength(5);
  });

  it('exports are functions (components)', () => {
    const exports = require('../index');

    Object.values(exports).forEach(exported => {
      expect(typeof exported).toBe('function');
    });
  });

  it('can import all exports simultaneously', () => {
    const imports = require('../index');

    expect(imports.BoardSidebarBackdrop).toBeDefined();
    expect(imports.BoardSidebarHeader).toBeDefined();
    expect(imports.BoardSidebarBoardList).toBeDefined();
    expect(imports.BoardSidebarItem).toBeDefined();
    expect(imports.BoardSidebarCreationForm).toBeDefined();
  });

  it('module exists and can be required', () => {
    expect(() => require('../index')).not.toThrow();
  });

  it('has no default export', () => {
    const exports = require('../index');
    expect(exports.default).toBeUndefined();
  });
});
