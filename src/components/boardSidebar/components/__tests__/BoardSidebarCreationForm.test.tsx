import { render, screen, fireEvent, act } from '@testing-library/react';
import { BoardSidebarCreationForm } from '../BoardSidebarCreationForm';

// Mock the Button component
jest.mock('@/components/ui', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  )
}));

describe('BoardSidebarCreationForm Component', () => {
  const mockOnCreateBoard = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders input field and buttons', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByPlaceholderText('Board name...')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Board name...');

    fireEvent.change(input, { target: { value: 'New Board' } });

    expect(input).toHaveValue('New Board');
  });

  it('calls onCreateBoard when Add button is clicked with valid input', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Board name...');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'New Board' } });
    fireEvent.click(addButton);

    expect(mockOnCreateBoard).toHaveBeenCalledWith('New Board');
    expect(input).toHaveValue(''); // Should be cleared
  });

  it('does not call onCreateBoard when Add button is clicked with empty input', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const addButton = screen.getByText('Add');

    fireEvent.click(addButton);

    expect(mockOnCreateBoard).not.toHaveBeenCalled();
  });

  it('does not call onCreateBoard when Add button is clicked with whitespace-only input', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Board name...');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(addButton);

    expect(mockOnCreateBoard).not.toHaveBeenCalled();
  });

  it('calls onCancel and clears input when Cancel button is clicked', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Board name...');
    const cancelButton = screen.getByText('Cancel');

    fireEvent.change(input, { target: { value: 'New Board' } });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
    expect(input).toHaveValue('');
  });

  it('calls onCreateBoard when Enter key is pressed with valid input', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Board name...');

    fireEvent.change(input, { target: { value: 'New Board' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnCreateBoard).toHaveBeenCalledWith('New Board');
    expect(input).toHaveValue('');
  });

  it('calls onCancel and clears input when Escape key is pressed', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Board name...');

    fireEvent.change(input, { target: { value: 'New Board' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(mockOnCancel).toHaveBeenCalled();
    expect(input).toHaveValue('');
  });

  it('does not trigger on other key presses', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Board name...');

    fireEvent.change(input, { target: { value: 'New Board' } });
    fireEvent.keyDown(input, { key: 'Tab' });

    expect(mockOnCreateBoard).not.toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();
    expect(input).toHaveValue('New Board');
  });

  it('calls onCancel and clears input after blur with delay', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Board name...');

    fireEvent.change(input, { target: { value: 'New Board' } });
    fireEvent.blur(input);

    // Should not be called immediately
    expect(mockOnCancel).not.toHaveBeenCalled();
    expect(input).toHaveValue('New Board');

    // Fast-forward past the delay
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(mockOnCancel).toHaveBeenCalled();
    expect(input).toHaveValue('');
  });

  it('trims whitespace from board name before calling onCreateBoard', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Board name...');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: '  New Board  ' } });
    fireEvent.click(addButton);

    expect(mockOnCreateBoard).toHaveBeenCalledWith('New Board');
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const formContainer = container.querySelector('.mb-3');
    expect(formContainer).toBeInTheDocument();
    expect(formContainer).toHaveClass('rounded-lg', 'border', 'border-slate-200', 'p-2');
  });

  it('applies correct CSS classes to input', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Board name...');
    expect(input).toHaveClass('w-full', 'rounded-md', 'border', 'px-2', 'py-1');
  });

  it('applies correct CSS classes to buttons', () => {
    const { container } = render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const buttonContainer = container.querySelector('.mt-2');
    expect(buttonContainer).toBeInTheDocument();
    expect(buttonContainer).toHaveClass('flex', 'gap-2');
  });

  it('has autoFocus on input field', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Board name...');
    expect(input).toHaveFocus();
  });

  it('handles multiple rapid operations', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Board name...');
    const addButton = screen.getByText('Add');

    // Rapid typing and submission
    fireEvent.change(input, { target: { value: 'Board 1' } });
    fireEvent.click(addButton);

    fireEvent.change(input, { target: { value: 'Board 2' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnCreateBoard).toHaveBeenCalledTimes(2);
    expect(mockOnCreateBoard).toHaveBeenLastCalledWith('Board 2');
  });

  it('handles blur cancellation when new blur happens before timeout', () => {
    render(
      <BoardSidebarCreationForm
        onCreateBoard={mockOnCreateBoard}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Board name...');

    fireEvent.change(input, { target: { value: 'New Board' } });
    fireEvent.blur(input);

    // Blur again before timeout completes
    fireEvent.blur(input);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Should be called twice (once for each blur)
    expect(mockOnCancel).toHaveBeenCalledTimes(2);
  });
});
