import { render, screen, fireEvent } from '@testing-library/react';
import { JoinForm } from '../JoinForm';
import type { JoinFormData } from '../../types';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Lock: () => <div data-testid="lock-icon" />
}));

// Mock UI Button component
jest.mock('@/components/ui', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>
}));

describe('JoinForm Component', () => {
  const mockFormData: JoinFormData = {
    email: '',
    username: '',
    password: ''
  };

  const mockOnUpdateField = jest.fn();
  const mockOnKeyPress = jest.fn();

  const defaultProps = {
    formData: mockFormData,
    isLoading: false,
    onUpdateField: mockOnUpdateField,
    onKeyPress: mockOnKeyPress
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<JoinForm {...defaultProps} />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('renders icons for each field', () => {
    render(<JoinForm {...defaultProps} />);

    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
  });

  it('displays correct placeholders', () => {
    render(<JoinForm {...defaultProps} />);

    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument();
  });

  it('calls onUpdateField when email field changes', () => {
    render(<JoinForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(mockOnUpdateField).toHaveBeenCalledWith('email', 'test@example.com');
  });

  it('calls onUpdateField when username field changes', () => {
    render(<JoinForm {...defaultProps} />);

    const usernameInput = screen.getByPlaceholderText('Choose a username');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    expect(mockOnUpdateField).toHaveBeenCalledWith('username', 'testuser');
  });

  it('calls onUpdateField when password field changes', () => {
    render(<JoinForm {...defaultProps} />);

    const passwordInput = screen.getByPlaceholderText('Create a password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(mockOnUpdateField).toHaveBeenCalledWith('password', 'password123');
  });

  it('calls onKeyPress when key is pressed in email field', () => {
    render(<JoinForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    fireEvent.keyPress(emailInput, { key: 'Enter', charCode: 13 });

    expect(mockOnKeyPress).toHaveBeenCalled();
  });

  it('calls onKeyPress when key is pressed in username field', () => {
    render(<JoinForm {...defaultProps} />);

    const usernameInput = screen.getByPlaceholderText('Choose a username');
    fireEvent.keyPress(usernameInput, { key: 'Enter', charCode: 13 });

    expect(mockOnKeyPress).toHaveBeenCalled();
  });

  it('calls onKeyPress when key is pressed in password field', () => {
    render(<JoinForm {...defaultProps} />);

    const passwordInput = screen.getByPlaceholderText('Create a password');
    fireEvent.keyPress(passwordInput, { key: 'Enter', charCode: 13 });

    expect(mockOnKeyPress).toHaveBeenCalled();
  });

  it('disables all fields when isLoading is true', () => {
    render(<JoinForm {...defaultProps} isLoading={true} />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const usernameInput = screen.getByPlaceholderText('Choose a username');
    const passwordInput = screen.getByPlaceholderText('Create a password');

    expect(emailInput).toBeDisabled();
    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });

  it('enables all fields when isLoading is false', () => {
    render(<JoinForm {...defaultProps} isLoading={false} />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const usernameInput = screen.getByPlaceholderText('Choose a username');
    const passwordInput = screen.getByPlaceholderText('Create a password');

    expect(emailInput).not.toBeDisabled();
    expect(usernameInput).not.toBeDisabled();
    expect(passwordInput).not.toBeDisabled();
  });

  it('displays current form data values', () => {
    const filledFormData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123'
    };

    render(<JoinForm {...defaultProps} formData={filledFormData} />);

    const emailInput = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
    const usernameInput = screen.getByPlaceholderText('Choose a username') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Create a password') as HTMLInputElement;

    expect(emailInput.value).toBe('test@example.com');
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  it('has correct input types', () => {
    render(<JoinForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
    const usernameInput = screen.getByPlaceholderText('Choose a username') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Create a password') as HTMLInputElement;

    expect(emailInput.type).toBe('email');
    expect(usernameInput.type).toBe('text');
    expect(passwordInput.type).toBe('password');
  });

  it('applies correct CSS classes to inputs', () => {
    render(<JoinForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const usernameInput = screen.getByPlaceholderText('Choose a username');
    const passwordInput = screen.getByPlaceholderText('Create a password');

    expect(emailInput).toHaveClass('w-full', 'rounded-md', 'border', 'border-slate-300', 'pl-10', 'pr-3', 'py-2', 'text-sm');
    expect(usernameInput).toHaveClass('w-full', 'rounded-md', 'border', 'border-slate-300', 'pl-10', 'pr-3', 'py-2', 'text-sm');
    expect(passwordInput).toHaveClass('w-full', 'rounded-md', 'border', 'border-slate-300', 'pl-10', 'pr-3', 'py-2', 'text-sm');
  });

  it('has correct container structure', () => {
    const { container } = render(<JoinForm {...defaultProps} />);

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('mb-4', 'space-y-4');

    // Look for the three field containers by their structure
    const fieldContainers = container.querySelectorAll('.mb-4.space-y-4 > div');
    expect(fieldContainers).toHaveLength(3);
  });

  it('handles multiple field changes correctly', () => {
    render(<JoinForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const usernameInput = screen.getByPlaceholderText('Choose a username');
    const passwordInput = screen.getByPlaceholderText('Create a password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(mockOnUpdateField).toHaveBeenCalledTimes(3);
    expect(mockOnUpdateField).toHaveBeenCalledWith('email', 'test@example.com');
    expect(mockOnUpdateField).toHaveBeenCalledWith('username', 'testuser');
    expect(mockOnUpdateField).toHaveBeenCalledWith('password', 'password123');
  });

  it('renders labels with correct text', () => {
    render(<JoinForm {...defaultProps} />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<JoinForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const usernameInput = screen.getByPlaceholderText('Choose a username');
    const passwordInput = screen.getByPlaceholderText('Create a password');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('placeholder', 'your@email.com');
    expect(usernameInput).toHaveAttribute('placeholder', 'Choose a username');
    expect(passwordInput).toHaveAttribute('placeholder', 'Create a password');
  });
});
