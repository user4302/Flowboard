import { render, screen, fireEvent } from '@testing-library/react';
import { BoardHeaderTitle } from '../BoardHeaderTitle';
import { Board } from '@/lib/types';

// Mock hook
jest.mock('../../hooks/useBoardHeaderTitle', () => ({
  useBoardHeaderTitle: jest.fn()
}));

const mockUseBoardHeaderTitle = require('../../hooks/useBoardHeaderTitle').useBoardHeaderTitle;

describe('BoardHeaderTitle Component', () => {
  const mockBoard: Board = {
    id: 'board-1',
    name: 'Test Board',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const defaultProps = {
    currentBoard: mockBoard
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders board name when not editing', () => {
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: false,
      tempTitle: '',
      setTempTitle: jest.fn(),
      handleTitleEdit: jest.fn(),
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: jest.fn()
    });

    render(<BoardHeaderTitle {...defaultProps} />);

    expect(screen.getByText('Test Board')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Test Board')).not.toBeInTheDocument();
  });

  it('renders input when editing', () => {
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: true,
      tempTitle: 'New Board Name',
      setTempTitle: jest.fn(),
      handleTitleEdit: jest.fn(),
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: jest.fn()
    });

    render(<BoardHeaderTitle {...defaultProps} />);

    const input = screen.getByDisplayValue('New Board Name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveFocus();
  });

  it('calls handleTitleEdit when title is clicked', () => {
    const mockHandleTitleEdit = jest.fn();
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: false,
      tempTitle: '',
      setTempTitle: jest.fn(),
      handleTitleEdit: mockHandleTitleEdit,
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: jest.fn()
    });

    render(<BoardHeaderTitle {...defaultProps} />);

    const title = screen.getByText('Test Board');
    fireEvent.click(title);

    expect(mockHandleTitleEdit).toHaveBeenCalledTimes(1);
  });

  it('calls setTempTitle when input value changes', () => {
    const mockSetTempTitle = jest.fn();
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: true,
      tempTitle: 'Initial Name',
      setTempTitle: mockSetTempTitle,
      handleTitleEdit: jest.fn(),
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: jest.fn()
    });

    render(<BoardHeaderTitle {...defaultProps} />);

    const input = screen.getByDisplayValue('Initial Name');
    fireEvent.change(input, { target: { value: 'Updated Name' } });

    expect(mockSetTempTitle).toHaveBeenCalledWith('Updated Name');
  });

  it('calls handleTitleSave when input loses focus', () => {
    const mockHandleTitleSave = jest.fn();
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: true,
      tempTitle: 'Current Name',
      setTempTitle: jest.fn(),
      handleTitleEdit: jest.fn(),
      handleTitleSave: mockHandleTitleSave,
      handleTitleKeyPress: jest.fn()
    });

    render(<BoardHeaderTitle {...defaultProps} />);

    const input = screen.getByDisplayValue('Current Name');
    fireEvent.blur(input);

    expect(mockHandleTitleSave).toHaveBeenCalledTimes(1);
  });

  it('calls handleTitleKeyPress when key is pressed', () => {
    const mockHandleTitleKeyPress = jest.fn();
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: true,
      tempTitle: 'Current Name',
      setTempTitle: jest.fn(),
      handleTitleEdit: jest.fn(),
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: mockHandleTitleKeyPress
    });

    render(<BoardHeaderTitle {...defaultProps} />);

    const input = screen.getByDisplayValue('Current Name');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockHandleTitleKeyPress).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'Enter' })
    );
  });

  it('displays null when currentBoard is null', () => {
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: false,
      tempTitle: '',
      setTempTitle: jest.fn(),
      handleTitleEdit: jest.fn(),
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: jest.fn()
    });

    render(<BoardHeaderTitle currentBoard={null} />);

    expect(screen.queryByText('Test Board')).not.toBeInTheDocument();
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('applies correct CSS classes to title', () => {
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: false,
      tempTitle: '',
      setTempTitle: jest.fn(),
      handleTitleEdit: jest.fn(),
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: jest.fn()
    });

    render(<BoardHeaderTitle {...defaultProps} />);

    const title = screen.getByRole('heading');
    expect(title).toHaveClass('cursor-pointer', 'text-lg', 'font-semibold', 'text-slate-900', 'hover:text-slate-700', 'dark:text-slate-100', 'dark:hover:text-slate-300', 'truncate');
  });

  it('applies correct CSS classes to input', () => {
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: true,
      tempTitle: 'Test Name',
      setTempTitle: jest.fn(),
      handleTitleEdit: jest.fn(),
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: jest.fn()
    });

    render(<BoardHeaderTitle {...defaultProps} />);

    const input = screen.getByDisplayValue('Test Name');
    expect(input).toHaveClass('rounded-lg', 'border', 'border-slate-300', 'px-2', 'py-1', 'text-lg', 'font-semibold', 'focus:border-indigo-500', 'focus:outline-none', 'focus:ring-1', 'focus:ring-indigo-500', 'dark:border-slate-600', 'dark:bg-slate-800', 'dark:text-slate-100');
  });

  it('has correct container structure', () => {
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: false,
      tempTitle: '',
      setTempTitle: jest.fn(),
      handleTitleEdit: jest.fn(),
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: jest.fn()
    });

    const { container } = render(<BoardHeaderTitle {...defaultProps} />);

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('flex', 'items-center', 'gap-2', 'truncate');
  });

  it('handles Enter key press correctly', () => {
    const mockHandleTitleKeyPress = jest.fn();
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: true,
      tempTitle: 'Current Name',
      setTempTitle: jest.fn(),
      handleTitleEdit: jest.fn(),
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: mockHandleTitleKeyPress
    });

    render(<BoardHeaderTitle {...defaultProps} />);

    const input = screen.getByDisplayValue('Current Name');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockHandleTitleKeyPress).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'Enter' })
    );
  });

  it('handles Escape key press correctly', () => {
    const mockHandleTitleKeyPress = jest.fn();
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: true,
      tempTitle: 'Current Name',
      setTempTitle: jest.fn(),
      handleTitleEdit: jest.fn(),
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: mockHandleTitleKeyPress
    });

    render(<BoardHeaderTitle {...defaultProps} />);

    const input = screen.getByDisplayValue('Current Name');
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(mockHandleTitleKeyPress).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'Escape' })
    );
  });

  it('input has autoFocus attribute', () => {
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: true,
      tempTitle: 'Test Name',
      setTempTitle: jest.fn(),
      handleTitleEdit: jest.fn(),
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: jest.fn()
    });

    render(<BoardHeaderTitle {...defaultProps} />);

    const input = screen.getByDisplayValue('Test Name');
    expect(input).toHaveFocus();
  });

  it('title has correct accessibility role', () => {
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: false,
      tempTitle: '',
      setTempTitle: jest.fn(),
      handleTitleEdit: jest.fn(),
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: jest.fn()
    });

    render(<BoardHeaderTitle {...defaultProps} />);

    const title = screen.getByRole('heading');
    expect(title).toBeInTheDocument();
  });

  it('input has correct accessibility attributes', () => {
    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: true,
      tempTitle: 'Test Name',
      setTempTitle: jest.fn(),
      handleTitleEdit: jest.fn(),
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: jest.fn()
    });

    render(<BoardHeaderTitle {...defaultProps} />);

    const input = screen.getByDisplayValue('Test Name');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('handles empty board name correctly', () => {
    const emptyBoard: Board = {
      id: 'board-2',
      name: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockUseBoardHeaderTitle.mockReturnValue({
      isEditingTitle: false,
      tempTitle: '',
      setTempTitle: jest.fn(),
      handleTitleEdit: jest.fn(),
      handleTitleSave: jest.fn(),
      handleTitleKeyPress: jest.fn()
    });

    render(<BoardHeaderTitle currentBoard={emptyBoard} />);

    const title = screen.getByRole('heading');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('');
  });
});
