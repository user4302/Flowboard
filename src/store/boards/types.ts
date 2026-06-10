import { Board, List, Card, Label, User, Checklist, ChecklistItem, ArchivedCard } from '@/lib/types';
import { StateCreator } from 'zustand';

export interface BoardSlice {
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
}

export interface ListSlice {
    createList: (boardId: string, title: string, position?: number) => List | null;
    updateList: (boardId: string, listId: string, updates: Partial<List>) => void;
    deleteList: (boardId: string, listId: string) => void;
    reorderLists: (boardId: string, fromIndex: number, toIndex: number) => void;
}

export interface CardSlice {
    createCard: (boardId: string, listId: string, title: string, position?: number) => Card | null;
    createCardFromData: (boardId: string, listId: string, cardData: Partial<Card>) => Card | null;
    updateCard: (boardId: string, cardId: string, updates: Partial<Card>) => void;
    deleteCard: (boardId: string, cardId: string) => void;
    moveCard: (boardId: string, cardId: string, fromListId: string, toListId: string, position: number) => void;
    moveCardBetweenBoards: (fromBoardId: string, toBoardId: string, cardId: string, fromListId: string, toListId: string, position: number) => void;
    reorderCards: (boardId: string, listId: string, fromIndex: number, toIndex: number) => void;
    duplicateCard: (boardId: string, cardId: string, listId: string) => void;
    archiveCard: (boardId: string, cardId: string) => void;
    unarchiveCard: (boardId: string, archivedCardId: string) => void;
    permanentlyDeleteArchivedCard: (boardId: string, archivedCardId: string) => void;
}

export interface LabelSlice {
    createBoardLabel: (boardId: string, label: Omit<Label, 'id'>) => Label;
    updateBoardLabel: (boardId: string, labelId: string, updates: Partial<Label>) => void;
    deleteBoardLabel: (boardId: string, labelId: string) => void;
    addLabelToCard: (boardId: string, cardId: string, labelId: string) => void;
    removeLabelFromCard: (boardId: string, cardId: string, labelId: string) => void;
}

export interface MemberSlice {
    addMember: (boardId: string, user: User) => void;
    removeMember: (boardId: string, userId: string) => void;
}

export interface ChecklistSlice {
    addChecklist: (boardId: string, cardId: string, name: string, id?: string) => void;
    updateChecklist: (boardId: string, cardId: string, checklistId: string, updates: Partial<Checklist>) => void;
    removeChecklist: (boardId: string, cardId: string, checklistId: string) => void;
    addChecklistItem: (boardId: string, cardId: string, checklistId: string, text: string) => void;
    addChecklistItems: (boardId: string, cardId: string, checklistId: string, texts: string[]) => void;
    updateChecklistItem: (boardId: string, cardId: string, checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
    removeChecklistItem: (boardId: string, cardId: string, checklistId: string, itemId: string) => void;
    reorderChecklistItems: (boardId: string, cardId: string, checklistId: string, fromIndex: number, toIndex: number) => void;
    updateChecklistItems: (boardId: string, cardId: string, checklistId: string, items: ChecklistItem[]) => void;
}

export interface HydrationSlice {
    isHydrated: boolean;
    setHydrated: (hydrated: boolean) => void;
}

export interface UtilsSlice {
    getCurrentBoard: () => Board | null;
    getCard: (boardId: string, cardId: string) => Card | null;
    getList: (boardId: string, listId: string) => List | null;
}

/**
 * Board state interface - Defines the shape of board store state and actions
 * Contains all board-related data and CRUD operations
 */
export type BoardState = BoardSlice &
    ListSlice &
    CardSlice &
    LabelSlice &
    MemberSlice &
    ChecklistSlice &
    HydrationSlice &
    UtilsSlice;

export type BoardStateCreator<T> = StateCreator<
    BoardState,
    [["zustand/persist", unknown]],
    [],
    T
>;

export const reorderArray = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
    const result = [...array];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
};
