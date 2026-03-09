import { List } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { BoardStateCreator, ListSlice, reorderArray } from './types';

export const createListSlice: BoardStateCreator<ListSlice> = (set, get) => ({
    createList: (boardId, title, position) => {
        const state = get();
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return null;

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
});
