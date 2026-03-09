import { Board } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { BoardStateCreator, BoardSlice } from './types';

export const createBoardSlice: BoardStateCreator<BoardSlice> = (set) => ({
    boards: [],
    currentBoardId: null,
    isLoading: false,
    error: null,

    setCurrentBoard: (boardId) => {
        set({ currentBoardId: boardId });

        // Update URL to reflect current board
        if (boardId) {
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/');

            // Check if we're currently on a card URL
            if (pathSegments.length >= 5 && pathSegments[1] === 'board' && pathSegments[3] === 'card') {
                // Keep the card URL but update board ID
                const cardId = pathSegments[4];
                window.history.pushState({}, '', `/board/${boardId}/card/${cardId}`);
            } else {
                // Just update to board URL
                window.history.pushState({}, '', `/board/${boardId}`);
            }
        } else {
            // No board selected, go to root
            window.history.pushState({}, '', '/');
        }
    },

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

        // Update URL to new board
        window.history.pushState({}, '', `/board/${newBoard.id}`);

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
        set((state) => {
            const newBoards = state.boards.filter((board) => board.id !== boardId);
            const newCurrentBoardId = state.currentBoardId === boardId ? null : state.currentBoardId;

            // Update URL if we deleted the current board
            if (state.currentBoardId === boardId) {
                if (newBoards.length > 0) {
                    // Switch to first available board
                    window.history.pushState({}, '', `/board/${newBoards[0].id}`);
                } else {
                    // No boards left, go to root
                    window.history.pushState({}, '', '/');
                }
            }

            return {
                boards: newBoards,
                currentBoardId: newCurrentBoardId
            };
        });
    },
});
