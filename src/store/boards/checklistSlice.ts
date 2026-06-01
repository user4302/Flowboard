import { generateId } from '@/lib/utils';
import { BoardStateCreator, ChecklistSlice } from './types';

export const createChecklistSlice: BoardStateCreator<ChecklistSlice> = (set) => ({
    addChecklist: (boardId, cardId, name) => {
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
                                                checklists: [
                                                    ...card.checklists,
                                                    {
                                                        id: generateId(),
                                                        name,
                                                        items: [],
                                                        position: card.checklists.length,
                                                        createdAt: new Date(),
                                                        updatedAt: new Date(),
                                                    },
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

    updateChecklist: (boardId, cardId, checklistId, updates) => {
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
                                                checklists: card.checklists.map((checklist) =>
                                                    checklist.id === checklistId
                                                        ? { ...checklist, ...updates, updatedAt: new Date() }
                                                        : checklist
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

    removeChecklist: (boardId, cardId, checklistId) => {
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
                                                checklists: card.checklists.filter((checklist) => checklist.id !== checklistId),
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

    addChecklistItem: (boardId, cardId, checklistId, text) => {
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
                                                checklists: card.checklists.map((checklist) =>
                                                    checklist.id === checklistId
                                                        ? {
                                                            ...checklist,
                                                            items: [
                                                                ...checklist.items,
                                                                { id: generateId(), text, done: false },
                                                            ],
                                                            updatedAt: new Date(),
                                                        }
                                                        : checklist
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

    updateChecklistItem: (boardId, cardId, checklistId, itemId, updates) => {
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
                                                checklists: card.checklists.map((checklist) =>
                                                    checklist.id === checklistId
                                                        ? {
                                                            ...checklist,
                                                            items: checklist.items.map((item) =>
                                                                item.id === itemId
                                                                    ? { ...item, ...updates }
                                                                    : item
                                                            ),
                                                            updatedAt: new Date(),
                                                        }
                                                        : checklist
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

    addChecklistItems: (boardId, cardId, checklistId, texts) => {
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
                                                checklists: card.checklists.map((checklist) =>
                                                    checklist.id === checklistId
                                                        ? {
                                                            ...checklist,
                                                            items: [
                                                                ...checklist.items,
                                                                ...texts.map(text => ({ id: generateId(), text, done: false }))
                                                            ],
                                                            updatedAt: new Date(),
                                                        }
                                                        : checklist
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

