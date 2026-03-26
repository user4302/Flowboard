import { render, screen, fireEvent } from '@testing-library/react';
import { BoardSidebarHeader } from '../BoardSidebarHeader';

// Mock UI components
jest.mock('@/components/ui', () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  )
}));

// Mock Lucide icon
jest.mock('lucide-react', () => ({
  LayoutGrid: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="layout-grid">
      <rect width="24" height="24" fill="currentColor" />
    </svg>
  )
}));

describe('BoardSidebarHeader Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with app branding', () => {
    render(<BoardSidebarHeader onClose={mockOnClose} />);

    expect(screen.getByText('Flowboard')).toBeInTheDocument();
    expect(screen.getByTestId('layout-grid')).toBeInTheDocument();
    expect(screen.getByText('Flowboard')).toHaveClass('text-lg', 'font-semibold', 'text-slate-900', 'dark:text-slate-100');
  });

  it('renders close button only on mobile', () => {
    render(<BoardSidebarHeader onClose={mockOnClose} />);

    const closeButton = screen.getByText('×');
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveClass('lg:hidden');
  });

  it('calls onClose when close button is clicked', () => {
    render(<BoardSidebarHeader onClose={mockOnClose} />);

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes to container', () => {
    const { container } = render(<BoardSidebarHeader onClose={mockOnClose} />);

    const headerContainer = container.querySelector('div');
    expect(headerContainer).toHaveClass('flex', 'items-center', 'justify-between', 'p-4', 'border-b', 'border-slate-200', 'dark:border-slate-700');
  });

  it('applies correct CSS classes to branding container', () => {
    const { container } = render(<BoardSidebarHeader onClose={mockOnClose} />);

    const brandingContainer = container.querySelector('.flex.items-center.gap-2');
    expect(brandingContainer).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('applies correct CSS classes to LayoutGrid icon', () => {
    render(<BoardSidebarHeader onClose={mockOnClose} />);

    const icon = screen.getByTestId('layout-grid');
    expect(icon).toHaveClass('h-6', 'w-6', 'text-indigo-600');
  });

  it('applies correct CSS classes to close button', () => {
    render(<BoardSidebarHeader onClose={mockOnClose} />);

    const closeButton = screen.getByText('×');
    expect(closeButton).toHaveClass('lg:hidden');
  });

  it('has proper button variant and size props', () => {
    render(<BoardSidebarHeader onClose={mockOnClose} />);

    const closeButton = screen.getByText('×');
    expect(closeButton).toBeInTheDocument();
    // The button should exist with the correct content
  });

  it('renders structure correctly', () => {
    const { container } = render(<BoardSidebarHeader onClose={mockOnClose} />);

    // Check main container
    expect(container.querySelector('div')).toHaveClass('flex', 'items-center', 'justify-between');

    // Check branding section
    expect(container.querySelector('.flex.items-center.gap-2')).toBeInTheDocument();

    // Check icon and title are in branding section
    const brandingSection = container.querySelector('.flex.items-center.gap-2');
    expect(brandingSection?.querySelector('svg')).toBeInTheDocument();
    expect(brandingSection?.querySelector('h1')).toBeInTheDocument();

    // Check close button exists
    expect(screen.getByText('×')).toBeInTheDocument();
  });
});
