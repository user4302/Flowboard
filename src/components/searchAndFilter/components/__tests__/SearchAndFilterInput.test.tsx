import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { SearchAndFilterInput } from '../SearchAndFilterInput'

// Mock dependencies
jest.mock('lucide-react', () => ({
  Search: ({ className }: any) => <svg data-testid="search-icon" className={className} />,
}))

jest.mock('@/components/ui', () => ({
  Input: ({ placeholder, value, onChange, className }: any) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      data-testid="search-input-field"
    />
  ),
}))

jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}))

describe('SearchAndFilterInput Component', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('should render search input with default props', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      expect(screen.getByTestId('search-input-field')).toBeInTheDocument()
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    })

    it('should render with initial value', () => {
      render(<SearchAndFilterInput value="test search" onChange={mockOnChange} />)

      const input = screen.getByTestId('search-input-field')
      expect(input).toHaveValue('test search')
    })

    it('should render in compact mode', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} compact={true} />)

      expect(screen.getByTestId('search-input-field')).toBeInTheDocument()
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    })

    it('should render in non-compact mode by default', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      expect(screen.getByTestId('search-input-field')).toBeInTheDocument()
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    })
  })

  describe('input behavior', () => {
    it('should call onChange when input value changes', async () => {
      const user = userEvent.setup()

      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      const input = screen.getByTestId('search-input-field')
      await user.type(input, 'a')

      expect(mockOnChange).toHaveBeenCalledWith('a')
    })

    it('should call onChange when input is cleared', async () => {
      const user = userEvent.setup()

      render(<SearchAndFilterInput value="a" onChange={mockOnChange} />)

      const input = screen.getByTestId('search-input-field')
      await user.clear(input)

      expect(mockOnChange).toHaveBeenCalledWith('')
    })

    it('should handle rapid input changes', async () => {
      const user = userEvent.setup()

      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      const input = screen.getByTestId('search-input-field')
      await user.type(input, 'abc')

      expect(mockOnChange).toHaveBeenCalled()
      expect(mockOnChange).toHaveBeenCalledTimes(3)
    })
  })

  describe('placeholder text', () => {
    it('should show compact placeholder in compact mode', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} compact={true} />)

      const input = screen.getByTestId('search-input-field')
      expect(input).toHaveAttribute('placeholder', 'Search cards...')
    })

    it('should show full placeholder in non-compact mode', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} compact={false} />)

      const input = screen.getByTestId('search-input-field')
      expect(input).toHaveAttribute('placeholder', 'Search cards by title, description, labels...')
    })

    it('should show full placeholder by default', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      const input = screen.getByTestId('search-input-field')
      expect(input).toHaveAttribute('placeholder', 'Search cards by title, description, labels...')
    })
  })

  describe('styling and classes', () => {
    it('should apply correct container classes', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      const container = screen.getByTestId('search-input-field').parentElement
      expect(container).toHaveClass('relative', 'flex-1', 'group')
    })

    it('should apply compact container classes', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} compact={true} />)

      const container = screen.getByTestId('search-input-field').parentElement
      expect(container).toHaveClass('relative', 'flex-1', 'group', 'max-w-[200px]', 'lg:max-w-xs')
    })

    it('should apply correct input classes', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      const input = screen.getByTestId('search-input-field')
      expect(input).toHaveClass('pl-10', 'h-10', 'bg-slate-800/50', 'border-transparent', 'text-slate-200', 'placeholder-slate-500', 'rounded-xl')
    })

    it('should apply compact input classes', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} compact={true} />)

      const input = screen.getByTestId('search-input-field')
      expect(input).toHaveClass('pl-10', 'h-9', 'text-sm')
    })
  })

  describe('search icon', () => {
    it('should render search icon with correct classes', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      const icon = screen.getByTestId('search-icon')
      expect(icon).toHaveClass('absolute', 'left-3', 'top-1/2', 'h-4', 'w-4', '-translate-y-1/2', 'text-slate-500', 'group-focus-within:text-blue-400', 'transition-colors')
    })

    it('should position icon correctly inside input', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      const icon = screen.getByTestId('search-icon')
      const input = screen.getByTestId('search-input-field')

      // Icon should be before input in DOM order
      expect(icon).toBeInTheDocument()
      expect(input).toBeInTheDocument()
    })
  })

  describe('component structure', () => {
    it('should have correct DOM structure', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      const container = screen.getByTestId('search-input-field').parentElement
      expect(container).toBeInTheDocument()
      expect(container?.querySelector('[data-testid="search-icon"]')).toBeInTheDocument()
      expect(container?.querySelector('[data-testid="search-input-field"]')).toBeInTheDocument()
    })

    it('should maintain accessibility structure', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      const input = screen.getByTestId('search-input-field')
      expect(input).toHaveAttribute('placeholder')
    })
  })

  describe('edge cases', () => {
    it('should handle empty value', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      const input = screen.getByTestId('search-input-field')
      expect(input).toHaveValue('')
    })

    it('should handle long search terms', () => {
      const longSearchTerm = 'this is a very long search term that might be used in the application'
      render(<SearchAndFilterInput value={longSearchTerm} onChange={mockOnChange} />)

      const input = screen.getByTestId('search-input-field')
      expect(input).toHaveValue(longSearchTerm)
    })

    it('should handle special characters', () => {
      const specialChars = 'search@#$%^&*()_+-={}[]|\\:";\'<>?,./'
      render(<SearchAndFilterInput value={specialChars} onChange={mockOnChange} />)

      const input = screen.getByTestId('search-input-field')
      expect(input).toHaveValue(specialChars)
    })

    it('should render without crashing', () => {
      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      expect(screen.getByTestId('search-input-field')).toBeInTheDocument()
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    })

    it('should handle undefined onChange gracefully', () => {
      render(<SearchAndFilterInput value="" onChange={jest.fn()} />)

      expect(screen.getByTestId('search-input-field')).toBeInTheDocument()
    })
  })

  describe('user interactions', () => {
    it('should handle focus events', async () => {
      const user = userEvent.setup()

      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      const input = screen.getByTestId('search-input-field')
      await user.click(input)

      expect(input).toHaveFocus()
    })

    it('should handle blur events', async () => {
      const user = userEvent.setup()

      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      const input = screen.getByTestId('search-input-field')
      await user.click(input)
      await user.tab() // Move focus away

      expect(input).not.toHaveFocus()
    })

    it('should handle keyboard input', async () => {
      const user = userEvent.setup()

      render(<SearchAndFilterInput value="" onChange={mockOnChange} />)

      const input = screen.getByTestId('search-input-field')
      await user.click(input)
      await user.keyboard('x')

      expect(mockOnChange).toHaveBeenCalledWith('x')
    })
  })
})
