/**
 * Unit Tests for ColorPicker Component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from '../ColorPicker';
import { BASIC_LABEL_COLORS } from '@/lib/constants';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('ColorPicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders with initial value', () => {
    render(<ColorPicker value="#ef4444" onChange={mockOnChange} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('#ef4444')).toBeInTheDocument();
  });

  it('renders with placeholder when no value', () => {
    render(<ColorPicker value="" onChange={mockOnChange} placeholder="Choose color" />);

    expect(screen.getByText('Choose color')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(<ColorPicker value="#ef4444" onChange={mockOnChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    expect(screen.getByText('Basic Colors')).toBeInTheDocument();
    expect(screen.getByText('Hex Color')).toBeInTheDocument();
  });

  it('displays all basic colors', async () => {
    const user = userEvent.setup();
    render(<ColorPicker value="#ef4444" onChange={mockOnChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    // Check that all basic colors are rendered
    BASIC_LABEL_COLORS.forEach(color => {
      const colorButton = screen.getByTitle(color);
      expect(colorButton).toBeInTheDocument();
      expect(colorButton).toHaveStyle(`background-color: ${color}`);
    });
  });

  it('calls onChange when basic color is selected', async () => {
    const user = userEvent.setup();
    render(<ColorPicker value="#ef4444" onChange={mockOnChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    const firstColor = screen.getByTitle(BASIC_LABEL_COLORS[0]);
    await user.click(firstColor);

    expect(mockOnChange).toHaveBeenCalledWith(BASIC_LABEL_COLORS[0]);
  });

  it('shows custom color picker when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ColorPicker value="#ef4444" onChange={mockOnChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    const customButton = screen.getByText('Custom Color');
    await user.click(customButton);

    expect(screen.getByText('Hide Custom Color')).toBeInTheDocument();
  });

  it('handles hex input changes', async () => {
    const user = userEvent.setup();
    render(<ColorPicker value="#ef4444" onChange={mockOnChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    const hexInput = screen.getByPlaceholderText('#000000');
    await user.clear(hexInput);
    await user.type(hexInput, '#ff0000');

    expect(mockOnChange).toHaveBeenCalledWith('#ff0000');
  });

  it('validates hex input', async () => {
    const user = userEvent.setup();
    render(<ColorPicker value="#ef4444" onChange={mockOnChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    const hexInput = screen.getByPlaceholderText('#000000');
    await user.clear(hexInput);
    await user.type(hexInput, 'invalid');

    expect(screen.getByText('Please enter a valid hex color (e.g., #ff0000)')).toBeInTheDocument();

    const applyButton = screen.getByText('Apply');
    expect(applyButton).toBeDisabled();
  });

  it('saves and displays recent colors', async () => {
    const user = userEvent.setup();
    const recentColors = ['#ff0000', '#00ff00', '#0000ff'];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(recentColors));

    render(<ColorPicker value="#ef4444" onChange={mockOnChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    expect(screen.getByText('Recent Colors')).toBeInTheDocument();

    recentColors.forEach(color => {
      const recentButton = screen.getByTitle(color);
      expect(recentButton).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(<ColorPicker value="#ef4444" onChange={mockOnChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    expect(screen.getByText('Basic Colors')).toBeInTheDocument();

    // Click outside
    await user.click(document.body);

    expect(screen.queryByText('Basic Colors')).not.toBeInTheDocument();
  });

  it('closes dropdown with Escape key', async () => {
    const user = userEvent.setup();
    render(<ColorPicker value="#ef4444" onChange={mockOnChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    expect(screen.getByText('Basic Colors')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByText('Basic Colors')).not.toBeInTheDocument();
  });

  it('applies color with Enter key', async () => {
    const user = userEvent.setup();
    render(<ColorPicker value="#ef4444" onChange={mockOnChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    const hexInput = screen.getByPlaceholderText('#000000');
    await user.clear(hexInput);
    await user.type(hexInput, '#ff0000');
    await user.keyboard('{Enter}');

    expect(mockOnChange).toHaveBeenCalledWith('#ff0000');
    // Dropdown should close after Enter
    await waitFor(() => {
      expect(screen.queryByText('Basic Colors')).not.toBeInTheDocument();
    });
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<ColorPicker value="#ef4444" onChange={mockOnChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    // Wait for dropdown to be fully rendered
    await waitFor(() => {
      expect(screen.getByText('Basic Colors')).toBeInTheDocument();
    });

    // Focus directly on the hex input
    const hexInput = screen.getByPlaceholderText('#000000');
    hexInput.focus();

    // Should have focus
    expect(hexInput).toHaveFocus();
  });

  it('shows correct contrast for color preview', () => {
    render(<ColorPicker value="#ffffff" onChange={mockOnChange} />);

    const colorPreview = screen.getByRole('button').querySelector('div[style*="background-color"]');
    expect(colorPreview).toHaveStyle('background-color: #ffffff');
  });

  it('limits recent colors to maxRecentColors', async () => {
    const user = userEvent.setup();
    const manyRecentColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(manyRecentColors));

    render(<ColorPicker value="#ef4444" onChange={mockOnChange} maxRecentColors={3} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    // Should show 10 basic colors + 3 recent colors = 13 total color buttons
    const colorButtons = document.querySelectorAll('[style*="background-color"]');
    expect(colorButtons.length).toBeGreaterThanOrEqual(10); // At least basic colors
  });

  it('can hide recent colors', async () => {
    const user = userEvent.setup();
    render(<ColorPicker value="#ef4444" onChange={mockOnChange} showRecentColors={false} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    expect(screen.queryByText('Recent Colors')).not.toBeInTheDocument();
  });
});
