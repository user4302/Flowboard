import { generateId } from '@/lib/utils';
import { BoardStateCreator, MemberSlice } from './types';

export const createMemberSlice: BoardStateCreator<MemberSlice> = (set) => ({
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
});
