import { createCardSlice } from '../cardSlice';
import { getStartOfLocalDay, getEndOfLocalDay } from '../../../lib/dateUtils';

// Mock generateId
jest.mock('../../../lib/utils', () => ({
    generateId: () => 'test-id',
}));

describe('cardSlice', () => {
    let set: jest.Mock;
    let get: jest.Mock;
    let cardSlice: any;

    beforeEach(() => {
        set = jest.fn();
        get = jest.fn().mockReturnValue({ boards: [] });
        cardSlice = createCardSlice(set, get);
    });

    test('createCard sets default dates to start and end of local day', () => {
        const boardId = 'b1';
        const listId = 'l1';
        const title = 'test card';
        
        // Setup mock board and list state
        get.mockReturnValue({
            boards: [{
                id: boardId,
                lists: [{ id: listId, cards: [] }]
            }]
        });

        const now = new Date();
        const expectedStart = getStartOfLocalDay(now);
        const expectedEnd = getEndOfLocalDay(now);

        const card = cardSlice.createCard(boardId, listId, title, 0);

        expect(card.startDate).toEqual(expectedStart);
        expect(card.dueDate).toEqual(expectedEnd);
    });
});
