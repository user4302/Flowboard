import { renderHook, act } from '@testing-library/react';
import { useTaskModalData } from '../useTaskModalData';
import { Card } from '@/lib/types';

// Mock dependent hooks
const mockFormReset = jest.fn();
const mockForm = {
  reset: mockFormReset,
  formState: { errors: {} },
  register: jest.fn(),
  handleSubmit: jest.fn((fn: any) => fn),
};

jest.mock('../useTaskModalForm', () => ({
  useTaskModalForm: () => mockForm,
}));

jest.mock('../useTaskModalChecklist', () => ({
  useTaskModalChecklist: () => ({
    syncChecklistToStore: jest.fn(),
    resetChecklist: jest.fn(),
  }),
}));

// Mock stores
let mockBoards: any[] = [];
let mockUIStore = {
  cardModalOpen: true,
  selectedCardId: null as string | null,
  cardJSONData: null as any,
  targetListId: null as string | null,
};

jest.mock('@/store', () => ({
  useBoardStore: () => ({
    boards: mockBoards,
    currentBoardId: 'test-board-id' as string,
  }),
  useUIStore: () => mockUIStore,
}));

describe('useTaskModalData - Race Condition Fix', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFormReset.mockClear();

    // Reset to default state
    mockBoards = [
      {
        id: 'test-board-id',
        title: 'Test Board',
        lists: [
          {
            id: 'test-list-id',
            title: 'Test List',
            cards: [
              {
                id: 'existing-card-id',
                title: 'Existing Card',
                description: 'Existing Description',
                startDate: new Date('2024-01-01'),
                dueDate: new Date('2024-01-02'),
                priority: 1,
                completed: false,
                labelIds: [],
                checklists: [],
                listId: 'test-list-id',
                members: [],
                position: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
              }
            ],
          }
        ],
        labels: [],
      }
    ];

    mockUIStore = {
      cardModalOpen: true,
      selectedCardId: 'test-card-id',
      cardJSONData: null,
      targetListId: null,
    };
  });

  it('should not reset form when card is not found', () => {
    const { result } = renderHook(() => useTaskModalData());

    // Card not found, form should not be reset
    expect(mockFormReset).not.toHaveBeenCalled();
    expect(result.current.foundCard).toBeUndefined();
  });

  it('should reset form when card becomes available after race condition resolves', () => {
    // Initially, card doesn't exist
    const { result, rerender } = renderHook(() => useTaskModalData());

    expect(mockFormReset).not.toHaveBeenCalled();

    // Add the card to simulate race condition resolution
    const newCard = {
      id: 'test-card-id',
      title: 'New Card',
      description: 'New Description',
      startDate: new Date('2024-01-01'),
      dueDate: new Date('2024-01-02'),
      priority: 2,
      completed: false,
      labelIds: [],
      checklists: [],
      listId: 'test-list-id',
      members: [],
      position: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockBoards[0].lists[0].cards.push(newCard);

    // Re-render to trigger the effect
    rerender();

    // Form should be reset with the new card data
    expect(mockFormReset).toHaveBeenCalledWith({
      title: 'New Card',
      description: 'New Description',
      startDate: '2024-01-01',
      dueDate: '2024-01-02',
      priority: 2,
    });

    expect(result.current.foundCard).toEqual(newCard);
  });

  it('should reset form when card is already available (no race condition)', () => {
    // Set selectedCardId to existing card
    mockUIStore.selectedCardId = 'existing-card-id';

    const { result } = renderHook(() => useTaskModalData());

    // Form should be reset since card is available and conditions are met
    expect(mockFormReset).toHaveBeenCalledWith({
      title: 'Existing Card',
      description: 'Existing Description',
      startDate: '2024-01-01',
      dueDate: '2024-01-02',
      priority: 1,
    });
    expect(result.current.foundCard).toBeDefined();
    expect(result.current.foundCard?.id).toBe('existing-card-id');
  });

  it('should not reset form in JSON import mode', () => {
    mockUIStore.cardJSONData = { title: 'JSON Card', description: 'JSON Description' };
    mockUIStore.targetListId = 'test-list-id';

    const { result } = renderHook(() => useTaskModalData());

    // Form should not be reset in JSON import mode
    expect(mockFormReset).not.toHaveBeenCalled();
    expect(result.current.isJSONImportMode).toBe(true);
  });

  it('should handle card with empty values correctly', () => {
    const cardWithEmptyValues = {
      id: 'empty-card-id',
      title: '',
      description: '',
      startDate: null,
      dueDate: null,
      priority: null,
      completed: false,
      labelIds: [],
      checklists: [],
      listId: 'test-list-id',
      members: [],
      position: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockBoards[0].lists[0].cards.push(cardWithEmptyValues);
    mockUIStore.selectedCardId = 'empty-card-id';

    const { result } = renderHook(() => useTaskModalData());

    // Form should be reset with empty values
    expect(mockFormReset).toHaveBeenCalledWith({
      title: '',
      description: '',
      startDate: '',
      dueDate: '',
      priority: null,
    });

    expect(result.current.foundCard).toEqual(cardWithEmptyValues);
  });

  it('should not reset form when modal is closed', () => {
    mockUIStore.cardModalOpen = false;

    const { result } = renderHook(() => useTaskModalData());

    // Form should not be reset when modal is closed
    expect(mockFormReset).not.toHaveBeenCalled();
  });

  it('should not reset form when no card is selected', () => {
    mockUIStore.selectedCardId = null;

    const { result } = renderHook(() => useTaskModalData());

    // Form should not be reset when no card is selected
    expect(mockFormReset).not.toHaveBeenCalled();
    expect(result.current.selectedCardId).toBeNull();
  });
});
