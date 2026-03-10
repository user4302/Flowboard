import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button Component', () => {
  describe('basic rendering', () => {
    it('should render with default props', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-indigo-600', 'text-white')
    })

    it('should render with custom className', () => {
      render(<Button className="custom-class">Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('should render with different text content', () => {
      render(<Button>Submit Form</Button>)
      
      const button = screen.getByRole('button', { name: 'Submit Form' })
      expect(button).toBeInTheDocument()
    })

    it('should handle click events', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:pointer-events-none')
    })

    it('should not trigger click when disabled', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(<Button disabled onClick={handleClick}>Disabled Button</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('variants', () => {
    it('should render default variant', () => {
      render(<Button variant="default">Default</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-indigo-600', 'text-white', 'hover:bg-indigo-700')
    })

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-slate-100', 'text-slate-900', 'hover:bg-slate-200')
    })

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-slate-100', 'hover:text-slate-900')
    })

    it('should render outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border', 'border-slate-300', 'bg-white')
    })

    it('should render destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-600', 'text-white', 'hover:bg-red-700')
    })
  })

  describe('sizes', () => {
    it('should render small size', () => {
      render(<Button size="sm">Small</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-8', 'px-3', 'text-xs')
    })

    it('should render medium size (default)', () => {
      render(<Button size="md">Medium</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10', 'px-4', 'py-2')
    })

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-12', 'px-6', 'text-base')
    })

    it('should render icon size', () => {
      render(<Button size="icon">🔍</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10', 'w-10')
    })
  })

  describe('HTML button attributes', () => {
    it('should pass through standard button attributes', () => {
      render(
        <Button 
          type="submit" 
          aria-label="Submit form"
          data-testid="submit-button"
        >
          Submit
        </Button>
      )
      
      const button = screen.getByTestId('submit-button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('aria-label', 'Submit form')
    })

    it('should handle focus events', async () => {
      const user = userEvent.setup()
      const handleFocus = jest.fn()
      const handleBlur = jest.fn()
      
      render(
        <Button onFocus={handleFocus} onBlur={handleBlur}>
          Focus Test
        </Button>
      )
      
      const button = screen.getByRole('button')
      
      await user.click(button)
      await user.tab() // Move focus away
      
      expect(handleFocus).toHaveBeenCalledTimes(1)
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('should have proper focus styles', () => {
      render(<Button>Focus Test</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-indigo-500',
        'focus-visible:ring-offset-2'
      )
    })
  })

  describe('accessibility', () => {
    it('should be accessible via keyboard', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(<Button onClick={handleClick}>Accessible</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
      
      handleClick.mockClear()
      
      await user.keyboard('{ }') // Space key
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should support ARIA attributes', () => {
      render(
        <Button 
          aria-describedby="button-description"
          aria-expanded="false"
        >
          Toggle
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'button-description')
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('should have proper button role', () => {
      render(<Button>Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle empty children', () => {
      render(<Button></Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('')
    })

    it('should handle complex children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('IconText')
    })

    it('should handle long text content', () => {
      const longText = 'This is a very long button text that should wrap properly'
      render(<Button>{longText}</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent(longText)
    })

    it('should handle multiple rapid clicks', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      
      await user.click(button)
      await user.click(button)
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(3)
    })
  })

  describe('component behavior', () => {
    it('should have active scale effect', () => {
      render(<Button>Active</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('active:scale-[0.98]')
    })

    it('should have transition classes', () => {
      render(<Button>Transition</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('transition-all', 'duration-200')
    })

    it('should have proper base classes', () => {
      render(<Button>Base</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded-xl',
        'text-sm',
        'font-medium'
      )
    })
  })
})
