import { Board } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { BoardStateCreator, BoardSlice } from './types';

export const createBoardSlice: BoardStateCreator<BoardSlice> = (set) => ({
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
            labels: [],
            archivedCards: [],
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
});
