import { Card, ArchivedCard } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { BoardStateCreator, CardSlice, reorderArray } from './types';

export const createCardSlice: BoardStateCreator<CardSlice> = (set, get) => ({
    createCard: (boardId, listId, title, position) => {
        const state = get();
        const board = state.boards.find((b) => b.id === boardId);
        const list = board?.lists.find((l) => l.id === listId);
        if (!board || !list) return null;

        const newCard: Card = {
            id: generateId(),
            title,
            listId,
            labelIds: [],
            members: [],
            checklists: [],
            completed: false,
            position: position ?? list.cards.length,
            priority: null,
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

    createCardFromData: (boardId, listId, cardData) => {
        const state = get();
        const board = state.boards.find((b) => b.id === boardId);
        const list = board?.lists.find((l) => l.id === listId);
        if (!board || !list) return null;

        const newCard: Card = {
            id: generateId(),
            title: cardData.title || 'Untitled Card',
            description: cardData.description,
            listId,
            labelIds: cardData.labelIds || [],
            members: cardData.members || [],
            checklists: cardData.checklists || [],
            completed: false,
            position: list.cards.length,
            startDate: cardData.startDate,
            dueDate: cardData.dueDate,
            priority: cardData.priority,
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
        set((state) => ({
            boards: state.boards.map((board) => {
                if (board.id !== boardId) return board;

                const fromList = board.lists.find((l) => l.id === fromListId);
                const toList = board.lists.find((l) => l.id === toListId);
                if (!fromList || !toList) return board;

                const cardIndex = fromList.cards.findIndex((c) => c.id === cardId);
                if (cardIndex === -1 && fromListId !== toListId) return board;

                // Get the card to move
                let movedCard: Card;
                if (fromListId === toListId) {
                    movedCard = fromList.cards[cardIndex];
                } else {
                    movedCard = { ...fromList.cards[cardIndex], listId: toListId };
                }

                return {
                    ...board,
                    lists: board.lists.map((list) => {
                        if (list.id === fromListId && fromListId === toListId) {
                            // Reorder within the same list (fallback, usually handled by reorderCards)
                            const newCards = Array.from(list.cards);
                            newCards.splice(cardIndex, 1);
                            newCards.splice(position, 0, movedCard);
                            return {
                                ...list,
                                cards: newCards.map((c, idx) => ({ ...c, position: idx })),
                            };
                        }

                        if (list.id === fromListId) {
                            // Remove from source list
                            return {
                                ...list,
                                cards: list.cards
                                    .filter((c) => c.id !== cardId)
                                    .map((c, idx) => ({ ...c, position: idx })),
                            };
                        }

                        if (list.id === toListId) {
                            // Add to target list
                            const newCards = Array.from(list.cards);
                            newCards.splice(position, 0, movedCard);
                            return {
                                ...list,
                                cards: newCards.map((c, idx) => ({ ...c, position: idx })),
                            };
                        }

                        return list;
                    }),
                    updatedAt: new Date(),
                };
            }),
        }));
    },

    moveCardBetweenBoards: (fromBoardId, toBoardId, cardId, fromListId, toListId, position) => {
        set((state) => {
            let cardToMove: Card | null = null;

            // Find and remove the card from the source board
            const updatedBoards = state.boards.map((board) => {
                if (board.id === fromBoardId) {
                    const updatedLists = board.lists.map((list) => {
                        if (list.id === fromListId) {
                            const cardIndex = list.cards.findIndex((c) => c.id === cardId);
                            if (cardIndex !== -1) {
                                cardToMove = { ...list.cards[cardIndex], listId: toListId };
                                return {
                                    ...list,
                                    cards: list.cards.filter((c) => c.id !== cardId).map((c, idx) => ({ ...c, position: idx })),
                                };
                            }
                        }
                        return list;
                    });
                    return { ...board, lists: updatedLists, updatedAt: new Date() };
                }
                return board;
            });

            // Add the card to the target board
            if (cardToMove) {
                return {
                    boards: updatedBoards.map((board) => {
                        if (board.id === toBoardId) {
                            const updatedLists = board.lists.map((list) => {
                                if (list.id === toListId) {
                                    const newCards = Array.from(list.cards);
                                    newCards.splice(position, 0, cardToMove!);
                                    return {
                                        ...list,
                                        cards: newCards.map((c, idx) => ({ ...c, position: idx })),
                                    };
                                }
                                return list;
                            });
                            return { ...board, lists: updatedLists, updatedAt: new Date() };
                        }
                        return board;
                    }),
                };
            }

            return { boards: updatedBoards };
        });
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

    duplicateCard: (boardId, cardId, listId) => {
        const state = get();
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return;

        const sourceList = board.lists.find((l) => l.cards.some((c) => c.id === cardId));
        const targetList = board.lists.find((l) => l.id === listId);
        if (!sourceList || !targetList) return;

        const sourceCard = sourceList.cards.find((c) => c.id === cardId);
        if (!sourceCard) return;

        const duplicatedCard: Card = {
            ...sourceCard,
            id: generateId(),
            title: `${sourceCard.title} (copy)`,
            listId: targetList.id,
            position: targetList.cards.length,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        set((state) => ({
            boards: state.boards.map((board) =>
                board.id === boardId
                    ? {
                        ...board,
                        lists: board.lists.map((list) =>
                            list.id === targetList.id
                                ? { ...list, cards: [...list.cards, duplicatedCard] }
                                : list
                        ),
                        updatedAt: new Date(),
                    }
                    : board
            ),
        }));
    },

    archiveCard: (boardId, cardId) => {
        set((state) => ({
            boards: state.boards.map((board) => {
                if (board.id !== boardId) return board;

                // Find the card to archive
                let cardToArchive: Card | null = null;
                let originalListId: string | null = null;
                let originalPosition: number | null = null;

                const updatedLists = board.lists.map((list) => {
                    const cardIndex = list.cards.findIndex((c) => c.id === cardId);
                    if (cardIndex !== -1) {
                        cardToArchive = { ...list.cards[cardIndex] };
                        originalListId = list.id;
                        originalPosition = cardIndex;
                        return {
                            ...list,
                            cards: list.cards.filter((card) => card.id !== cardId),
                        };
                    }
                    return list;
                });

                if (cardToArchive && originalListId && originalPosition !== null) {
                    const archivedCard: ArchivedCard = {
                        id: generateId(),
                        card: cardToArchive,
                        archivedAt: new Date(),
                        originalListId,
                        originalPosition,
                    };

                    return {
                        ...board,
                        lists: updatedLists,
                        archivedCards: [...board.archivedCards, archivedCard],
                        updatedAt: new Date(),
                    };
                }

                return board;
            }),
        }));
    },

    unarchiveCard: (boardId, archivedCardId) => {
        set((state) => ({
            boards: state.boards.map((board) => {
                if (board.id !== boardId) return board;

                const archivedCardIndex = board.archivedCards.findIndex((ac) => ac.id === archivedCardId);
                if (archivedCardIndex === -1) return board;

                const archivedCard = board.archivedCards[archivedCardIndex];
                const restoredCard: Card = {
                    ...archivedCard.card,
                    listId: archivedCard.originalListId,
                    position: archivedCard.originalPosition,
                    updatedAt: new Date(),
                };

                // Find the target list and insert the card at its original position
                const updatedLists = board.lists.map((list) => {
                    if (list.id === archivedCard.originalListId) {
                        const newCards = [...list.cards];
                        // Ensure position doesn't exceed array length
                        const position = Math.min(archivedCard.originalPosition, newCards.length);
                        newCards.splice(position, 0, restoredCard);

                        // Update positions for all cards in the list
                        return {
                            ...list,
                            cards: newCards.map((card, index) => ({ ...card, position: index })),
                        };
                    }
                    return list;
                });

                return {
                    ...board,
                    lists: updatedLists,
                    archivedCards: board.archivedCards.filter((ac) => ac.id !== archivedCardId),
                    updatedAt: new Date(),
                };
            }),
        }));
    },

    permanentlyDeleteArchivedCard: (boardId, archivedCardId) => {
        set((state) => ({
            boards: state.boards.map((board) =>
                board.id === boardId
                    ? {
                        ...board,
                        archivedCards: board.archivedCards.filter((ac) => ac.id !== archivedCardId),
                        updatedAt: new Date(),
                    }
                    : board
            ),
        }));
    },
});
