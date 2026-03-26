import { render, screen, fireEvent } from '@testing-library/react';
import { KanbanList } from '../KanbanList';
import { List, User } from '@/lib/types';

// Mock the KanbanCardsContainer
jest.mock('../KanbanCardsContainer', () => ({
  KanbanCardsContainer: ({ cards, onCardClick }: any) => (
    <div data-testid="cards-container">
      {cards.map((card: any) => (
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

// Mock other components
jest.mock('../KanbanListHeader', () => ({
  KanbanListHeader: ({ title, onMenuToggle }: any) => (
    <div data-testid="list-header">
      <h3>{title}</h3>
      <button onClick={() => onMenuToggle(true)}>Menu</button>
    </div>
  ),
}));

describe('KanbanList Scroll Position', () => {
  const mockList: List = {
    id: 'list-1',
    title: 'Test List',
    position: 0,
    cards: [
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
    ],
  };

  const mockMembers: User[] = [];

  it('should pass onCardClick to KanbanCardsContainer', () => {
    const mockOnCardClick = jest.fn();
    const mockOnAddCard = jest.fn();
    const mockOnRenameList = jest.fn();
    const mockOnDeleteList = jest.fn();

    render(
      <KanbanList
        list={mockList}
        members={mockMembers}
        onAddCard={mockOnAddCard}
        onRenameList={mockOnRenameList}
        onDeleteList={mockOnDeleteList}
        onCardClick={mockOnCardClick}
      />
    );

    // Verify cards container is rendered
    expect(screen.getByTestId('cards-container')).toBeInTheDocument();

    // Test card clicks
    fireEvent.click(screen.getByTestId('card-card-1'));
    expect(mockOnCardClick).toHaveBeenCalledWith('card-1');

    fireEvent.click(screen.getByTestId('card-card-2'));
    expect(mockOnCardClick).toHaveBeenCalledWith('card-2');
  });

  it('should work without onCardClick prop', () => {
    const mockOnAddCard = jest.fn();
    const mockOnRenameList = jest.fn();
    const mockOnDeleteList = jest.fn();

    render(
      <KanbanList
        list={mockList}
        members={mockMembers}
        onAddCard={mockOnAddCard}
        onRenameList={mockOnRenameList}
        onDeleteList={mockOnDeleteList}
      />
    );

    // Should render without errors
    expect(screen.getByTestId('cards-container')).toBeInTheDocument();
    expect(screen.getByTestId('list-header')).toBeInTheDocument();

    // Cards should be clickable without crashing
    fireEvent.click(screen.getByTestId('card-card-1'));
    fireEvent.click(screen.getByTestId('card-card-2'));
  });

  it('should pass through all props correctly', () => {
    const mockOnCardClick = jest.fn();
    const mockOnAddCard = jest.fn();
    const mockOnRenameList = jest.fn();
    const mockOnDeleteList = jest.fn();
    const mockOnMenuToggle = jest.fn();

    render(
      <KanbanList
        list={mockList}
        members={mockMembers}
        onAddCard={mockOnAddCard}
        onRenameList={mockOnRenameList}
        onDeleteList={mockOnDeleteList}
        onCardClick={mockOnCardClick}
        searchTerm="test search"
        className="test-class"
        onMenuToggle={mockOnMenuToggle}
        isAnyMenuOpen={false}
      />
    );

    // Verify header is rendered with correct title
    expect(screen.getByText('Test List')).toBeInTheDocument();

    // Test menu toggle
    fireEvent.click(screen.getByText('Menu'));
    expect(mockOnMenuToggle).toHaveBeenCalledWith(true);

    // Test card clicks still work
    fireEvent.click(screen.getByTestId('card-card-1'));
    expect(mockOnCardClick).toHaveBeenCalledWith('card-1');
  });

  it('should handle isAnyMenuOpen prop correctly', () => {
    const mockOnCardClick = jest.fn();
    const mockOnAddCard = jest.fn();
    const mockOnRenameList = jest.fn();
    const mockOnDeleteList = jest.fn();

    render(
      <KanbanList
        list={mockList}
        members={mockMembers}
        onAddCard={mockOnAddCard}
        onRenameList={mockOnRenameList}
        onDeleteList={mockOnDeleteList}
        onCardClick={mockOnCardClick}
        isAnyMenuOpen={true}
      />
    );

    // Should still render correctly even with menu open
    expect(screen.getByTestId('cards-container')).toBeInTheDocument();
    expect(screen.getByTestId('list-header')).toBeInTheDocument();

    // Card clicks should still work
    fireEvent.click(screen.getByTestId('card-card-1'));
    expect(mockOnCardClick).toHaveBeenCalledWith('card-1');
  });
});
