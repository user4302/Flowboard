/**
 * Unit Tests for Migration Utilities
 */

import { 
  migrateBoardColors, 
  validateLabelColor, 
  validateListColor, 
  needsMigration,
  getMigrationStats 
} from '../migrationUtils';
import { Board, Label, List } from '../types';

describe('Migration Utilities', () => {
  const mockBoard: Board = {
    id: 'test-board',
    name: 'Test Board',
    labels: [
      { id: '1', text: 'Old Label', color: 'bg-red-500' },
      { id: '2', text: 'Hex Label', color: '#22c55e' },
      { id: '3', text: 'Invalid Label', color: 'invalid-color' }
    ],
    lists: [
      { 
        id: 'list1', 
        title: 'List 1', 
        cards: [], 
        position: 0,
        color: 'bg-blue-100'
      },
      { 
        id: 'list2', 
        title: 'List 2', 
        cards: [], 
        position: 1,
        color: '#f1f5f9'
      },
      { 
        id: 'list3', 
        title: 'List 3', 
        cards: [], 
        position: 2,
        color: 'invalid-list-color'
      }
    ],
    members: [],
    archivedCards: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  describe('migrateBoardColors', () => {
    it('migrates Tailwind color classes to hex', () => {
      const result = migrateBoardColors(mockBoard);
      
      const migratedLabel = result.board.labels.find(l => l.id === '1');
      expect(migratedLabel?.color).toBe('#ef4444');
    });

    it('keeps hex colors unchanged', () => {
      const result = migrateBoardColors(mockBoard);
      
      const hexLabel = result.board.labels.find(l => l.id === '2');
      expect(hexLabel?.color).toBe('#22c55e');
    });

    it('handles invalid colors with fallback', () => {
      const result = migrateBoardColors(mockBoard);
      
      const invalidLabel = result.board.labels.find(l => l.id === '3');
      expect(invalidLabel?.color).toBe('#64748b');
    });

    it('migrates list colors', () => {
      const result = migrateBoardColors(mockBoard);
      
      const migratedList = result.board.lists.find(l => l.id === 'list1');
      expect(migratedList?.color).toBe('#dbeafe');
    });

    it('removes invalid list colors', () => {
      const result = migrateBoardColors(mockBoard);
      
      const invalidList = result.board.lists.find(l => l.id === 'list3');
      expect(invalidList?.color).toBeUndefined();
    });

    it('provides migration statistics', () => {
      const result = migrateBoardColors(mockBoard);
      
      expect(result.labelsMigrated).toBe(2); // bg-red-500 and invalid-color
      expect(result.listsMigrated).toBe(2); // bg-blue-100 and invalid-list-color
      expect(result.warnings).toHaveLength(2);
    });

    it('updates board timestamp', () => {
      const result = migrateBoardColors(mockBoard);
      
      expect(result.board.updatedAt).toBeInstanceOf(Date);
      expect(result.board.updatedAt.getTime()).toBeGreaterThan(mockBoard.updatedAt.getTime());
    });
  });

  describe('validateLabelColor', () => {
    it('validates correct hex colors', () => {
      const label: Label = { id: '1', text: 'Test', color: '#ff0000' };
      const result = validateLabelColor(label);
      
      expect(result.color).toBe('#ff0000');
    });

    it('adds # to hex colors missing it', () => {
      const label: Label = { id: '1', text: 'Test', color: 'ff0000' };
      const result = validateLabelColor(label);
      
      expect(result.color).toBe('#ff0000');
    });

    it('converts Tailwind colors to hex', () => {
      const label: Label = { id: '1', text: 'Test', color: 'bg-red-500' };
      const result = validateLabelColor(label);
      
      expect(result.color).toBe('#ef4444');
    });

    it('uses fallback for invalid colors', () => {
      const label: Label = { id: '1', text: 'Test', color: 'invalid' };
      const result = validateLabelColor(label);
      
      expect(result.color).toBe('#64748b');
    });
  });

  describe('validateListColor', () => {
    it('returns list unchanged if no color', () => {
      const list: List = { id: '1', title: 'Test', cards: [], position: 0 };
      const result = validateListColor(list);
      
      expect(result.color).toBeUndefined();
    });

    it('validates correct hex colors', () => {
      const list: List = { id: '1', title: 'Test', cards: [], position: 0, color: '#ff0000' };
      const result = validateListColor(list);
      
      expect(result.color).toBe('#ff0000');
    });

    it('converts Tailwind colors to hex', () => {
      const list: List = { id: '1', title: 'Test', cards: [], position: 0, color: 'bg-red-500' };
      const result = validateListColor(list);
      
      expect(result.color).toBe('#ef4444');
    });

    it('removes invalid colors', () => {
      const list: List = { id: '1', title: 'Test', cards: [], position: 0, color: 'invalid' };
      const result = validateListColor(list);
      
      expect(result.color).toBeUndefined();
    });
  });

  describe('needsMigration', () => {
    it('returns true for boards with Tailwind colors', () => {
      const board: Board = {
        ...mockBoard,
        labels: [{ id: '1', text: 'Test', color: 'bg-red-500' }],
        lists: []
      };
      
      expect(needsMigration(board)).toBe(true);
    });

    it('returns true for boards with invalid hex', () => {
      const board: Board = {
        ...mockBoard,
        labels: [{ id: '1', text: 'Test', color: 'ff0000' }], // missing #
        lists: []
      };
      
      expect(needsMigration(board)).toBe(true);
    });

    it('returns false for fully migrated boards', () => {
      const board: Board = {
        ...mockBoard,
        labels: [{ id: '1', text: 'Test', color: '#ff0000' }],
        lists: []
      };
      
      expect(needsMigration(board)).toBe(false);
    });

    it('returns true for boards with old list colors', () => {
      const board: Board = {
        ...mockBoard,
        labels: [],
        lists: [{ id: '1', title: 'Test', cards: [], position: 0, color: 'bg-red-500' }]
      };
      
      expect(needsMigration(board)).toBe(true);
    });
  });

  describe('getMigrationStats', () => {
    it('calculates correct statistics', () => {
      const stats = getMigrationStats(mockBoard);
      
      expect(stats.totalLabels).toBe(3);
      expect(stats.labelsNeedingMigration).toBe(2); // bg-red-500 and invalid-color
      expect(stats.totalLists).toBe(3);
      expect(stats.listsNeedingMigration).toBe(2); // bg-blue-100 and invalid-list-color
    });

    it('handles board with no migration needed', () => {
      const cleanBoard: Board = {
        ...mockBoard,
        labels: [
          { id: '1', text: 'Test 1', color: '#ff0000' },
          { id: '2', text: 'Test 2', color: '#00ff00' }
        ],
        lists: [
          { id: '1', title: 'List 1', cards: [], position: 0, color: '#0000ff' }
        ]
      };
      
      const stats = getMigrationStats(cleanBoard);
      
      expect(stats.labelsNeedingMigration).toBe(0);
      expect(stats.listsNeedingMigration).toBe(0);
    });

    it('handles board with all items needing migration', () => {
      const oldBoard: Board = {
        ...mockBoard,
        labels: [
          { id: '1', text: 'Test 1', color: 'bg-red-500' },
          { id: '2', text: 'Test 2', color: 'bg-blue-500' }
        ],
        lists: [
          { id: '1', title: 'List 1', cards: [], position: 0, color: 'bg-green-500' }
        ]
      };
      
      const stats = getMigrationStats(oldBoard);
      
      expect(stats.labelsNeedingMigration).toBe(2);
      expect(stats.listsNeedingMigration).toBe(1);
    });
  });
});
