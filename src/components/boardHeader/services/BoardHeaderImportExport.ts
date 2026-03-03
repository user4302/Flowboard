'use client';

import { fromUTCString } from '@/lib/dateUtils';
import { useBoardStore } from '@/store';
import { Board, List, Card, Label } from '@/lib/types';

interface ImportedLabel {
  id: string;
  text: string;
  color: string;
}

interface ImportedCardData {
  title: string;
  description?: string;
  startDate?: string | Date;
  dueDate?: string | Date;
  completed?: boolean;
  labelIds?: string[];
  labels?: ImportedLabel[];
  members?: string[];
  checklist?: Array<{
    id: string;
    text: string;
    done: boolean;
  }>;
}

interface ImportedListData {
  title: string;
  cards: ImportedCardData[];
}

interface ImportedBoardData {
  name: string;
  labels?: ImportedLabel[];
  lists: ImportedListData[];
}

/**
 * Export data to JSON file
 * 
 * Creates a downloadable JSON file containing:
 * - Name and export timestamp
 * - All lists with their cards
 * - Complete card data including labels, members, dates, etc.
 * 
 * @param data - The data object to export
 */
export const exportData = (data: Board) => {
  // Structure the data for export
  const exportData = {
    name: data.name,
    exportDate: new Date().toISOString(),
    labels: data.labels,
    lists: data.lists.map((list: List) => ({
      title: list.title,
      cards: list.cards.map((card: Card) => ({
        ...card // Spread entire card object to include all fields like completed, etc.
      }))
    }))
  };

  // Generate filename with name and current date
  const filename = `${data.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;

  // Create and trigger download
  const dataStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Clean up object URL
};

/**
 * Import data from JSON file
 * 
 * Handles the complete import process:
 * - Validates JSON file format
 * - Creates new data from imported data
 * - Recreates all lists and cards
 * - Preserves card properties (dates, labels, members, checklists, completed state)
 * 
 * @param file - The JSON file to import
 * @param setCurrentBoard - Function to set the current board after import
 */
export const importData = (file: File, setCurrentBoard: (boardId: string) => void) => {
  if (file.type !== 'application/json') {
    alert('Please select a valid JSON file');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const boardData = JSON.parse(e.target?.result as string);
      if (boardData.name && boardData.lists) {
        // Create new board from imported data
        const newBoard = useBoardStore.getState().createBoard(boardData.name);

        // Import lists and cards with their properties
        // Store a mapping of old label IDs (from file) to new label IDs (created in store)
        const labelMap = new Map<string, string>();

        // Recreate labels at board level if they exist
        if (boardData.labels) {
          boardData.labels.forEach((labelData: ImportedLabel) => {
            const existing = newBoard.labels.find(l => l.text === labelData.text && l.color === labelData.color);
            if (existing) {
              labelMap.set(labelData.id, existing.id);
            } else {
              const newLabel = useBoardStore.getState().createBoardLabel(newBoard.id, {
                text: labelData.text,
                color: labelData.color
              });
              labelMap.set(labelData.id, newLabel.id);
            }
          });
        }

        boardData.lists.forEach((listData: ImportedListData, listIndex: number) => {
          const list = useBoardStore.getState().createList(newBoard.id, listData.title, listIndex);

          listData.cards.forEach((cardData: ImportedCardData, cardIndex: number) => {
            if (list) {
              const card = useBoardStore.getState().createCard(newBoard.id, list.id, cardData.title, cardIndex);

              // Validate dates before importing
              let startDate: Date | undefined;
              let dueDate: Date | undefined;

              // Convert string dates to Date objects using fromUTCString
              if (typeof cardData.startDate === 'string') {
                const date = fromUTCString(cardData.startDate);
                if (date && !isNaN(date.getTime())) {
                  startDate = date;
                } else {
                  console.warn('Invalid start date format:', cardData.startDate);
                  startDate = undefined;
                }
              } else if (cardData.startDate instanceof Date) {
                startDate = cardData.startDate;
              }

              if (typeof cardData.dueDate === 'string') {
                const date = fromUTCString(cardData.dueDate);
                if (date && !isNaN(date.getTime())) {
                  dueDate = date;
                } else {
                  console.warn('Invalid due date format:', cardData.dueDate);
                  dueDate = undefined;
                }
              } else if (cardData.dueDate instanceof Date) {
                dueDate = cardData.dueDate;
              }

              useBoardStore.getState().updateCard(newBoard.id, card!.id, {
                description: cardData.description,
                startDate,
                dueDate,
                completed: cardData.completed,
              });

              // Add labels to the card (handle both old and new formats)
              const importedLabelIds = cardData.labelIds || [];
              const importedLabels = cardData.labels || []; // Backward compatibility

              // Add by ID
              importedLabelIds.forEach((oldId: string) => {
                const newId = labelMap.get(oldId);
                if (newId) {
                  useBoardStore.getState().addLabelToCard(newBoard.id, card!.id, newId);
                }
              });

              // Add by text/color logic for old format
              importedLabels.forEach((labelData: ImportedLabel) => {
                const existing = newBoard.labels.find(l => l.text === labelData.text && l.color === labelData.color);
                if (existing) {
                  useBoardStore.getState().addLabelToCard(newBoard.id, card!.id, existing.id);
                } else {
                  const newLabel = useBoardStore.getState().createBoardLabel(newBoard.id, {
                    text: labelData.text,
                    color: labelData.color
                  });
                  useBoardStore.getState().addLabelToCard(newBoard.id, card!.id, newLabel.id);
                }
              });

              // Add members to the card
              cardData.members?.forEach((memberId: string) => {
                useBoardStore.getState().updateCard(newBoard.id, card!.id, {
                  members: [...card!.members, memberId]
                });
              });

              // Add checklist items and their completion status
              cardData.checklist?.forEach((item: { id: string; text: string; done: boolean }) => {
                useBoardStore.getState().addChecklistItem(newBoard.id, card!.id, item.text);
                if (item.done) {
                  useBoardStore.getState().updateChecklistItem(newBoard.id, card!.id, item.id, { done: true });
                }
              });
            }
          });
        });

        // Force UI update by switching to the new board
        setCurrentBoard(newBoard.id);
      }
    } catch (error) {
      console.error('Error importing board:', error);
      alert('Error importing board. Please check the file format.');
    }
  };
  reader.readAsText(file);
};
