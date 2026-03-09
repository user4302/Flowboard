import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/lib/constants';
import { toUTCString, fromUTCString } from '@/lib/dateUtils';
import { Board, List, Card, Label, User, Checklist, ChecklistItem, ArchivedCard } from '@/lib/types';
import { generateId } from '@/lib/utils';

import {
  BoardState,
  createBoardSlice,
  createListSlice,
  createCardSlice,
  createLabelSlice,
  createMemberSlice,
  createChecklistSlice,
  createUtilsSlice,
  reorderArray,
} from './boards';

// Re-export utility function for backward compatibility
export { reorderArray };

/**
 * Board store - Zustand store for board state management
 * Handles all board, list, card, label, member, and checklist operations
 * Persists data to localStorage for offline functionality
 */
export const useBoardStore = create<BoardState>()(
  persist(
    (set, get, store) => ({
      ...createBoardSlice(set, get, store),
      ...createListSlice(set, get, store),
      ...createCardSlice(set, get, store),
      ...createLabelSlice(set, get, store),
      ...createMemberSlice(set, get, store),
      ...createChecklistSlice(set, get, store),
      ...createUtilsSlice(set, get, store),
    }),
    {
      name: STORAGE_KEYS.BOARDS,
      partialize: (state) => ({
        boards: state.boards,
        currentBoardId: state.currentBoardId,
      }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          try {
            const data = JSON.parse(str);

            // Convert UTC strings to local Date objects and migrate labels
            if (data.state?.boards) {
              data.state.boards = data.state.boards.map((board: Board) => {
                // Ensure board has labels array and archivedCards array
                let boardLabels = Array.isArray(board.labels) ? [...board.labels] : [];
                let archivedCards = Array.isArray(board.archivedCards) ? [...board.archivedCards] : [];

                // Ensure all board labels have IDs
                boardLabels = boardLabels.map(l => ({ ...l, id: l.id || generateId() }));
                const boardLabelIds = new Set(boardLabels.map((l: Label) => l.id));

                // Migrate archived cards if needed
                archivedCards = archivedCards.map((ac: ArchivedCard) => ({
                  ...ac,
                  id: ac.id || generateId(),
                  archivedAt: ac.archivedAt ? new Date(ac.archivedAt) : new Date(),
                  card: {
                    ...ac.card,
                    startDate: (fromUTCString(ac.card.startDate) || ac.card.startDate) as Date,
                    dueDate: (fromUTCString(ac.card.dueDate) || ac.card.dueDate) as Date,
                    createdAt: (fromUTCString(ac.card.createdAt) || ac.card.createdAt) as Date,
                    updatedAt: (fromUTCString(ac.card.updatedAt) || ac.card.updatedAt) as Date,
                  }
                }));

                const newLists = board.lists.map((list: List) => ({
                  ...list,
                  cards: list.cards.map((card: Card & { labels?: Label[] }): Card => {
                    // Start with existing labelIds or empty array
                    let labelIds = Array.isArray(card.labelIds) ? [...card.labelIds] : [];

                    // If card still has old labels array, migrate them
                    if (card.labels && card.labels.length > 0) {
                      card.labels.forEach((oldLabel: Label) => {
                        // Ensure old label has an ID
                        const labelToMigrate = {
                          ...oldLabel,
                          id: oldLabel.id || generateId()
                        };

                        // If this label is not in boardLabels, add it
                        if (!boardLabelIds.has(labelToMigrate.id)) {
                          boardLabels.push(labelToMigrate);
                          boardLabelIds.add(labelToMigrate.id);
                        }

                        // If this label's ID is not in the card's labelIds, add it
                        if (!labelIds.includes(labelToMigrate.id)) {
                          labelIds.push(labelToMigrate.id);
                        }
                      });
                    }

                    // Safety: Ensure all labelIds actually exist in boardLabels
                    // This handles cases where bad migrations created dead IDs
                    labelIds = labelIds.filter(id => boardLabelIds.has(id));

                    // Ensure labelIds is unique
                    labelIds = Array.from(new Set(labelIds));

                    // Migrate old single checklist to new checklists array
                    let checklists = Array.isArray(card.checklists) ? [...card.checklists] : [];
                    if ((card as any).checklist && checklists.length === 0) {
                      checklists = [{
                        id: `cl-${generateId()}`,
                        name: 'Checklist',
                        items: (card as any).checklist,
                        position: 0,
                        createdAt: card.createdAt || new Date(),
                        updatedAt: card.updatedAt || new Date()
                      }];
                    }

                    return {
                      ...card,
                      labelIds,
                      checklists,
                      startDate: (fromUTCString(card.startDate) || card.startDate) as Date,
                      dueDate: (fromUTCString(card.dueDate) || card.dueDate) as Date,
                      createdAt: (fromUTCString(card.createdAt) || card.createdAt) as Date,
                      updatedAt: (fromUTCString(card.updatedAt) || card.updatedAt) as Date,
                    };
                  })
                }));

                return {
                  ...board,
                  labels: boardLabels,
                  archivedCards: archivedCards,
                  lists: newLists
                };
              });
            }

            return data;
          } catch (error) {
            console.error('Error parsing stored board data:', error);
            localStorage.removeItem(name);
            return null;
          }
        },
        setItem: (name, value) => {
          // Convert Date objects to UTC strings for storage
          if (value.state?.boards) {
            const dataToStore = {
              ...value,
              state: {
                ...value.state,
                boards: value.state.boards.map((board: Board) => ({
                  ...board,
                  archivedCards: board.archivedCards.map((ac: ArchivedCard) => ({
                    ...ac,
                    archivedAt: toUTCString(ac.archivedAt),
                    card: {
                      ...ac.card,
                      startDate: toUTCString(ac.card.startDate),
                      dueDate: toUTCString(ac.card.dueDate),
                      createdAt: toUTCString(ac.card.createdAt),
                      updatedAt: toUTCString(ac.card.updatedAt),
                    }
                  })),
                  lists: board.lists.map((list: List) => ({
                    ...list,
                    cards: list.cards.map((card: Card) => ({
                      ...card,
                      startDate: toUTCString(card.startDate),
                      dueDate: toUTCString(card.dueDate),
                      createdAt: toUTCString(card.createdAt),
                      updatedAt: toUTCString(card.updatedAt),
                    }))
                  }))
                }))
              }
            };
            localStorage.setItem(name, JSON.stringify(dataToStore));
          } else {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
)

