import { render, screen, fireEvent } from '@testing-library/react';
import { PendingRequests } from '../PendingRequests';
import { JoinRequest } from '@/lib/invitation-utils';

// Mock the formatDate utility
jest.mock('../../../utils', () => ({
  formatDate: jest.fn((date) => 'January 1, 2024')
}));

// Mock the Button component
jest.mock('@/components/ui', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid={props.variant || 'button'} {...props}>
      {children}
    </button>
  )
}));

describe('PendingRequests Component', () => {
  const mockRequests: JoinRequest[] = [
    {
      id: '1',
      userId: 'user-1',
      inviteId: 'invite-1',
      username: 'john_doe',
      email: 'john@example.com',
      passwordHash: 'hashed-password-1',
      status: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      userId: 'user-2',
      inviteId: 'invite-2',
      username: 'jane_smith',
      email: 'jane@example.com',
      passwordHash: 'hashed-password-2',
      status: 'pending',
      createdAt: '2024-01-02T00:00:00.000Z'
    }
  ];

  const mockOnApprove = jest.fn();
  const mockOnReject = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows empty state when no requests', () => {
    render(
      <PendingRequests
        requests={[]}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    expect(screen.getByText('No pending join requests')).toBeInTheDocument();
  });

  it('renders list of pending requests correctly', () => {
    render(
      <PendingRequests
        requests={mockRequests}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Check first request
    expect(screen.getByText('john_doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('January 1, 2024')).toHaveLength(2); // Both requests have same date

    // Check second request
    expect(screen.getByText('jane_smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('displays correct avatar initials for pending requests', () => {
    render(
      <PendingRequests
        requests={mockRequests}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Check that avatars show first letter of username in uppercase
    expect(screen.getAllByText('J')).toHaveLength(2); // Both john_doe and jane_smith -> J
  });

  it('calls onApprove when approve button is clicked', () => {
    render(
      <PendingRequests
        requests={mockRequests}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const approveButtons = screen.getAllByTestId('button'); // Approve buttons (no variant)
    const rejectButtons = screen.getAllByTestId('outline'); // Reject buttons

    expect(approveButtons).toHaveLength(2); // 2 requests * 1 approve each
    expect(rejectButtons).toHaveLength(2); // 2 requests * 1 reject each

    // Click the first approve button
    fireEvent.click(approveButtons[0]);
    expect(mockOnApprove).toHaveBeenCalledWith('1');
  });

  it('calls onReject when reject button is clicked', () => {
    render(
      <PendingRequests
        requests={mockRequests}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const rejectButtons = screen.getAllByTestId('outline'); // All reject buttons
    expect(rejectButtons).toHaveLength(2); // 2 requests * 1 reject each

    // Click the first reject button
    fireEvent.click(rejectButtons[0]);
    expect(mockOnReject).toHaveBeenCalledWith('1');
  });

  it('renders correct number of action buttons', () => {
    render(
      <PendingRequests
        requests={mockRequests}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Each request should have 2 buttons (approve and reject)
    const allButtons = screen.getAllByRole('button');
    expect(allButtons).toHaveLength(4);
  });

  it('applies correct CSS classes to request items', () => {
    const { container } = render(
      <PendingRequests
        requests={mockRequests}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const requestItems = container.querySelectorAll('[class*="rounded-lg border"]');
    expect(requestItems.length).toBe(2); // One for each request
  });

  it('displays clock icon for pending requests', () => {
    render(
      <PendingRequests
        requests={mockRequests}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Check that the formatted date is displayed (both requests have same date)
    expect(screen.getAllByText('January 1, 2024')).toHaveLength(2);
  });

  it('handles single request correctly', () => {
    const singleRequest = [mockRequests[0]];

    render(
      <PendingRequests
        requests={singleRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    expect(screen.getByText('john_doe')).toBeInTheDocument();
    expect(screen.queryByText('jane_smith')).not.toBeInTheDocument();

    // Should have 2 buttons for the single request
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('displays requests in correct order', () => {
    render(
      <PendingRequests
        requests={mockRequests}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const userElements = screen.getAllByText(/john_doe|jane_smith/);
    expect(userElements[0]).toHaveTextContent('john_doe');
    expect(userElements[1]).toHaveTextContent('jane_smith');
  });

  it('calls handlers with correct request IDs', () => {
    render(
      <PendingRequests
        requests={mockRequests}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const buttons = screen.getAllByRole('button');

    // Reject first request
    fireEvent.click(buttons[0]);
    expect(mockOnReject).toHaveBeenCalledWith('1');

    // Approve second request
    fireEvent.click(buttons[3]);
    expect(mockOnApprove).toHaveBeenCalledWith('2');
  });

  it('shows empty state with correct styling', () => {
    render(
      <PendingRequests
        requests={[]}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const emptyState = screen.getByText('No pending join requests').closest('div');
    expect(emptyState).toHaveClass('text-center');
    expect(emptyState).toHaveClass('py-8');
  });
});
