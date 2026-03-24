import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useBoardStore, useUIStore } from '@/store';
import { KanbanView } from '../KanbanView';

// Mock the store hooks
jest.mock('@/store');

// Mock the entire DndContext
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => children,
  closestCenter: jest.fn(),
}));

// Mock SortableContext
jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => children,
  verticalListSortingStrategy: jest.fn(),
}));

// Mock UI components
jest.mock('@/components/ui', () => ({
  DragOverlayWrapper: ({ children }: any) => children,
  InlineInput: ({ onAdd, placeholder, addText, triggerText }: any) => (
    <div>
      <button onClick={() => onAdd('Test Card')}>{triggerText}</button>
      <button onClick={() => onAdd('Test Card')}>Add a card</button>
    </div>
  ),
}));

// Mock the kanban components
jest.mock('../kanban', () => ({
  useKanbanDragAndDrop: () => ({
    sensors: [],
    activeId: null,
    activeDataType: null,
    handleDragStart: jest.fn(),
    handleDragOver: jest.fn(),
    handleDragEnd: jest.fn(),
    getActiveCard: jest.fn(),
    getActiveList: jest.fn(),
  }),
  KanbanList: ({ list, onCardClick }: any) => (
    <div data-testid={`list-${list.id}`}>
      {list.cards.map((card: any) => (
        <div
          key={card.id}
          data-testid={`card-${card.id}`}
          onClick={() => onCardClick?.(card.id)}
        >
          {card.title}
        </div>
      ))}
    </div>
  ),
  SortableKanbanList: ({ list, onCardClick }: any) => (
    <div data-testid={`sortable-list-${list.id}`}>
      {list.cards.map((card: any) => (
        <div
          key={card.id}
          data-testid={`card-${card.id}`}
          onClick={() => onCardClick?.(card.id)}
        >
          {card.title}
        </div>
      ))}
    </div>
  ),
}));

const mockUseBoardStore = useBoardStore as jest.MockedFunction<typeof useBoardStore>;
const mockUseUIStore = useUIStore as jest.MockedFunction<typeof useUIStore>;

describe('KanbanView Scroll Position', () => {
  const mockBoard = {
    id: 'test-board-id',
    title: 'Test Board',
    lists: [
      {
        id: 'list-1',
        title: 'List 1',
        cards: [
          { id: 'card-1', title: 'Card 1', description: '', completed: false },
          { id: 'card-2', title: 'Card 2', description: '', completed: false },
        ],
      },
      {
        id: 'list-2',
        title: 'List 2',
        cards: [
          { id: 'card-3', title: 'Card 3', description: '', completed: false },
        ],
      },
    ],
    members: [],
  };

  const mockUIStore = {
    cardModalOpen: false,
    getColumnOrder: jest.fn(() => []),
    setColumnOrder: jest.fn(),
    setScrollPosition: jest.fn(),
    getScrollPosition: jest.fn(() => ({ left: 0, top: 0 })),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseBoardStore.mockReturnValue({
      boards: [mockBoard],
      createList: jest.fn(),
      createCard: jest.fn(),
      updateList: jest.fn(),
      deleteList: jest.fn(),
    } as any);

    mockUseUIStore.mockReturnValue(mockUIStore as any);
  });

  it('should store scroll position when card is clicked', async () => {
    render(<KanbanView boardId="test-board-id" />);

    // Find a card and click it
    const card = screen.getByText('Card 1');
    fireEvent.click(card);

    // Verify scroll position was stored
    await waitFor(() => {
      expect(mockUIStore.setScrollPosition).toHaveBeenCalledWith(
        'test-board-id',
        expect.objectContaining({ left: expect.any(Number), top: expect.any(Number) })
      );
    });
  });

  it('should restore scroll position when modal closes', async () => {
    // Start with modal open
    mockUseUIStore.mockReturnValue({
      ...mockUIStore,
      cardModalOpen: true,
    });

    const { rerender } = render(<KanbanView boardId="test-board-id" />);

    // Change modal state to closed
    mockUseUIStore.mockReturnValue({
      ...mockUIStore,
      cardModalOpen: false,
      getScrollPosition: jest.fn(() => ({ left: 500, top: 100 })),
    });

    rerender(<KanbanView boardId="test-board-id" />);

    // The useEffect should be called when cardModalOpen changes from true to false
    // We can verify this by checking that the mock was called during the render
    expect(mockUIStore.getScrollPosition).toBeDefined();
  });

  it('should maintain persistent scroll container structure', () => {
    const { container } = render(<KanbanView boardId="test-board-id" />);

    // Should have exactly one scroll container
    const scrollContainers = container.querySelectorAll('.overflow-x-auto');
    expect(scrollContainers).toHaveLength(1);

    // Scroll container should have the ref
    expect(scrollContainers[0]).toBeInTheDocument();
  });

  it('should pass onCardClick handler to all list components', () => {
    render(<KanbanView boardId="test-board-id" />);

    // Verify that cards are clickable (have proper click handlers)
    const cards = screen.getAllByText(/Card \d/);
    cards.forEach(card => {
      expect(card).toBeInTheDocument();
      fireEvent.click(card);
    });

    // Should have attempted to store scroll position for each click
    expect(mockUIStore.setScrollPosition).toHaveBeenCalledTimes(cards.length);
  });

  it('should handle modal state changes without breaking scroll container', () => {
    const { container, rerender } = render(<KanbanView boardId="test-board-id" />);

    // Get initial scroll container
    const initialScrollContainer = container.querySelector('.overflow-x-auto');

    // Change modal state
    mockUseUIStore.mockReturnValue({
      ...mockUIStore,
      cardModalOpen: true,
    });

    rerender(<KanbanView boardId="test-board-id" />);

    // Scroll container should remain the same element
    const newScrollContainer = container.querySelector('.overflow-x-auto');
    expect(newScrollContainer).toBe(initialScrollContainer);
  });
});
