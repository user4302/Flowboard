import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Input } from '../input'

describe('Input Component', () => {
  describe('basic rendering', () => {
    it('should render with default props', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('flex', 'h-10', 'w-full')
    })

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text here" />)
      
      const input = screen.getByPlaceholderText('Enter text here')
      expect(input).toBeInTheDocument()
    })

    it('should render with default value', () => {
      render(<Input defaultValue="Default value" />)
      
      const input = screen.getByDisplayValue('Default value')
      expect(input).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      render(<Input className="custom-class" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-class')
    })

    it('should render with different input types', () => {
      const { rerender } = render(<Input type="email" />)
      
      let input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')

      rerender(<Input type="password" />)
      input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('type', 'password')

      rerender(<Input type="number" />)
      input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('type', 'number')
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
    })

    it('should be readonly when readonly prop is true', () => {
      render(<Input readOnly value="Readonly value" />)
      
      const input = screen.getByDisplayValue('Readonly value')
      expect(input).toHaveAttribute('readonly')
    })
  })

  describe('user interactions', () => {
    it('should handle user input', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      
      render(<Input onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello World')
      
      expect(input).toHaveValue('Hello World')
      expect(handleChange).toHaveBeenCalledTimes(11) // Once for each character
    })

    it('should handle focus events', async () => {
      const user = userEvent.setup()
      const handleFocus = jest.fn()
      const handleBlur = jest.fn()
      
      render(<Input onFocus={handleFocus} onBlur={handleBlur} />)
      
      const input = screen.getByRole('textbox')
      
      await user.click(input)
      expect(handleFocus).toHaveBeenCalledTimes(1)
      
      await user.tab() // Move focus away
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('should handle paste events', async () => {
      const user = userEvent.setup()
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      
      await user.click(input)
      await user.paste('Pasted text')
      
      expect(input).toHaveValue('Pasted text')
    })

    it('should handle clear functionality', async () => {
      const user = userEvent.setup()
      render(<Input defaultValue="Initial value" />)
      
      const input = screen.getByRole('textbox')
      
      await user.click(input)
      await user.clear(input)
      
      expect(input).toHaveValue('')
    })
  })

  describe('input attributes', () => {
    it('should pass through standard HTML attributes', () => {
      render(
        <Input
          name="test-input"
          id="input-id"
          maxLength={50}
          autoComplete="email"
          required
        />
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('name', 'test-input')
      expect(input).toHaveAttribute('id', 'input-id')
      expect(input).toHaveAttribute('maxLength', '50')
      expect(input).toHaveAttribute('autoComplete', 'email')
      expect(input).toBeRequired()
    })

    it('should handle min and max for number inputs', () => {
      render(<Input type="number" min="0" max="100" />)
      
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('min', '0')
      expect(input).toHaveAttribute('max', '100')
    })

    it('should handle step for number inputs', () => {
      render(<Input type="number" step="0.1" />)
      
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('step', '0.1')
    })

    it('should handle pattern attribute', () => {
      render(<Input pattern="[0-9]*" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('pattern', '[0-9]*')
    })
  })

  describe('styling classes', () => {
    it('should have proper base classes', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass(
        'flex',
        'h-10',
        'w-full',
        'rounded-xl',
        'border',
        'border-slate-300',
        'bg-white',
        'px-3',
        'py-2',
        'text-sm'
      )
    })

    it('should have proper focus styles', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-indigo-500',
        'focus-visible:ring-offset-2'
      )
    })

    it('should have proper placeholder styles', () => {
      render(<Input placeholder="Placeholder text" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('placeholder:text-slate-500')
    })

    it('should have proper file input styles', () => {
      render(<Input type="file" />)
      
      const input = screen.getByDisplayValue('') // File inputs don't have text content
      expect(input).toHaveAttribute('type', 'file')
      expect(input).toHaveClass(
        'file:border-0',
        'file:bg-transparent',
        'file:text-sm',
        'file:font-medium'
      )
    })
  })

  describe('accessibility', () => {
    it('should support ARIA attributes', () => {
      render(
        <Input
          aria-label="Email input"
          aria-describedby="email-description"
          aria-invalid="false"
        />
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-label', 'Email input')
      expect(input).toHaveAttribute('aria-describedby', 'email-description')
      expect(input).toHaveAttribute('aria-invalid', 'false')
    })

    it('should support aria-invalid for validation states', () => {
      render(<Input aria-invalid="true" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('should support aria-required', () => {
      render(<Input required aria-required="true" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-required', 'true')
    })

    it('should be accessible via keyboard', async () => {
      const user = userEvent.setup()
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      
      await user.tab()
      expect(input).toHaveFocus()
      
      await user.keyboard('Hello')
      expect(input).toHaveValue('Hello')
    })
  })

  describe('edge cases', () => {
    it('should handle empty value', () => {
      render(<Input value="" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('')
    })

    it('should handle long text input', async () => {
      const user = userEvent.setup()
      const longText = 'This is a very long text that exceeds normal input length'
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, longText)
      
      expect(input).toHaveValue(longText)
    })

    it('should handle special characters', async () => {
      const user = userEvent.setup()
      const specialChars = '!@#$%^&*()_+-=;:,.<>?'
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, specialChars)
      
      expect(input).toHaveValue(specialChars)
    })

    it('should handle controlled component pattern', async () => {
      const user = userEvent.setup()
      const TestComponent = () => {
        const [value, setValue] = React.useState('')
        return (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )
      }
      
      render(<TestComponent />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'Controlled')
      
      expect(input).toHaveValue('Controlled')
    })

    it('should handle ref forwarding', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<Input ref={ref} />)
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
      expect(ref.current).toBeInTheDocument()
    })
  })

  describe('form integration', () => {
    it('should work within form context', async () => {
      const user = userEvent.setup()
      const handleSubmit = jest.fn((e) => e.preventDefault())
      
      render(
        <form onSubmit={handleSubmit}>
          <Input name="test-field" defaultValue="Test value" />
          <button type="submit">Submit</button>
        </form>
      )
      
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)
      
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })

    it('should support form validation attributes', () => {
      render(
        <Input
          required
          minLength={5}
          maxLength={20}
          pattern="[a-zA-Z]+"
        />
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toBeRequired()
      expect(input).toHaveAttribute('minLength', '5')
      expect(input).toHaveAttribute('maxLength', '20')
      expect(input).toHaveAttribute('pattern', '[a-zA-Z]+')
    })
  })
})
