import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/lib/constants';
import { toUTCString, fromUTCString } from '@/lib/dateUtils';
import { Board, List, Card, Label, User, ChecklistItem } from '@/lib/types';
import { generateId } from '@/lib/utils';

/**
 * Board state interface - Defines the shape of board store state and actions
 * Contains all board-related data and CRUD operations
 */
interface BoardState {
  // State
  boards: Board[];
  currentBoardId: string | null;
  isLoading: boolean;
  error: string | null;

  // Board actions
  setCurrentBoard: (boardId: string) => void;
  createBoard: (name: string) => Board;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;

  // List actions
  createList: (boardId: string, title: string, position?: number) => List;
  updateList: (boardId: string, listId: string, updates: Partial<List>) => void;
  deleteList: (boardId: string, listId: string) => void;
  reorderLists: (boardId: string, fromIndex: number, toIndex: number) => void;

  // Card actions
  createCard: (boardId: string, listId: string, title: string, position?: number) => Card;
  updateCard: (boardId: string, cardId: string, updates: Partial<Card>) => void;
  deleteCard: (boardId: string, cardId: string) => void;
  moveCard: (boardId: string, cardId: string, fromListId: string, toListId: string, position: number) => void;
  reorderCards: (boardId: string, listId: string, fromIndex: number, toIndex: number) => void;

  // Label actions
  createBoardLabel: (boardId: string, label: Omit<Label, 'id'>) => Label;
  updateBoardLabel: (boardId: string, labelId: string, updates: Partial<Label>) => void;
  deleteBoardLabel: (boardId: string, labelId: string) => void;
  addLabelToCard: (boardId: string, cardId: string, labelId: string) => void;
  removeLabelFromCard: (boardId: string, cardId: string, labelId: string) => void;

  // Member actions
  addMember: (boardId: string, user: User) => void;
  removeMember: (boardId: string, userId: string) => void;

  // Checklist actions
  addChecklistItem: (boardId: string, cardId: string, text: string) => void;
  updateChecklistItem: (boardId: string, cardId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
  removeChecklistItem: (boardId: string, cardId: string, itemId: string) => void;

  // Utility functions
  getCurrentBoard: () => Board | null;
  getCard: (boardId: string, cardId: string) => Card | null;
  getList: (boardId: string, listId: string) => List | null;
}

/**
 * Board store - Zustand store for board state management
 * Handles all board, list, card, label, member, and checklist operations
 * Persists data to localStorage for offline functionality
 */
export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      // Initial state
      boards: [],
      currentBoardId: null,
      isLoading: false,
      error: null,

      /**
       * Set the current active board
       * @param boardId - ID of the board to set as current
       */
      setCurrentBoard: (boardId) => set({ currentBoardId: boardId }),

      /**
       * Create a new board
       * @param name - Name of the new board
       * @returns The created board object
       */
      createBoard: (name) => {
        const newBoard: Board = {
          id: generateId(),
          name,
          lists: [],
          members: [],
          labels: [
            { id: generateId(), text: 'Copy Request', color: 'bg-yellow-600' },
            { id: generateId(), text: 'Priority', color: 'bg-red-600' },
            { id: generateId(), text: 'Design Team', color: 'bg-purple-600' },
            { id: generateId(), text: 'Product Marketing', color: 'bg-blue-600' },
            { id: generateId(), text: 'Trello Tip', color: 'bg-teal-600' },
            { id: generateId(), text: 'Help', color: 'bg-green-600' },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          boards: [...state.boards, newBoard],
          currentBoardId: newBoard.id,
        }));

        return newBoard;
      },

      /**
       * Update an existing board
       * @param boardId - ID of the board to update
       * @param updates - Partial board updates
       */
      updateBoard: (boardId, updates) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? { ...board, ...updates, updatedAt: new Date() }
              : board
          ),
        }));
      },

      /**
       * Delete a board
       * @param boardId - ID of the board to delete
       */
      deleteBoard: (boardId) => {
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== boardId),
          currentBoardId: state.currentBoardId === boardId ? null : state.currentBoardId,
        }));
      },

      /**
       * Create a new list in a board
       * @param boardId - ID of the board to add list to
       * @param title - Title of the new list
       * @param position - Optional position index (defaults to end)
       * @returns The created list object
       */
      createList: (boardId, title, position) => {
        const state = get();
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return null as any;

        const newList: List = {
          id: generateId(),
          title,
          cards: [],
          position: position ?? board.lists.length,
        };

        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? { ...b, lists: [...b.lists, newList], updatedAt: new Date() }
              : b
          ),
        }));

        return newList;
      },

      /**
       * Update an existing list
       * @param boardId - ID of the board containing the list
       * @param listId - ID of the list to update
       * @param updates - Partial list updates
       */
      updateList: (boardId, listId, updates) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.id === listId ? { ...list, ...updates } : list
                ),
                updatedAt: new Date(),
              }
              : board
          ),
        }));
      },

      /**
       * Delete a list from a board
       * @param boardId - ID of the board containing the list
       * @param listId - ID of the list to delete
       */
      deleteList: (boardId, listId) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                ...board,
                lists: board.lists.filter((list) => list.id !== listId),
                updatedAt: new Date(),
              }
              : board
          ),
        }));
      },

      /**
       * Reorder lists within a board
       * @param boardId - ID of the board to reorder lists in
       * @param fromIndex - Source index
       * @param toIndex - Target index
       */
      reorderLists: (boardId, fromIndex, toIndex) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                ...board,
                lists: reorderArray(board.lists, fromIndex, toIndex),
                updatedAt: new Date(),
              }
              : board
          ),
        }));
      },

      createCard: (boardId, listId, title, position) => {
        const state = get();
        const board = state.boards.find((b) => b.id === boardId);
        const list = board?.lists.find((l) => l.id === listId);
        if (!board || !list) return null as any;

        const newCard: Card = {
          id: generateId(),
          title,
          listId,
          labelIds: [],
          members: [],
          checklist: [],
          completed: false,
          position: position ?? list.cards.length,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                ...b,
                lists: b.lists.map((l) =>
                  l.id === listId
                    ? { ...l, cards: [...l.cards, newCard] }
                    : l
                ),
                updatedAt: new Date(),
              }
              : b
          ),
        }));

        return newCard;
      },

      updateCard: (boardId, cardId, updates) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.id === updates.listId || list.cards.some((c) => c.id === cardId)
                    ? {
                      ...list,
                      cards: list.cards.map((card) =>
                        card.id === cardId
                          ? { ...card, ...updates, updatedAt: new Date() }
                          : card
                      ),
                    }
                    : list
                ),
                updatedAt: new Date(),
              }
              : board
          ),
        }));
      },

      deleteCard: (boardId, cardId) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                ...board,
                lists: board.lists.map((list) => ({
                  ...list,
                  cards: list.cards.filter((card) => card.id !== cardId),
                })),
                updatedAt: new Date(),
              }
              : board
          ),
        }));
      },

      moveCard: (boardId, cardId, fromListId, toListId, position) => {
        const state = get();
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return;

        const fromList = board.lists.find((l) => l.id === fromListId);
        const toList = board.lists.find((l) => l.id === toListId);
        if (!fromList || !toList) return;

        const cardIndex = fromList.cards.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return;

        const [card] = fromList.cards.splice(cardIndex, 1);
        card.listId = toListId;
        card.position = position;
        toList.cards.splice(position, 0, card);

        // Update positions
        fromList.cards.forEach((c, idx) => (c.position = idx));
        toList.cards.forEach((c, idx) => (c.position = idx));

        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? { ...b, lists: [...b.lists], updatedAt: new Date() }
              : b
          ),
        }));
      },

      reorderCards: (boardId, listId, fromIndex, toIndex) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.id === listId
                    ? {
                      ...list,
                      cards: reorderArray(list.cards, fromIndex, toIndex).map(
                        (card, index) => ({ ...card, position: index })
                      ),
                    }
                    : list
                ),
                updatedAt: new Date(),
              }
              : board
          ),
        }));
      },

      createBoardLabel: (boardId, labelData) => {
        const newLabel: Label = { ...labelData, id: generateId() };
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? { ...b, labels: [...b.labels, newLabel], updatedAt: new Date() }
              : b
          ),
        }));
        return newLabel;
      },

      updateBoardLabel: (boardId, labelId, updates) => {
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                ...b,
                labels: b.labels.map((l) => (l.id === labelId ? { ...l, ...updates } : l)),
                updatedAt: new Date(),
              }
              : b
          ),
        }));
      },

      deleteBoardLabel: (boardId, labelId) => {
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                ...b,
                labels: b.labels.filter((l) => l.id !== labelId),
                lists: b.lists.map((l) => ({
                  ...l,
                  cards: l.cards.map((c) => ({
                    ...c,
                    labelIds: c.labelIds.filter((id) => id !== labelId),
                  })),
                })),
                updatedAt: new Date(),
              }
              : b
          ),
        }));
      },

      addLabelToCard: (boardId, cardId, labelId) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.cards.some((c) => c.id === cardId)
                    ? {
                      ...list,
                      cards: list.cards.map((card) =>
                        card.id === cardId && !card.labelIds.includes(labelId)
                          ? {
                            ...card,
                            labelIds: [...card.labelIds, labelId],
                            updatedAt: new Date(),
                          }
                          : card
                      ),
                    }
                    : list
                ),
                updatedAt: new Date(),
              }
              : board
          ),
        }));
      },

      removeLabelFromCard: (boardId, cardId, labelId) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.cards.some((c) => c.id === cardId)
                    ? {
                      ...list,
                      cards: list.cards.map((card) =>
                        card.id === cardId
                          ? {
                            ...card,
                            labelIds: card.labelIds.filter((id) => id !== labelId),
                            updatedAt: new Date(),
                          }
                          : card
                      ),
                    }
                    : list
                ),
                updatedAt: new Date(),
              }
              : board
          ),
        }));
      },

      addMember: (boardId, user) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                ...board,
                members: [...board.members, { ...user, id: generateId() }],
                updatedAt: new Date(),
              }
              : board
          ),
        }));
      },

      removeMember: (boardId, userId) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                ...board,
                members: board.members.filter((member) => member.id !== userId),
                updatedAt: new Date(),
              }
              : board
          ),
        }));
      },

      addChecklistItem: (boardId, cardId, text) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.cards.some((c) => c.id === cardId)
                    ? {
                      ...list,
                      cards: list.cards.map((card) =>
                        card.id === cardId
                          ? {
                            ...card,
                            checklist: [
                              ...card.checklist,
                              { id: generateId(), text, done: false },
                            ],
                            updatedAt: new Date(),
                          }
                          : card
                      ),
                    }
                    : list
                ),
                updatedAt: new Date(),
              }
              : board
          ),
        }));
      },

      updateChecklistItem: (boardId, cardId, itemId, updates) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.cards.some((c) => c.id === cardId)
                    ? {
                      ...list,
                      cards: list.cards.map((card) =>
                        card.id === cardId
                          ? {
                            ...card,
                            checklist: card.checklist.map((item) =>
                              item.id === itemId ? { ...item, ...updates } : item
                            ),
                            updatedAt: new Date(),
                          }
                          : card
                      ),
                    }
                    : list
                ),
                updatedAt: new Date(),
              }
              : board
          ),
        }));
      },

      removeChecklistItem: (boardId, cardId, itemId) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.cards.some((c) => c.id === cardId)
                    ? {
                      ...list,
                      cards: list.cards.map((card) =>
                        card.id === cardId
                          ? {
                            ...card,
                            checklist: card.checklist.filter(
                              (item) => item.id !== itemId
                            ),
                            updatedAt: new Date(),
                          }
                          : card
                      ),
                    }
                    : list
                ),
                updatedAt: new Date(),
              }
              : board
          ),
        }));
      },

      getCurrentBoard: () => {
        const state = get();
        return state.boards.find((board) => board.id === state.currentBoardId) || null;
      },

      getCard: (boardId, cardId) => {
        const state = get();
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return null;

        for (const list of board.lists) {
          const card = list.cards.find((c) => c.id === cardId);
          if (card) return card;
        }
        return null;
      },

      getList: (boardId, listId) => {
        const state = get();
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return null;
        return board.lists.find((l) => l.id === listId) || null;
      },
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
              data.state.boards = data.state.boards.map((board: any) => {
                // Ensure board has labels array
                let boardLabels = Array.isArray(board.labels) ? [...board.labels] : [];
                // Ensure all board labels have IDs
                boardLabels = boardLabels.map(l => ({ ...l, id: l.id || generateId() }));
                const boardLabelIds = new Set(boardLabels.map((l: any) => l.id));

                const newLists = board.lists.map((list: any) => ({
                  ...list,
                  cards: list.cards.map((card: any): Card => {
                    // Start with existing labelIds or empty array
                    let labelIds = Array.isArray(card.labelIds) ? [...card.labelIds] : [];

                    // If card still has old labels array, migrate them
                    if (Array.isArray(card.labels) && card.labels.length > 0) {
                      card.labels.forEach((oldLabel: any) => {
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

                    return {
                      ...card,
                      labelIds,
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
                boards: value.state.boards.map((board: any) => ({
                  ...board,
                  lists: board.lists.map((list: any) => ({
                    ...list,
                    cards: list.cards.map((card: any) => ({
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

// Helper function for reordering arrays
function reorderArray<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = Array.from(array);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}
