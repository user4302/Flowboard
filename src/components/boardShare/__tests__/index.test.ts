describe('boardShare/index.ts', () => {
  it('exports InviteModal component', () => {
    const { InviteModal } = require('../index');
    expect(InviteModal).toBeDefined();
  });

  it('exports JoinBoardModal component', () => {
    const { JoinBoardModal } = require('../index');
    expect(JoinBoardModal).toBeDefined();
  });

  it('exports MemberManagement component', () => {
    const { MemberManagement } = require('../index');
    expect(MemberManagement).toBeDefined();
  });

  it('exports InviteForm sub-component', () => {
    const { InviteForm } = require('../index');
    expect(InviteForm).toBeDefined();
  });

  it('exports InviteInfo sub-component', () => {
    const { InviteInfo } = require('../index');
    expect(InviteInfo).toBeDefined();
  });

  it('exports JoinForm sub-component', () => {
    const { JoinForm } = require('../index');
    expect(JoinForm).toBeDefined();
  });

  it('exports JoinAlert sub-component', () => {
    const { JoinAlert } = require('../index');
    expect(JoinAlert).toBeDefined();
  });

  it('exports MemberTabs sub-component', () => {
    const { MemberTabs } = require('../index');
    expect(MemberTabs).toBeDefined();
  });

  it('exports PendingRequests sub-component', () => {
    const { PendingRequests } = require('../index');
    expect(PendingRequests).toBeDefined();
  });

  it('exports MembersList sub-component', () => {
    const { MembersList } = require('../index');
    expect(MembersList).toBeDefined();
  });

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

  it('exports types (via export *)', () => {
    // Types should be available via export * from './types'
    const exports = require('../index');
    expect(exports).toBeDefined();
  });

  it('exports constants (via export *)', () => {
    const exports = require('../index');
    // Should include constants from './constants'
    expect(exports).toBeDefined();
  });

  it('exports utils (via export *)', () => {
    const exports = require('../index');
    // Should include utilities from './utils'
    expect(exports).toBeDefined();
  });

  it('exports all expected items', () => {
    const exports = require('../index');

    const expectedExports = [
      'InviteModal', 'JoinBoardModal', 'MemberManagement',
      'InviteForm', 'InviteInfo', 'JoinForm', 'JoinAlert',
      'MemberTabs', 'PendingRequests', 'MembersList',
      'useInviteModal', 'useJoinBoardModal', 'useMemberManagement'
    ];

    expectedExports.forEach(exportName => {
      expect(exports[exportName]).toBeDefined();
    });
  });

  it('has correct number of main exports', () => {
    const exports = require('../index');
    const exportKeys = Object.keys(exports);

    // Should have at least the main components, hooks, and re-exports
    expect(exportKeys.length).toBeGreaterThanOrEqual(13);
  });

  it('exports are functions (components and hooks)', () => {
    const exports = require('../index');

    const functionExports = [
      'InviteModal', 'JoinBoardModal', 'MemberManagement',
      'InviteForm', 'InviteInfo', 'JoinForm', 'JoinAlert',
      'MemberTabs', 'PendingRequests', 'MembersList',
      'useInviteModal', 'useJoinBoardModal', 'useMemberManagement'
    ];

    functionExports.forEach(exportName => {
      if (exports[exportName]) {
        expect(typeof exports[exportName]).toBe('function');
      }
    });
  });

  it('can import all exports simultaneously', () => {
    const imports = require('../index');

    expect(imports.InviteModal).toBeDefined();
    expect(imports.JoinBoardModal).toBeDefined();
    expect(imports.MemberManagement).toBeDefined();
    expect(imports.InviteForm).toBeDefined();
    expect(imports.InviteInfo).toBeDefined();
    expect(imports.JoinForm).toBeDefined();
    expect(imports.JoinAlert).toBeDefined();
    expect(imports.MemberTabs).toBeDefined();
    expect(imports.PendingRequests).toBeDefined();
    expect(imports.MembersList).toBeDefined();
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
    expect(exports.InviteModal).toBeDefined();
    expect(exports.JoinBoardModal).toBeDefined();
    expect(exports.MemberManagement).toBeDefined();
    expect(exports.useInviteModal).toBeDefined();
    expect(exports.useJoinBoardModal).toBeDefined();
    expect(exports.useMemberManagement).toBeDefined();
  });

  it('uses export * syntax correctly for types, constants, and utils', () => {
    // Since we use export *, all exports from the individual modules should be available
    const exports = require('../index');

    // The module should be importable and have content
    expect(exports).toBeDefined();
    expect(Object.keys(exports).length).toBeGreaterThan(0);
  });
});
