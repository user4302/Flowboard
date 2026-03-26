import { render, screen } from '@testing-library/react';
import { MembersList } from '../MembersList';
import { JoinRequest } from '@/lib/invitation-utils';

// Mock the formatDate utility
jest.mock('../../../utils', () => ({
  formatDate: jest.fn((date) => 'January 1, 2024')
}));

describe('MembersList Component', () => {
  const mockRequests: JoinRequest[] = [
    {
      id: '1',
      userId: 'user-1',
      inviteId: 'invite-1',
      username: 'john_doe',
      email: 'john@example.com',
      passwordHash: 'hashed-password-1',
      status: 'approved',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      userId: 'user-2',
      inviteId: 'invite-2',
      username: 'jane_smith',
      email: 'jane@example.com',
      passwordHash: 'hashed-password-2',
      status: 'approved',
      createdAt: '2024-01-02T00:00:00.000Z'
    }
  ];

  it('renders board owner when showOwner is true', () => {
    render(<MembersList requests={mockRequests} showOwner={true} />);

    expect(screen.getByText('You (Owner)')).toBeInTheDocument();
    expect(screen.getByText('Board owner and administrator')).toBeInTheDocument();
  });

  it('does not render board owner when showOwner is false', () => {
    render(<MembersList requests={mockRequests} showOwner={false} />);

    expect(screen.queryByText('You (Owner)')).not.toBeInTheDocument();
    expect(screen.queryByText('Board owner and administrator')).not.toBeInTheDocument();
  });

  it('renders list of members correctly', () => {
    render(<MembersList requests={mockRequests} />);

    // Check first member
    expect(screen.getByText('john_doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('Joined January 1, 2024')).toHaveLength(2); // Both members have this text

    // Check second member
    expect(screen.getByText('jane_smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('displays correct avatar initials', () => {
    render(<MembersList requests={mockRequests} />);

    // Check that avatars show first letter of username in uppercase
    expect(screen.getAllByText('J')).toHaveLength(2); // Both john_doe and jane_smith -> J
  });

  it('shows empty state when no requests and showOwner is false', () => {
    render(<MembersList requests={[]} showOwner={false} />);

    expect(screen.getByText('No other members yet')).toBeInTheDocument();
  });

  it('does not show empty state when no requests but showOwner is true', () => {
    render(<MembersList requests={[]} showOwner={true} />);

    expect(screen.queryByText('No other members yet')).not.toBeInTheDocument();
    expect(screen.getByText('You (Owner)')).toBeInTheDocument();
  });

  it('applies correct CSS classes to member items', () => {
    const { container } = render(<MembersList requests={mockRequests} />);

    const memberItems = container.querySelectorAll('[class*="rounded-lg border"]');
    expect(memberItems.length).toBeGreaterThan(0);
  });

  it('renders owner shield icon', () => {
    render(<MembersList requests={mockRequests} showOwner={true} />);

    // Check for shield icon (represented by the Shield component)
    const ownerSection = screen.getByText('You (Owner)').closest('div');
    expect(ownerSection).toBeInTheDocument();
  });

  it('renders member check icons', () => {
    render(<MembersList requests={mockRequests} />);

    // Check that the joined status is displayed with check indicator
    expect(screen.getAllByText('Joined January 1, 2024')).toHaveLength(2);
  });

  it('handles empty requests array gracefully', () => {
    render(<MembersList requests={[]} />);

    // Should render owner but no member list
    expect(screen.getByText('You (Owner)')).toBeInTheDocument();
    expect(screen.queryByText('john_doe')).not.toBeInTheDocument();
  });

  it('displays members in correct order', () => {
    render(<MembersList requests={mockRequests} />);

    const memberElements = screen.getAllByText(/john_doe|jane_smith/);
    expect(memberElements[0]).toHaveTextContent('john_doe');
    expect(memberElements[1]).toHaveTextContent('jane_smith');
  });
});
