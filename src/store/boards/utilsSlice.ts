import { BoardStateCreator, UtilsSlice } from './types';

export const createUtilsSlice: BoardStateCreator<UtilsSlice> = (set, get) => ({
    getCurrentBoard: () => {
        const state = get();
        return state.boards.find((b) => b.id === state.currentBoardId) || null;
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
});
