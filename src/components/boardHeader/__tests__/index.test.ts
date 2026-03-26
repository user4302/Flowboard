describe('boardHeader/index.ts', () => {
  it('exports BoardHeader main component', () => {
    const { BoardHeader } = require('../index');
    expect(BoardHeader).toBeDefined();
  });

  it('exports BoardHeaderTitle sub-component', () => {
    const { BoardHeaderTitle } = require('../index');
    expect(BoardHeaderTitle).toBeDefined();
  });

  it('exports BoardHeaderViewNavigation sub-component', () => {
    const { BoardHeaderViewNavigation } = require('../index');
    expect(BoardHeaderViewNavigation).toBeDefined();
  });

  it('exports BoardHeaderActionMenu sub-component', () => {
    const { BoardHeaderActionMenu } = require('../index');
    expect(BoardHeaderActionMenu).toBeDefined();
  });

  it('exports useBoardHeaderTitle hook', () => {
    const { useBoardHeaderTitle } = require('../index');
    expect(useBoardHeaderTitle).toBeDefined();
  });

  it('exports useBoardHeaderActions hook', () => {
    const { useBoardHeaderActions } = require('../index');
    expect(useBoardHeaderActions).toBeDefined();
  });

  it('exports exportData service function', () => {
    const { exportData } = require('../index');
    expect(exportData).toBeDefined();
  });

  it('exports importData service function', () => {
    const { importData } = require('../index');
    expect(importData).toBeDefined();
  });

  it('exports all expected items', () => {
    const exports = require('../index');

    const expectedExports = [
      'BoardHeader',
      'BoardHeaderTitle',
      'BoardHeaderViewNavigation',
      'BoardHeaderActionMenu',
      'useBoardHeaderTitle',
      'useBoardHeaderActions',
      'exportData',
      'importData'
    ];

    expectedExports.forEach(exportName => {
      expect(exports[exportName]).toBeDefined();
    });
  });

  it('has correct number of exports', () => {
    const exports = require('../index');
    expect(Object.keys(exports)).toHaveLength(8);
  });

  it('exports are functions (components, hooks, and services)', () => {
    const exports = require('../index');

    const functionExports = [
      'BoardHeader',
      'BoardHeaderTitle',
      'BoardHeaderViewNavigation',
      'BoardHeaderActionMenu',
      'useBoardHeaderTitle',
      'useBoardHeaderActions',
      'exportData',
      'importData'
    ];

    functionExports.forEach(exportName => {
      if (exports[exportName]) {
        expect(typeof exports[exportName]).toBe('function');
      }
    });
  });

  it('can import all exports simultaneously', () => {
    const imports = require('../index');

    expect(imports.BoardHeader).toBeDefined();
    expect(imports.BoardHeaderTitle).toBeDefined();
    expect(imports.BoardHeaderViewNavigation).toBeDefined();
    expect(imports.BoardHeaderActionMenu).toBeDefined();
    expect(imports.useBoardHeaderTitle).toBeDefined();
    expect(imports.useBoardHeaderActions).toBeDefined();
    expect(imports.exportData).toBeDefined();
    expect(imports.importData).toBeDefined();
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
    expect(exports.BoardHeader).toBeDefined();
    expect(exports.BoardHeaderTitle).toBeDefined();
    expect(exports.BoardHeaderViewNavigation).toBeDefined();
    expect(exports.BoardHeaderActionMenu).toBeDefined();
    expect(exports.useBoardHeaderTitle).toBeDefined();
    expect(exports.useBoardHeaderActions).toBeDefined();
    expect(exports.exportData).toBeDefined();
    expect(exports.importData).toBeDefined();
  });

  it('service functions are exported correctly', () => {
    const { exportData, importData } = require('../index');

    // These should be functions from BoardHeaderImportExport
    expect(typeof exportData).toBe('function');
    expect(typeof importData).toBe('function');
  });

  it('hooks are exported correctly', () => {
    const { useBoardHeaderTitle, useBoardHeaderActions } = require('../index');

    // These should be functions from hooks directory
    expect(typeof useBoardHeaderTitle).toBe('function');
    expect(typeof useBoardHeaderActions).toBe('function');
  });

  it('components are exported correctly', () => {
    const { BoardHeader, BoardHeaderTitle, BoardHeaderViewNavigation, BoardHeaderActionMenu } = require('../index');

    // These should be functions (React components)
    expect(typeof BoardHeader).toBe('function');
    expect(typeof BoardHeaderTitle).toBe('function');
    expect(typeof BoardHeaderViewNavigation).toBe('function');
    expect(typeof BoardHeaderActionMenu).toBe('function');
  });
});
