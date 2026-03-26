import { render, screen, fireEvent } from '@testing-library/react';
import { BoardSidebarBackdrop } from '../BoardSidebarBackdrop';

describe('BoardSidebarBackdrop Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    const { container } = render(<BoardSidebarBackdrop isOpen={true} onClose={mockOnClose} />);

    const backdrop = container.querySelector('.fixed.inset-0.z-40.bg-black\\/50.lg\\:hidden');
    expect(backdrop).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(<BoardSidebarBackdrop isOpen={false} onClose={mockOnClose} />);

    const backdrop = container.querySelector('.fixed.inset-0.z-40.bg-black\\/50.lg\\:hidden');
    expect(backdrop).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  it('calls onClose when clicked', () => {
    const { container } = render(<BoardSidebarBackdrop isOpen={true} onClose={mockOnClose} />);

    const backdrop = container.querySelector('.fixed.inset-0.z-40.bg-black\\/50.lg\\:hidden');
    fireEvent.click(backdrop!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes when open', () => {
    const { container } = render(<BoardSidebarBackdrop isOpen={true} onClose={mockOnClose} />);

    const backdrop = container.querySelector('div');
    expect(backdrop).toHaveClass('fixed', 'inset-0', 'z-40', 'bg-black/50', 'lg:hidden');
  });

  it('renders as clickable element', () => {
    const { container } = render(<BoardSidebarBackdrop isOpen={true} onClose={mockOnClose} />);

    const backdrop = container.querySelector('.fixed.inset-0.z-40.bg-black\\/50.lg\\:hidden');
    expect(backdrop).toBeInTheDocument();
  });

  it('handles multiple clicks correctly', () => {
    const { container } = render(<BoardSidebarBackdrop isOpen={true} onClose={mockOnClose} />);

    const backdrop = container.querySelector('.fixed.inset-0.z-40.bg-black\\/50.lg\\:hidden');

    fireEvent.click(backdrop!);
    fireEvent.click(backdrop!);
    fireEvent.click(backdrop!);

    expect(mockOnClose).toHaveBeenCalledTimes(3);
  });

  it('renders with different onClose functions', () => {
    const customOnClose = jest.fn();
    const { container } = render(<BoardSidebarBackdrop isOpen={true} onClose={customOnClose} />);

    const backdrop = container.querySelector('.fixed.inset-0.z-40.bg-black\\/50.lg\\:hidden');
    fireEvent.click(backdrop!);

    expect(customOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when not rendered', () => {
    render(<BoardSidebarBackdrop isOpen={false} onClose={mockOnClose} />);

    // No element to click, so onClose should not be called
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('has correct positioning and styling', () => {
    const { container } = render(<BoardSidebarBackdrop isOpen={true} onClose={mockOnClose} />);

    const backdrop = container.querySelector('div');
    expect(backdrop).toHaveClass('fixed', 'inset-0', 'z-40', 'bg-black/50', 'lg:hidden');
  });

  it('is hidden on large screens', () => {
    const { container } = render(<BoardSidebarBackdrop isOpen={true} onClose={mockOnClose} />);

    const backdrop = container.querySelector('div');
    expect(backdrop).toHaveClass('lg:hidden');
  });
});
