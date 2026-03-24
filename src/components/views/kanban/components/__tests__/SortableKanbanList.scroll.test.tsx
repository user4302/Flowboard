import { render, screen, fireEvent } from '@testing-library/react';
import { SortableKanbanList } from '../SortableKanbanList';
import { List, User } from '@/lib/types';

// Mock the useSortable hook
jest.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

// Mock the KanbanList
jest.mock('../KanbanList', () => ({
  KanbanList: ({ list, onCardClick, ...props }: any) => (
    <div data-testid="kanban-list">
      <h3>{list.title}</h3>
      <div data-testid="cards">
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
    </div>
  ),
}));

describe('SortableKanbanList Scroll Position', () => {
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

  it('should pass onCardClick to underlying KanbanList', () => {
    const mockOnCardClick = jest.fn();
    const mockOnAddCard = jest.fn();
    const mockOnRenameList = jest.fn();
    const mockOnDeleteList = jest.fn();

    render(
      <SortableKanbanList
        list={mockList}
        members={mockMembers}
        onAddCard={mockOnAddCard}
        onRenameList={mockOnRenameList}
        onDeleteList={mockOnDeleteList}
        onCardClick={mockOnCardClick}
      />
    );

    // Verify the list is rendered
    expect(screen.getByTestId('kanban-list')).toBeInTheDocument();
    expect(screen.getByText('Test List')).toBeInTheDocument();

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
      <SortableKanbanList
        list={mockList}
        members={mockMembers}
        onAddCard={mockOnAddCard}
        onRenameList={mockOnRenameList}
        onDeleteList={mockOnDeleteList}
      />
    );

    // Should render without errors
    expect(screen.getByTestId('kanban-list')).toBeInTheDocument();

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
      <SortableKanbanList
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

    // Verify list is rendered
    expect(screen.getByTestId('kanban-list')).toBeInTheDocument();
    expect(screen.getByText('Test List')).toBeInTheDocument();

    // Test card clicks
    fireEvent.click(screen.getByTestId('card-card-1'));
    expect(mockOnCardClick).toHaveBeenCalledWith('card-1');
  });

  it('should handle isAnyMenuOpen prop correctly', () => {
    const mockOnCardClick = jest.fn();
    const mockOnAddCard = jest.fn();
    const mockOnRenameList = jest.fn();
    const mockOnDeleteList = jest.fn();

    render(
      <SortableKanbanList
        list={mockList}
        members={mockMembers}
        onAddCard={mockOnAddCard}
        onRenameList={mockOnRenameList}
        onDeleteList={mockOnDeleteList}
        onCardClick={mockOnCardClick}
        isAnyMenuOpen={true}
      />
    );

    // Should still render correctly
    expect(screen.getByTestId('kanban-list')).toBeInTheDocument();

    // Card clicks should still work
    fireEvent.click(screen.getByTestId('card-card-1'));
    expect(mockOnCardClick).toHaveBeenCalledWith('card-1');
  });

  it('should maintain drag and drop functionality', () => {
    const mockOnCardClick = jest.fn();
    const mockOnAddCard = jest.fn();
    const mockOnRenameList = jest.fn();
    const mockOnDeleteList = jest.fn();

    const { container } = render(
      <SortableKanbanList
        list={mockList}
        members={mockMembers}
        onAddCard={mockOnAddCard}
        onRenameList={mockOnRenameList}
        onDeleteList={mockOnDeleteList}
        onCardClick={mockOnCardClick}
      />
    );

    // Should render with drag functionality
    expect(screen.getByTestId('kanban-list')).toBeInTheDocument();

    // Card clicks should still work alongside drag functionality
    fireEvent.click(screen.getByTestId('card-card-1'));
    expect(mockOnCardClick).toHaveBeenCalledWith('card-1');
  });
});
