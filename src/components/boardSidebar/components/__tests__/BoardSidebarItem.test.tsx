import { render, screen, fireEvent } from '@testing-library/react';
import { BoardSidebarItem } from '../BoardSidebarItem';
import type { Board } from '../types';

describe('BoardSidebarItem Component', () => {
  const mockBoard: Board = {
    id: 'board-1',
    name: 'Test Board',
    lists: [
      { id: 'list-1', name: 'To Do', cards: [] },
      { id: 'list-2', name: 'In Progress', cards: [] }
    ],
    members: [
      { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
      { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' }
    ]
  };

  const mockOnSelect = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders board information correctly', () => {
    render(
      <BoardSidebarItem
        board={mockBoard}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Board')).toBeInTheDocument();
    expect(screen.getByText('2 lists • 2 members')).toBeInTheDocument();
  });

  it('applies active styling when isActive is true', () => {
    render(
      <BoardSidebarItem
        board={mockBoard}
        isActive={true}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    const container = screen.getByText('Test Board').closest('.relative');
    const boardButton = container!.querySelector('button:not([title*="Delete"])') as HTMLElement;
    expect(boardButton).toHaveClass('bg-indigo-100', 'text-indigo-700');
  });

  it('applies inactive styling when isActive is false', () => {
    render(
      <BoardSidebarItem
        board={mockBoard}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    const container = screen.getByText('Test Board').closest('.relative');
    const boardButton = container!.querySelector('button:not([title*="Delete"])') as HTMLElement;
    expect(boardButton).toHaveClass('text-slate-700', 'hover:bg-slate-100');
  });

  it('calls onSelect when board button is clicked', () => {
    render(
      <BoardSidebarItem
        board={mockBoard}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    const container = screen.getByText('Test Board').closest('.relative');
    const boardButton = container!.querySelector('button:not([title*="Delete"])') as HTMLElement;
    fireEvent.click(boardButton);

    expect(mockOnSelect).toHaveBeenCalledWith('board-1');
  });

  it('shows delete button on hover', () => {
    render(
      <BoardSidebarItem
        board={mockBoard}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    const container = screen.getByText('Test Board').closest('.relative');

    // Initially should have opacity-0
    const deleteButton = container!.querySelector('button[title*="Delete"]');
    expect(deleteButton).toHaveClass('opacity-0');

    // Simulate hover
    fireEvent.mouseEnter(container!);

    // Should have opacity-100 on hover
    expect(deleteButton).toHaveClass('group-hover:opacity-100');
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <BoardSidebarItem
        board={mockBoard}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    const container = screen.getByText('Test Board').closest('.relative');
    const deleteButton = container!.querySelector('button[title*="Delete"]') as HTMLElement;

    // Make delete button visible
    fireEvent.mouseEnter(container!);

    // Click delete button
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('board-1', 'Test Board');
    expect(mockOnSelect).not.toHaveBeenCalled(); // Should not trigger board selection
  });

  it('prevents event propagation on delete button click', () => {
    render(
      <BoardSidebarItem
        board={mockBoard}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    const container = screen.getByText('Test Board').closest('.relative');
    const deleteButton = container!.querySelector('button[title*="Delete"]') as HTMLElement;

    // Make delete button visible
    fireEvent.mouseEnter(container!);

    // Click delete button
    fireEvent.click(deleteButton);

    // Should only call onDelete, not onSelect
    expect(mockOnDelete).toHaveBeenCalled();
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('displays correct list and member counts', () => {
    const boardWithEmptyLists: Board = {
      ...mockBoard,
      lists: [],
      members: [{ id: 'user-1', name: 'John Doe', email: 'john@example.com' }]
    };

    render(
      <BoardSidebarItem
        board={boardWithEmptyLists}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('0 lists • 1 members')).toBeInTheDocument();
  });

  it('truncates long board names', () => {
    const boardWithLongName: Board = {
      ...mockBoard,
      name: 'This is a very long board name that should be truncated'
    };

    render(
      <BoardSidebarItem
        board={boardWithLongName}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    const nameElement = screen.getByText(/This is a very long board name/);
    expect(nameElement).toHaveClass('truncate');
    expect(nameElement).toHaveAttribute('title', 'This is a very long board name that should be truncated');
  });

  it('applies correct CSS classes to main elements', () => {
    render(
      <BoardSidebarItem
        board={mockBoard}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    const container = screen.getByText('Test Board').closest('.relative');
    expect(container).toHaveClass('relative', 'group');

    const boardButton = container!.querySelector('button:not([title*="Delete"])') as HTMLElement;
    expect(boardButton).toHaveClass(
      'w-full',
      'rounded-lg',
      'px-3',
      'py-2',
      'text-left',
      'text-sm',
      'transition-colors'
    );
  });

  it('applies correct CSS classes to delete button', () => {
    render(
      <BoardSidebarItem
        board={mockBoard}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    const container = screen.getByText('Test Board').closest('.relative');
    const deleteButton = container!.querySelector('button[title*="Delete"]');

    expect(deleteButton).toHaveClass(
      'absolute',
      'top-2',
      'right-2',
      'opacity-0',
      'group-hover:opacity-100',
      'transition-opacity',
      'p-1',
      'rounded',
      'hover:bg-slate-200',
      'flex-shrink-0'
    );
  });

  it('has correct title attribute on delete button', () => {
    render(
      <BoardSidebarItem
        board={mockBoard}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    const container = screen.getByText('Test Board').closest('.relative');
    const deleteButton = container!.querySelector('button[title*="Delete"]');

    expect(deleteButton).toHaveAttribute('title', 'Delete Test Board');
  });

  it('handles board with no members', () => {
    const boardWithNoMembers: Board = {
      ...mockBoard,
      members: []
    };

    render(
      <BoardSidebarItem
        board={boardWithNoMembers}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('2 lists • 0 members')).toBeInTheDocument();
  });

  it('handles board with no lists and no members', () => {
    const emptyBoard: Board = {
      ...mockBoard,
      lists: [],
      members: []
    };

    render(
      <BoardSidebarItem
        board={emptyBoard}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('0 lists • 0 members')).toBeInTheDocument();
  });

  it('renders LayoutGrid icon', () => {
    render(
      <BoardSidebarItem
        board={mockBoard}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    const container = screen.getByText('Test Board').closest('.relative');
    const icon = container!.querySelector('button:not([title*="Delete"]) svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('h-4', 'w-4');
  });

  it('renders Trash2 icon in delete button', () => {
    render(
      <BoardSidebarItem
        board={mockBoard}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    const container = screen.getByText('Test Board').closest('.relative');
    const deleteButton = container!.querySelector('button[title*="Delete"]');
    const icon = deleteButton!.querySelector('svg');

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('h-3', 'w-3');
  });

  it('handles multiple rapid clicks on board button', () => {
    render(
      <BoardSidebarItem
        board={mockBoard}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    const container = screen.getByText('Test Board').closest('.relative');
    const boardButton = container!.querySelector('button:not([title*="Delete"])') as HTMLElement;

    fireEvent.click(boardButton);
    fireEvent.click(boardButton);
    fireEvent.click(boardButton);

    expect(mockOnSelect).toHaveBeenCalledTimes(3);
    expect(mockOnSelect).toHaveBeenLastCalledWith('board-1');
  });

  it('handles multiple rapid clicks on delete button', () => {
    render(
      <BoardSidebarItem
        board={mockBoard}
        isActive={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    );

    const container = screen.getByText('Test Board').closest('.relative');
    const deleteButton = container!.querySelector('button[title*="Delete"]') as HTMLElement;

    // Make delete button visible
    fireEvent.mouseEnter(container!);

    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(2);
    expect(mockOnDelete).toHaveBeenLastCalledWith('board-1', 'Test Board');
  });
});