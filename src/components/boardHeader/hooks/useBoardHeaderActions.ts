'use client';

import { useState } from 'react';
import { useBoardStore } from '@/store';
import { exportData, importData } from '../services/BoardHeaderImportExport';
import { Board } from '@/lib/types';

/**
 * Custom hook for managing BoardHeader actions (export/import)
 * 
 * Provides handlers for export and import functionality
 */
export const useBoardHeaderActions = (currentBoard: Board) => {
  /**
   * Export data to JSON file
   */
  const handleExportBoard = () => {
    if (currentBoard) {
      exportData({ board: currentBoard });
    }
  };

  /**
   * Import data from JSON file
   * 
   * @param event - File input change event
   */
  const handleImportBoard = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importData(file, (boardId: string) => {
        useBoardStore.getState().setCurrentBoard(boardId);
      });
      event.target.value = '';
    }
  };

  return {
    handleExportBoard,
    handleImportBoard,
  };
};
