import { Label } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { BoardStateCreator, LabelSlice } from './types';

export const createLabelSlice: BoardStateCreator<LabelSlice> = (set) => ({
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
});
