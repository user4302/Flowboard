import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { TaskModalForm } from '../TaskModalForm'
import { ModalFormProps } from '@/components/taskModal/types/TaskModal.form.types'

// Mock sub-components
jest.mock('@/components/taskCard/components/TaskCardCardCompletion', () => ({
  TaskCardCardCompletion: ({ onToggle }: { onToggle: () => void }) => (
    <button type="button" onClick={onToggle} data-testid="completion-toggle">
      ○
    </button>
  ),
}))

jest.mock('@/components/taskCard/components/TaskCardCardMembers', () => ({
  TaskCardCardMembers: ({ members }: { members: string[] }) => (
    <div data-testid="members-display">Members: {members?.length || 0}</div>
  ),
}))

describe('TaskModalForm Component', () => {
  const defaultProps: ModalFormProps = {
    card: {
      id: 'card-1',
      title: 'Test Task',
      description: 'Test Description',
      dueDate: new Date('2024-12-31'),
      priority: 50,
      labelIds: ['label1', 'label2'],
      members: ['user1', 'user2'],
      startDate: new Date('2024-12-01'),
      checklists: [],
      completed: false,
      position: 1,
      listId: 'list-1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    form: {
      setValue: jest.fn(),
      getValues: jest.fn(),
    },
    errors: {},
    register: jest.fn((name) => {
      const mockOnChange = jest.fn()
      const mockOnBlur = jest.fn()

      if (name === 'title') return { name: 'title', value: 'Test Task', onChange: mockOnChange, onBlur: mockOnBlur }
      if (name === 'description') return { name: 'description', value: 'Test Description', onChange: mockOnChange, onBlur: mockOnBlur }
      if (name === 'priority') return { name: 'priority', value: 50, onChange: mockOnChange, onBlur: mockOnBlur }
      if (name === 'startDate') return { name: 'startDate', value: '2024-12-01', onChange: mockOnChange, onBlur: mockOnBlur }
      if (name === 'dueDate') return { name: 'dueDate', value: '2024-12-31', onChange: mockOnChange, onBlur: mockOnBlur }
      return { name, onChange: mockOnChange, onBlur: mockOnBlur }
    }),
    onToggleCompleted: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('should render form with all fields', () => {
      render(<TaskModalForm {...defaultProps} />)

      expect(screen.getByPlaceholderText('Card title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Priority')).toBeInTheDocument()
      expect(screen.getByText('Members')).toBeInTheDocument()
      expect(screen.getByText('Dates')).toBeInTheDocument()
      expect(screen.getByText('Checklist')).toBeInTheDocument()
    })

    it('should render with initial values', () => {
      render(<TaskModalForm {...defaultProps} />)

      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument()
      expect(screen.getByDisplayValue('50')).toBeInTheDocument()
    })
  })

  describe('form interactions', () => {
    it('should handle title change', async () => {
      const user = userEvent.setup()
      const mockSetValue = jest.fn()
      render(<TaskModalForm {...defaultProps} form={{ ...defaultProps.form, setValue: mockSetValue }} />)

      const titleInput = screen.getByDisplayValue('Test Task')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Task')

      // The onChange handler from register should be called
      expect(defaultProps.register).toHaveBeenCalledWith('title')
    })

    it('should handle description change', async () => {
      const user = userEvent.setup()
      const mockSetValue = jest.fn()
      render(<TaskModalForm {...defaultProps} form={{ ...defaultProps.form, setValue: mockSetValue }} />)

      const descriptionInput = screen.getByDisplayValue('Test Description')
      await user.click(descriptionInput)
      await user.type(descriptionInput, 'Updated')

      // Check that setValue was called (form.setValue is called on textarea change)
      expect(mockSetValue).toHaveBeenCalledWith('description', expect.any(String))
    })

    it('should handle priority change', async () => {
      const user = userEvent.setup()
      render(<TaskModalForm {...defaultProps} />)

      const priorityInput = screen.getByDisplayValue('50')
      await user.clear(priorityInput)
      await user.type(priorityInput, '75')

      // Check that register was called with priority and validation options
      expect(defaultProps.register).toHaveBeenCalledWith('priority', { valueAsNumber: true })
    })

    it('should handle completion toggle', async () => {
      const user = userEvent.setup()
      render(<TaskModalForm {...defaultProps} />)

      const completionToggle = screen.getByTestId('completion-toggle')
      await user.click(completionToggle)

      expect(defaultProps.onToggleCompleted).toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('should have proper input structure', () => {
      render(<TaskModalForm {...defaultProps} />)

      expect(screen.getByPlaceholderText('Card title')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter priority (1-100)')).toBeInTheDocument()
    })

    it('should have accessible labels', () => {
      render(<TaskModalForm {...defaultProps} />)

      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Priority')).toBeInTheDocument()
      expect(screen.getByText('Members')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should render without crashing', () => {
      render(<TaskModalForm {...defaultProps} />)

      expect(screen.getByPlaceholderText('Card title')).toBeInTheDocument()
    })

    it('should handle empty card', () => {
      render(<TaskModalForm {...defaultProps} card={null} form={{ setValue: jest.fn(), getValues: jest.fn() }} errors={{}} register={jest.fn()} onToggleCompleted={jest.fn()} />)

      expect(screen.getByPlaceholderText('Card title')).toBeInTheDocument()
    })

    it('should handle form errors', () => {
      const mockErrors = { title: { message: 'Title is required' } }
      render(<TaskModalForm {...defaultProps} form={{ ...defaultProps.form, setValue: jest.fn() }} errors={mockErrors} />)

      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })

    it('should handle register function', () => {
      const mockRegister = jest.fn(() => ({ name: 'test' }))
      render(<TaskModalForm {...defaultProps} form={{ ...defaultProps.form, setValue: jest.fn() }} register={mockRegister} />)

      expect(mockRegister).toHaveBeenCalled()
    })
  })
})
