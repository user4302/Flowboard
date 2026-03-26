import { render, screen, fireEvent } from '@testing-library/react';
import { BoardSidebarBoardList } from '../BoardSidebarBoardList';
import type { Board } from '../../types';

// Mock the child components
jest.mock('../BoardSidebarItem', () => ({
  BoardSidebarItem: ({ board, isActive, onSelect, onDelete }: any) => (
    <div data-testid={`board-item-${board.id}`} className={isActive ? 'active' : ''}>
      <span>{board.name}</span>
      <button onClick={() => onSelect(board.id)}>Select</button>
      <button onClick={() => onDelete(board.id, board.name)}>Delete</button>
    </div>
  )
}));

jest.mock('../BoardSidebarCreationForm', () => ({
  BoardSidebarCreationForm: ({ onCreateBoard, onCancel }: any) => (
    <div data-testid="creation-form">
      <button onClick={() => onCreateBoard('New Board')}>Create</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}));

// Mock the Button component
jest.mock('@/components/ui', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  )
}));

describe('BoardSidebarBoardList Component', () => {
  const mockBoards: Board[] = [
    { id: 'board-1', name: 'Board 1', lists: [], members: [] },
    { id: 'board-2', name: 'Board 2', lists: [], members: [] },
    { id: 'board-3', name: 'Board 3', lists: [], members: [] }
  ];

  const mockOnSelectBoard = jest.fn();
  const mockOnDeleteBoard = jest.fn();
  const mockOnCreateBoard = jest.fn();
  const mockOnCancelCreation = jest.fn();
  const mockOnCloseSidebar = jest.fn();
  const mockOnStartCreatingBoard = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders board list header', () => {
    render(
      <BoardSidebarBoardList
        boards={mockBoards}
        currentBoardId="board-1"
        isCreatingBoard={false}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
        onStartCreatingBoard={mockOnStartCreatingBoard}
      />
    );

    expect(screen.getByText('Your Boards')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    // First button should be the plus button
    expect(buttons[0]).toBeInTheDocument(); // Plus button
  });

  it('renders all board items', () => {
    render(
      <BoardSidebarBoardList
        boards={mockBoards}
        currentBoardId="board-1"
        isCreatingBoard={false}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
        onStartCreatingBoard={mockOnStartCreatingBoard}
      />
    );

    expect(screen.getByTestId('board-item-board-1')).toBeInTheDocument();
    expect(screen.getByTestId('board-item-board-2')).toBeInTheDocument();
    expect(screen.getByTestId('board-item-board-3')).toBeInTheDocument();
  });

  it('highlights active board', () => {
    render(
      <BoardSidebarBoardList
        boards={mockBoards}
        currentBoardId="board-2"
        isCreatingBoard={false}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
        onStartCreatingBoard={mockOnStartCreatingBoard}
      />
    );

    const activeBoard = screen.getByTestId('board-item-board-2');
    expect(activeBoard).toHaveClass('active');
  });

  it('shows creation form when isCreatingBoard is true', () => {
    render(
      <BoardSidebarBoardList
        boards={mockBoards}
        currentBoardId="board-1"
        isCreatingBoard={true}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
        onStartCreatingBoard={mockOnStartCreatingBoard}
      />
    );

    expect(screen.getByTestId('creation-form')).toBeInTheDocument();
  });

  it('does not show creation form when isCreatingBoard is false', () => {
    render(
      <BoardSidebarBoardList
        boards={mockBoards}
        currentBoardId="board-1"
        isCreatingBoard={false}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
        onStartCreatingBoard={mockOnStartCreatingBoard}
      />
    );

    expect(screen.queryByTestId('creation-form')).not.toBeInTheDocument();
  });

  it('calls onStartCreatingBoard when plus button is clicked', () => {
    render(
      <BoardSidebarBoardList
        boards={mockBoards}
        currentBoardId="board-1"
        isCreatingBoard={false}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
        onStartCreatingBoard={mockOnStartCreatingBoard}
      />
    );

    const buttons = screen.getAllByRole('button');
    const plusButton = buttons[0]; // First button should be the plus button
    fireEvent.click(plusButton);

    expect(mockOnStartCreatingBoard).toHaveBeenCalled();
  });

  it('calls onSelectBoard and onCloseSidebar when board is selected', () => {
    render(
      <BoardSidebarBoardList
        boards={mockBoards}
        currentBoardId="board-1"
        isCreatingBoard={false}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
        onStartCreatingBoard={mockOnStartCreatingBoard}
      />
    );

    const boardItem = screen.getByTestId('board-item-board-1');
    const selectButton = boardItem.querySelector('button');
    fireEvent.click(selectButton!);

    expect(mockOnSelectBoard).toHaveBeenCalledWith('board-1');
    expect(mockOnCloseSidebar).toHaveBeenCalled();
  });

  it('passes correct props to BoardSidebarItem', () => {
    render(
      <BoardSidebarBoardList
        boards={mockBoards}
        currentBoardId="board-2"
        isCreatingBoard={false}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
        onStartCreatingBoard={mockOnStartCreatingBoard}
      />
    );

    const boardItem1 = screen.getByTestId('board-item-board-1');
    const boardItem2 = screen.getByTestId('board-item-board-2');

    expect(boardItem1).not.toHaveClass('active');
    expect(boardItem2).toHaveClass('active');
  });

  it('passes correct props to BoardSidebarCreationForm', () => {
    render(
      <BoardSidebarBoardList
        boards={mockBoards}
        currentBoardId="board-1"
        isCreatingBoard={true}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
        onStartCreatingBoard={mockOnStartCreatingBoard}
      />
    );

    const creationForm = screen.getByTestId('creation-form');
    const createButton = creationForm.querySelector('button');
    const cancelButton = creationForm.querySelectorAll('button')[1];

    fireEvent.click(createButton!);
    expect(mockOnCreateBoard).toHaveBeenCalledWith('New Board');

    fireEvent.click(cancelButton!);
    expect(mockOnCancelCreation).toHaveBeenCalled();
  });

  it('handles empty boards array', () => {
    render(
      <BoardSidebarBoardList
        boards={[]}
        currentBoardId={null}
        isCreatingBoard={false}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
        onStartCreatingBoard={mockOnStartCreatingBoard}
      />
    );

    expect(screen.getByText('Your Boards')).toBeInTheDocument();
    expect(screen.queryByTestId('board-item-board-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('board-item-board-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('board-item-board-3')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <BoardSidebarBoardList
        boards={mockBoards}
        currentBoardId="board-1"
        isCreatingBoard={false}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
        onStartCreatingBoard={mockOnStartCreatingBoard}
      />
    );

    const mainContainer = container.querySelector('.mb-4');
    expect(mainContainer).toBeInTheDocument();

    const headerContainer = container.querySelector('.mb-3');
    expect(headerContainer).toBeInTheDocument();

    const boardsListContainer = container.querySelector('.space-y-1');
    expect(boardsListContainer).toBeInTheDocument();
  });

  it('renders header with correct styling', () => {
    render(
      <BoardSidebarBoardList
        boards={mockBoards}
        currentBoardId="board-1"
        isCreatingBoard={false}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
        onStartCreatingBoard={mockOnStartCreatingBoard}
      />
    );

    const header = screen.getByText('Your Boards');
    expect(header).toHaveClass('text-sm', 'font-medium', 'text-slate-500');
  });

  it('works without onStartCreatingBoard prop', () => {
    render(
      <BoardSidebarBoardList
        boards={mockBoards}
        currentBoardId="board-1"
        isCreatingBoard={false}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
      />
    );

    expect(screen.getByText('Your Boards')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeInTheDocument(); // Plus button should still render
  });

  it('handles multiple board selections', () => {
    render(
      <BoardSidebarBoardList
        boards={mockBoards}
        currentBoardId={null}
        isCreatingBoard={false}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
        onStartCreatingBoard={mockOnStartCreatingBoard}
      />
    );

    // Select board 1
    const boardItem1 = screen.getByTestId('board-item-board-1');
    fireEvent.click(boardItem1.querySelector('button')!);
    expect(mockOnSelectBoard).toHaveBeenCalledWith('board-1');
    expect(mockOnCloseSidebar).toHaveBeenCalledTimes(1);

    // Select board 2
    const boardItem2 = screen.getByTestId('board-item-board-2');
    fireEvent.click(boardItem2.querySelector('button')!);
    expect(mockOnSelectBoard).toHaveBeenCalledWith('board-2');
    expect(mockOnCloseSidebar).toHaveBeenCalledTimes(2);
  });

  it('handles board deletion through child component', () => {
    render(
      <BoardSidebarBoardList
        boards={mockBoards}
        currentBoardId="board-1"
        isCreatingBoard={false}
        onSelectBoard={mockOnSelectBoard}
        onDeleteBoard={mockOnDeleteBoard}
        onCreateBoard={mockOnCreateBoard}
        onCancelCreation={mockOnCancelCreation}
        onCloseSidebar={mockOnCloseSidebar}
        onStartCreatingBoard={mockOnStartCreatingBoard}
      />
    );

    const boardItem = screen.getByTestId('board-item-board-1');
    const deleteButton = boardItem.querySelectorAll('button')[1];
    fireEvent.click(deleteButton!);

    expect(mockOnDeleteBoard).toHaveBeenCalledWith('board-1', 'Board 1');
  });
});
