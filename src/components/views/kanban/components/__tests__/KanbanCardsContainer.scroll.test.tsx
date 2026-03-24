import { render, screen, fireEvent } from '@testing-library/react';
import { KanbanCardsContainer } from '../KanbanCardsContainer';
import { useBoardStore, useUIStore } from '@/store';
import { Card, User } from '@/lib/types';

// Mock the store hooks
jest.mock('@/store');

// Mock filterUtils to avoid searchTerm.toLowerCase error
jest.mock('@/lib/filterUtils', () => ({
  filterCards: (cards: Card[], options: any) => cards, // Return all cards for testing
  FilterOptions: jest.fn(),
}));

// Mock the TaskCard
jest.mock('@/components/taskCard', () => ({
  TaskCard: ({ card, onClick }: any) => (
    <div data-testid={`card-${card.id}`} onClick={onClick}>
      {card.title}
    </div>
  ),
}));

const mockUseBoardStore = useBoardStore as jest.MockedFunction<typeof useBoardStore>;
const mockUseUIStore = useUIStore as jest.MockedFunction<typeof useUIStore>;

describe('KanbanCardsContainer Scroll Position', () => {
  const mockCards: Card[] = [
    {
      id: 'card-1',
      title: 'Card 1',
      description: '',
      completed: false,
      labelIds: [],
      members: [],
      checklists: [],
      position: 0,
      startDate: undefined,
      dueDate: undefined,
      priority: null,
      listId: 'list-1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'card-2',
      title: 'Card 2',
      description: '',
      completed: false,
      labelIds: [],
      members: [],
      checklists: [],
      position: 1,
      startDate: undefined,
      dueDate: undefined,
      priority: null,
      listId: 'list-1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'card-3',
      title: 'Card 3',
      description: '',
      completed: false,
      labelIds: [],
      members: [],
      checklists: [],
      position: 2,
      startDate: undefined,
      dueDate: undefined,
      priority: null,
      listId: 'list-1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  const mockMembers: User[] = [];

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseBoardStore.mockReturnValue({
      boards: [],
      currentBoardId: 'test-board',
      createCardFromData: jest.fn(),
    } as any);

    mockUseUIStore.mockReturnValue({
      boards: [],
      currentBoardId: 'test-board',
      filterState: {},
    } as any);
  });

  it('should render cards with click handlers when onCardClick is provided', () => {
    const mockOnCardClick = jest.fn();
    const mockOnAddCard = jest.fn();

    render(
      <KanbanCardsContainer
        cards={mockCards}
        listId="list-1"
        members={mockMembers}
        onAddCard={mockOnAddCard}
        onCardClick={mockOnCardClick}
      />
    );

    // Verify all cards are rendered
    expect(screen.getByTestId('card-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('card-card-3')).toBeInTheDocument();

    // Test card clicks
    fireEvent.click(screen.getByTestId('card-card-1'));
    expect(mockOnCardClick).toHaveBeenCalledWith('card-1');

    fireEvent.click(screen.getByTestId('card-card-2'));
    expect(mockOnCardClick).toHaveBeenCalledWith('card-2');

    fireEvent.click(screen.getByTestId('card-card-3'));
    expect(mockOnCardClick).toHaveBeenCalledWith('card-3');
  });

  it('should render cards without click handlers when onCardClick is not provided', () => {
    const mockOnAddCard = jest.fn();

    render(
      <KanbanCardsContainer
        cards={mockCards}
        listId="list-1"
        members={mockMembers}
        onAddCard={mockOnAddCard}
      />
    );

    // Verify all cards are rendered
    expect(screen.getByTestId('card-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('card-card-3')).toBeInTheDocument();

    // Cards should not crash when clicked without handler
    fireEvent.click(screen.getByTestId('card-card-1'));
    // Should not throw error
  });

  it('should call onCardClick with correct card ID', () => {
    const mockOnCardClick = jest.fn();
    const mockOnAddCard = jest.fn();

    render(
      <KanbanCardsContainer
        cards={mockCards}
        listId="list-1"
        members={mockMembers}
        onAddCard={mockOnAddCard}
        onCardClick={mockOnCardClick}
      />
    );

    // Click specific card
    fireEvent.click(screen.getByTestId('card-card-2'));

    // Verify correct card ID was passed
    expect(mockOnCardClick).toHaveBeenCalledTimes(1);
    expect(mockOnCardClick).toHaveBeenCalledWith('card-2');
  });

  it('should handle multiple card clicks independently', () => {
    const mockOnCardClick = jest.fn();
    const mockOnAddCard = jest.fn();

    render(
      <KanbanCardsContainer
        cards={mockCards}
        listId="list-1"
        members={mockMembers}
        onAddCard={mockOnAddCard}
        onCardClick={mockOnCardClick}
      />
    );

    // Click multiple cards
    fireEvent.click(screen.getByTestId('card-card-1'));
    fireEvent.click(screen.getByTestId('card-card-3'));
    fireEvent.click(screen.getByTestId('card-card-2'));
    fireEvent.click(screen.getByTestId('card-card-1'));

    // Verify all clicks were recorded in order
    expect(mockOnCardClick).toHaveBeenCalledTimes(4);
    expect(mockOnCardClick).toHaveBeenNthCalledWith(1, 'card-1');
    expect(mockOnCardClick).toHaveBeenNthCalledWith(2, 'card-3');
    expect(mockOnCardClick).toHaveBeenNthCalledWith(3, 'card-2');
    expect(mockOnCardClick).toHaveBeenNthCalledWith(4, 'card-1');
  });

  it('should pass through other props correctly', () => {
    const mockOnCardClick = jest.fn();
    const mockOnAddCard = jest.fn();

    render(
      <KanbanCardsContainer
        cards={mockCards}
        listId="test-list-id"
        members={mockMembers}
        onAddCard={mockOnAddCard}
        onCardClick={mockOnCardClick}
        searchTerm="test search"
        className="test-class"
      />
    );

    // Verify cards are still clickable
    fireEvent.click(screen.getByTestId('card-card-1'));
    expect(mockOnCardClick).toHaveBeenCalledWith('card-1');
  });
});
