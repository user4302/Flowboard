/**
 * Data Migration Utilities
 * 
 * Provides utilities for migrating data from old formats to new formats,
 * particularly for converting Tailwind CSS color classes to hex codes.
 * 
 * Used during board import/export and data format transitions.
 */

import { Board, Label, List, Card } from './types';
import { tailwindToHex, isValidHex } from './colorUtils';

/**
 * Migration result interface
 */
interface MigrationResult {
  /** Migrated board data */
  board: Board;
  /** Number of labels migrated */
  labelsMigrated: number;
  /** Number of lists migrated */
  listsMigrated: number;
  /** Migration warnings or errors */
  warnings: string[];
}

/**
 * Migrates a board from old Tailwind color format to hex format
 * Handles backward compatibility for imported data
 * 
 * @param board - The board data to migrate
 * @returns Migration result with updated board and statistics
 */
export function migrateBoardColors(board: Board): MigrationResult {
  const warnings: string[] = [];
  let labelsMigrated = 0;
  let listsMigrated = 0;

  // Migrate board labels
  const migratedLabels = board.labels.map(label => {
    if (label.color.startsWith('#')) {
      // Already in hex format
      return label;
    } else if (label.color.startsWith('bg-')) {
      // Tailwind CSS class - migrate to hex
      labelsMigrated++;
      const hexColor = tailwindToHex(label.color);
      return {
        ...label,
        color: hexColor
      };
    } else {
      // Unknown format - try to validate or fallback
      if (isValidHex(label.color)) {
        // Valid hex but missing #
        const hexColor = label.color.startsWith('#') ? label.color : `#${label.color}`;
        if (hexColor !== label.color) {
          labelsMigrated++;
          warnings.push(`Label "${label.text}" color format fixed: ${label.color} → ${hexColor}`);
        }
        return {
          ...label,
          color: hexColor
        };
      } else {
        // Invalid color - fallback to default
        warnings.push(`Label "${label.text}" has invalid color "${label.color}", using default #64748b`);
        labelsMigrated++;
        return {
          ...label,
          color: '#64748b' // slate-500
        };
      }
    }
  });

  // Migrate list colors (if they exist)
  const migratedLists = board.lists.map(list => {
    if (!list.color) {
      return list; // No color to migrate
    }

    if (list.color.startsWith('#')) {
      // Already in hex format
      return list;
    } else if (list.color.startsWith('bg-')) {
      // Tailwind CSS class - migrate to hex
      listsMigrated++;
      const hexColor = tailwindToHex(list.color);
      return {
        ...list,
        color: hexColor
      };
    } else {
      // Unknown format - try to validate or fallback
      if (isValidHex(list.color)) {
        // Valid hex but missing #
        const hexColor = list.color.startsWith('#') ? list.color : `#${list.color}`;
        if (hexColor !== list.color) {
          listsMigrated++;
          warnings.push(`List "${list.title}" color format fixed: ${list.color} → ${hexColor}`);
        }
        return {
          ...list,
          color: hexColor
        };
      } else {
        // Invalid color - remove color
        warnings.push(`List "${list.title}" has invalid color "${list.color}", removing color`);
        listsMigrated++;
        const { color, ...listWithoutColor } = list;
        return listWithoutColor;
      }
    }
  });

  const migratedBoard: Board = {
    ...board,
    labels: migratedLabels,
    lists: migratedLists,
    updatedAt: new Date()
  };

  return {
    board: migratedBoard,
    labelsMigrated,
    listsMigrated,
    warnings
  };
}

/**
 * Validates and fixes a single label color
 * 
 * @param label - The label to validate
 * @returns Fixed label with valid hex color
 */
export function validateLabelColor(label: Label): Label {
  if (isValidHex(label.color)) {
    // Ensure it starts with #
    return {
      ...label,
      color: label.color.startsWith('#') ? label.color : `#${label.color}`
    };
  } else if (label.color.startsWith('bg-')) {
    // Convert from Tailwind
    return {
      ...label,
      color: tailwindToHex(label.color)
    };
  } else {
    // Invalid color - use fallback
    console.warn(`Invalid label color "${label.color}" for label "${label.text}", using fallback`);
    return {
      ...label,
      color: '#64748b' // slate-500
    };
  }
}

/**
 * Validates and fixes a single list color
 * 
 * @param list - The list to validate
 * @returns Fixed list with valid hex color or no color
 */
export function validateListColor(list: List): List {
  if (!list.color) {
    return list; // No color to validate
  }

  if (isValidHex(list.color)) {
    // Ensure it starts with #
    return {
      ...list,
      color: list.color.startsWith('#') ? list.color : `#${list.color}`
    };
  } else if (list.color.startsWith('bg-')) {
    // Convert from Tailwind
    return {
      ...list,
      color: tailwindToHex(list.color)
    };
  } else {
    // Invalid color - remove it
    console.warn(`Invalid list color "${list.color}" for list "${list.title}", removing color`);
    const { color, ...listWithoutColor } = list;
    return listWithoutColor;
  }
}

/**
 * Batch migrates multiple boards
 * 
 * @param boards - Array of boards to migrate
 * @returns Array of migration results
 */
export function migrateMultipleBoards(boards: Board[]): MigrationResult[] {
  return boards.map(board => migrateBoardColors(board));
}

/**
 * Checks if a board needs migration
 * 
 * @param board - The board to check
 * @returns True if board has colors that need migration
 */
export function needsMigration(board: Board): boolean {
  // Check labels
  const hasOldLabelColors = board.labels.some(label => 
    !label.color.startsWith('#') || label.color.startsWith('bg-')
  );

  // Check lists
  const hasOldListColors = board.lists.some(list => 
    list.color && (!list.color.startsWith('#') || list.color.startsWith('bg-'))
  );

  return hasOldLabelColors || hasOldListColors;
}

/**
 * Gets migration statistics for a board
 * 
 * @param board - The board to analyze
 * @returns Statistics about colors that need migration
 */
export function getMigrationStats(board: Board): {
  totalLabels: number;
  labelsNeedingMigration: number;
  totalLists: number;
  listsNeedingMigration: number;
} {
  const totalLabels = board.labels.length;
  const labelsNeedingMigration = board.labels.filter(label => 
    !label.color.startsWith('#') || label.color.startsWith('bg-')
  ).length;

  const totalLists = board.lists.length;
  const listsNeedingMigration = board.lists.filter(list => 
    list.color && (!list.color.startsWith('#') || list.color.startsWith('bg-'))
  ).length;

  return {
    totalLabels,
    labelsNeedingMigration,
    totalLists,
    listsNeedingMigration
  };
}
