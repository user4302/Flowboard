'use client';

import { useState } from 'react';
import { useBoardStore } from '@/store';
import { exportData, importData } from '../services/importExport';

/**
 * Custom hook for managing actions (export/import)
 * 
 * Provides handlers for export and import functionality
 */
export const useActions = (currentBoard: any) => {
  /**
   * Export data to JSON file
   */
  const handleExportBoard = () => {
    if (currentBoard) {
      exportData(currentBoard);
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
    }
  };

  return {
    handleExportBoard,
    handleImportBoard,
  };
};
