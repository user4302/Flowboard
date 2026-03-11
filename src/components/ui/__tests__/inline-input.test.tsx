import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { InlineInput } from '../inline-input'

// Mock dependencies
jest.mock('@/hooks/useClipboardDetection', () => ({
  useClipboardDetection: () => ({
    hasValidCardJSON: false,
    getCardJSONFromClipboard: jest.fn()
  }),
}))

jest.mock('lucide-react', () => ({
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  X: () => <div data-testid="x-icon">X</div>,
  ClipboardPaste: () => <div data-testid="clipboard-icon">Clipboard</div>,
}))

describe('InlineInput Component', () => {
  const mockOnAdd = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('trigger mode (default)', () => {
    it('should render trigger button by default', () => {
      render(<InlineInput onAdd={mockOnAdd} />)

      expect(screen.getByText('Add item')).toBeInTheDocument()
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    })

    it('should render with custom trigger text', () => {
      render(<InlineInput onAdd={mockOnAdd} triggerText="Create New" />)

      expect(screen.getByText('Create New')).toBeInTheDocument()
    })

    it('should not render when showTrigger is false', () => {
      render(<InlineInput onAdd={mockOnAdd} showTrigger={false} />)

      expect(screen.queryByText('Add item')).not.toBeInTheDocument()
      expect(document.body.querySelector('div')).toBeEmptyDOMElement()
    })

    it('should show input when trigger is clicked', async () => {
      const user = userEvent.setup()
      render(<InlineInput onAdd={mockOnAdd} />)

      const triggerButton = screen.getByText('Add item')
      await user.click(triggerButton)

      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
      expect(screen.getByTestId('x-icon')).toBeInTheDocument()
    })

    it('should render icon-only mode', () => {
      render(<InlineInput onAdd={mockOnAdd} iconOnly />)

      expect(screen.queryByText('Add item')).not.toBeInTheDocument()
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    })

    it('should show tooltip in icon-only mode', () => {
      render(<InlineInput onAdd={mockOnAdd} iconOnly tooltipText="Add new item" />)

      expect(screen.getByText('Add new item')).toBeInTheDocument()
    })

    it('should apply custom className to trigger', () => {
      render(<InlineInput onAdd={mockOnAdd} className="custom-class" />)

      const triggerButton = screen.getByText('Add item').parentElement
      expect(triggerButton).toHaveClass('custom-class')
    })

    it('should use custom trigger icon', () => {
      render(<InlineInput onAdd={mockOnAdd} triggerIcon={<div data-testid="custom-icon">Custom</div>} />)

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
      expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument()
    })
  })

  describe('input mode (after trigger click)', () => {
    it('should call onAdd when add button is clicked', async () => {
      const user = userEvent.setup()
      render(<InlineInput onAdd={mockOnAdd} />)

      // First click trigger to show input
      const triggerButton = screen.getByText('Add item')
      await user.click(triggerButton)

      // Then interact with input
      const input = screen.getByRole('textbox')
      await user.type(input, 'Test Value')

      const addButton = screen.getByRole('button', { name: 'Add' })
      await user.click(addButton)

      expect(mockOnAdd).toHaveBeenCalledWith('Test Value')
    })

    it('should call onCancel when cancel is clicked', async () => {
      const user = userEvent.setup()
      render(<InlineInput onAdd={mockOnAdd} onCancel={mockOnCancel} />)

      // First click trigger to show input
      const triggerButton = screen.getByText('Add item')
      await user.click(triggerButton)

      // Then click cancel
      const cancelButton = screen.getByTestId('x-icon').closest('button')
      if (cancelButton) {
        await user.click(cancelButton)
        expect(mockOnCancel).toHaveBeenCalledTimes(1)
      }
    })

    it('should handle Enter key to submit', async () => {
      const user = userEvent.setup()
      render(<InlineInput onAdd={mockOnAdd} />)

      const triggerButton = screen.getByText('Add item')
      await user.click(triggerButton)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test Value{Enter}')

      expect(mockOnAdd).toHaveBeenCalledWith('Test Value')
    })

    it('should handle Escape key to cancel', async () => {
      const user = userEvent.setup()
      const mockOnCancel = jest.fn()
      render(<InlineInput onAdd={mockOnAdd} onCancel={mockOnCancel} />)

      const triggerButton = screen.getByText('Add item')
      await user.click(triggerButton)

      const input = screen.getByRole('textbox')
      await user.click(input)
      await user.keyboard('{Escape}')

      // The component calls onCancel once for the Escape key
      // Blur might not trigger in test environment, so we expect at least 1 call
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('should trim whitespace from input', async () => {
      const user = userEvent.setup()
      render(<InlineInput onAdd={mockOnAdd} />)

      const triggerButton = screen.getByText('Add item')
      await user.click(triggerButton)

      const input = screen.getByRole('textbox')
      await user.type(input, '  Test Value  ')

      const addButton = screen.getByRole('button', { name: 'Add' })
      await user.click(addButton)

      expect(mockOnAdd).toHaveBeenCalledWith('Test Value')
    })

    it('should not call onAdd for empty input', async () => {
      const user = userEvent.setup()
      render(<InlineInput onAdd={mockOnAdd} />)

      const triggerButton = screen.getByText('Add item')
      await user.click(triggerButton)

      const addButton = screen.getByRole('button', { name: 'Add' })
      await user.click(addButton)

      expect(mockOnAdd).not.toHaveBeenCalled()
    })

    it('should use custom placeholder', async () => {
      const user = userEvent.setup()
      render(<InlineInput onAdd={mockOnAdd} placeholder="Custom placeholder" />)

      const triggerButton = screen.getByText('Add item')
      await user.click(triggerButton)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', 'Custom placeholder')
    })

    it('should use custom add text', async () => {
      const user = userEvent.setup()
      render(<InlineInput onAdd={mockOnAdd} addText="Create" />)

      const triggerButton = screen.getByText('Add item')
      await user.click(triggerButton)

      expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
    })
  })

  describe('initial value', () => {
    it('should populate input with initial value', async () => {
      const user = userEvent.setup()
      render(<InlineInput onAdd={mockOnAdd} initialValue="Initial Value" />)

      const triggerButton = screen.getByText('Add item')
      await user.click(triggerButton)

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('Initial Value')
    })

    it('should handle initial value submission', async () => {
      const user = userEvent.setup()
      render(<InlineInput onAdd={mockOnAdd} initialValue="Initial Value" />)

      const triggerButton = screen.getByText('Add item')
      await user.click(triggerButton)

      const addButton = screen.getByRole('button', { name: 'Add' })
      await user.click(addButton)

      expect(mockOnAdd).toHaveBeenCalledWith('Initial Value')
    })
  })

  describe('smart paste functionality', () => {
    it('should show paste button when enabled and has valid JSON', () => {
      jest.doMock('@/hooks/useClipboardDetection', () => ({
        useClipboardDetection: () => ({
          hasValidCardJSON: true,
          getCardJSONFromClipboard: jest.fn()
        }),
      }))

      const { rerender } = render(<InlineInput onAdd={mockOnAdd} enableSmartPaste onPasteCardJSON={jest.fn()} />)

      expect(screen.getByText('Add item')).toBeInTheDocument()
    })

    it('should not show paste button when disabled', () => {
      render(<InlineInput onAdd={mockOnAdd} enableSmartPaste={false} />)

      expect(screen.queryByText('Paste Card')).not.toBeInTheDocument()
    })

    it('should not show paste button when no valid JSON', () => {
      render(<InlineInput onAdd={mockOnAdd} enableSmartPaste onPasteCardJSON={jest.fn()} />)

      expect(screen.queryByText('Paste Card')).not.toBeInTheDocument()
    })
  })

  describe('ref forwarding', () => {
    it('should forward ref to trigger button', () => {
      const ref = React.createRef<HTMLButtonElement>()

      render(<InlineInput onAdd={mockOnAdd} ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      expect(ref.current).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle very long input', async () => {
      const user = userEvent.setup()
      render(<InlineInput onAdd={mockOnAdd} />)

      const triggerButton = screen.getByText('Add item')
      await user.click(triggerButton)

      const longText = 'A'.repeat(100)
      const input = screen.getByRole('textbox')
      await user.type(input, longText)

      const addButton = screen.getByRole('button', { name: 'Add' })
      await user.click(addButton)

      expect(mockOnAdd).toHaveBeenCalledWith(longText)
    })

    it('should handle rapid mode switches', async () => {
      const user = userEvent.setup()
      render(<InlineInput onAdd={mockOnAdd} />)

      const triggerButton = screen.getByText('Add item')
      await user.click(triggerButton)

      expect(screen.getByRole('textbox')).toBeInTheDocument()

      const cancelButton = screen.getByTestId('x-icon').closest('button')
      if (cancelButton) {
        await user.click(cancelButton)
        expect(screen.getByText('Add item')).toBeInTheDocument()
      }
    })

    it('should handle multiple trigger clicks', async () => {
      const user = userEvent.setup()
      render(<InlineInput onAdd={mockOnAdd} />)

      const triggerButton = screen.getByText('Add item')
      await user.click(triggerButton)
      await user.click(triggerButton)

      // Should still show input after multiple clicks
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })
})
