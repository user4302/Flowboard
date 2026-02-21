import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Board, List, Card, Label, User, ChecklistItem } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/constants';

interface BoardState {
  boards: Board[];
  currentBoardId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
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
  addLabel: (boardId: string, cardId: string, label: Label) => void;
  removeLabel: (boardId: string, cardId: string, labelId: string) => void;
  
  // Member actions
  addMember: (boardId: string, user: User) => void;
  removeMember: (boardId: string, userId: string) => void;
  
  // Checklist actions
  addChecklistItem: (boardId: string, cardId: string, text: string) => void;
  updateChecklistItem: (boardId: string, cardId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
  removeChecklistItem: (boardId: string, cardId: string, itemId: string) => void;
  
  // Utility
  getCurrentBoard: () => Board | null;
  getCard: (boardId: string, cardId: string) => Card | null;
  getList: (boardId: string, listId: string) => List | null;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      boards: [],
      currentBoardId: null,
      isLoading: false,
      error: null,

      setCurrentBoard: (boardId) => set({ currentBoardId: boardId }),

      createBoard: (name) => {
        const newBoard: Board = {
          id: generateId(),
          name,
          lists: [],
          members: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          boards: [...state.boards, newBoard],
          currentBoardId: newBoard.id,
        }));

        return newBoard;
      },

      updateBoard: (boardId, updates) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? { ...board, ...updates, updatedAt: new Date() }
              : board
          ),
        }));
      },

      deleteBoard: (boardId) => {
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== boardId),
          currentBoardId: state.currentBoardId === boardId ? null : state.currentBoardId,
        }));
      },

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
          labels: [],
          members: [],
          checklist: [],
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

      addLabel: (boardId, cardId, label) => {
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
                                  labels: [...card.labels, { ...label, id: generateId() }],
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

      removeLabel: (boardId, cardId, labelId) => {
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
                                  labels: card.labels.filter((l) => l.id !== labelId),
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
    }
  )
);

// Helper function for reordering arrays
function reorderArray<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = Array.from(array);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}
