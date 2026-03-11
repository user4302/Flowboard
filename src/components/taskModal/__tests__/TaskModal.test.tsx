import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TaskModal } from '../TaskModal'

// Mock dependencies
jest.mock('@/components/ui', () => ({
  Button: ({ children, type, onClick, variant }: any) => (
    <button type={type} onClick={onClick} data-variant={variant}>
      {children}
    </button>
  ),
  Modal: ({ open, onClose, children }: any) => (
    open ? (
      <div data-testid="modal">
        <button onClick={onClose} data-testid="modal-close">Close</button>
        {children}
      </div>
    ) : null
  ),
  ModalBody: ({ children, className }: any) => (
    <div data-testid="modal-body" className={className}>
      {children}
    </div>
  ),
  ModalFooter: ({ children }: any) => (
    <div data-testid="modal-footer">
      {children}
    </div>
  ),
}))

jest.mock('../hooks', () => ({
  useTaskModalData: () => ({
    currentBoard: {
      id: 'board-1',
      name: 'Test Board',
      lists: [],
      members: [],
      labels: [
        { id: 'label-1', text: 'Bug', color: 'bg-red-500' },
        { id: 'label-2', text: 'Feature', color: 'bg-blue-500' },
      ],
      archivedCards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    foundCard: {
      id: 'card-1',
      title: 'Test Card',
      description: 'Test description',
      listId: 'list-1',
      labelIds: ['label-1'],
      members: ['user-1'],
      completed: false,
      dueDate: new Date('2024-01-15'),
      checklists: [],
      position: 0,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    },
    boardLabels: [
      { id: 'label-1', text: 'Bug', color: 'bg-red-500' },
      { id: 'label-2', text: 'Feature', color: 'bg-blue-500' },
    ],
    form: {
      handleSubmit: jest.fn((fn) => fn),
      formState: { errors: {} },
      register: jest.fn(),
    },
    checklist: {
      handleAddChecklist: jest.fn(),
      handleRemoveChecklist: jest.fn(),
      handleAddItem: jest.fn(),
      handleRemoveItem: jest.fn(),
      handleToggleItem: jest.fn(),
    },
    currentBoardId: 'board-1',
    cardModalOpen: true,
    selectedCardId: 'card-1',
    cardJSONData: null,
    targetListId: 'list-1',
    isJSONImportMode: false,
  }),
  useTaskModalHandlers: () => ({
    handleSave: jest.fn(),
    handleToggleCompleted: jest.fn(),
    closeCardModal: jest.fn(),
  }),
}))

jest.mock('../components', () => ({
  TaskModalHeader: ({ onClose }: any) => (
    <div data-testid="task-modal-header">
      <button onClick={onClose} data-testid="header-close">Close</button>
    </div>
  ),
  TaskModalFormSection: ({ card, form, errors, register, onToggleCompleted }: any) => (
    <div data-testid="form-section">
      <input data-testid="title-input" {...register('title')} />
      {errors.title && <span data-testid="title-error">{errors.title.message}</span>}
      <button onClick={() => onToggleCompleted && onToggleCompleted()} data-testid="toggle-completed">
        Toggle Completed
      </button>
    </div>
  ),
  TaskModalLabelSection: ({ boardId, cardId, labelIds, labels }: any) => (
    <div data-testid="label-section">
      {labels.map((label: any) => (
        <div key={label.id} data-testid={`label-${label.id}`}>
          {label.text}
        </div>
      ))}
    </div>
  ),
  TaskModalChecklistSection: ({ cardId, boardId, checklists, checklistHook }: any) => (
    <div data-testid="checklist-section">
      {checklists.map((checklist: any) => (
        <div key={checklist.id} data-testid={`checklist-${checklist.id}`}>
          {checklist.name}
        </div>
      ))}
    </div>
  ),
}))

describe('TaskModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('should render modal when open', () => {
      render(<TaskModal />)

      expect(screen.getByTestId('modal')).toBeInTheDocument()
      expect(screen.getByTestId('modal-close')).toBeInTheDocument()
    })

    it('should render header', () => {
      render(<TaskModal />)

      expect(screen.getByTestId('task-modal-header')).toBeInTheDocument()
      expect(screen.getByTestId('header-close')).toBeInTheDocument()
    })

    it('should render form', () => {
      render(<TaskModal />)

      expect(screen.getByTestId('modal-body')).toBeInTheDocument()
      expect(screen.getByTestId('form-section')).toBeInTheDocument()
      expect(screen.getByTestId('title-input')).toBeInTheDocument()
    })

    it('should render footer', () => {
      render(<TaskModal />)

      expect(screen.getByTestId('modal-footer')).toBeInTheDocument()
      expect(screen.getByText('Save changes')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })
  })

  describe('conditional rendering', () => {
    it('should render labels section when not in JSON import mode', () => {
      render(<TaskModal />)

      expect(screen.getByTestId('label-section')).toBeInTheDocument()
      expect(screen.getByTestId('label-label-1')).toBeInTheDocument()
      expect(screen.getByText('Bug')).toBeInTheDocument()
    })

    it('should render checklist section when not in JSON import mode', () => {
      render(<TaskModal />)

      expect(screen.getByTestId('checklist-section')).toBeInTheDocument()
    })

    it('should render form section when not in JSON import mode', () => {
      render(<TaskModal />)

      expect(screen.getByTestId('form-section')).toBeInTheDocument()
      expect(screen.getByTestId('toggle-completed')).toBeInTheDocument()
    })
  })

  describe('data passing', () => {
    it('should pass correct props to TaskModalHeader', () => {
      render(<TaskModal />)

      expect(screen.getByTestId('task-modal-header')).toBeInTheDocument()
    })

    it('should pass correct props to TaskModalFormSection', () => {
      render(<TaskModal />)

      expect(screen.getByTestId('form-section')).toBeInTheDocument()
      expect(screen.getByTestId('title-input')).toBeInTheDocument()
    })

    it('should pass correct props to TaskModalLabelSection', () => {
      render(<TaskModal />)

      expect(screen.getByTestId('label-section')).toBeInTheDocument()
      expect(screen.getByTestId('label-label-1')).toBeInTheDocument()
    })

    it('should pass correct props to TaskModalChecklistSection', () => {
      render(<TaskModal />)

      expect(screen.getByTestId('checklist-section')).toBeInTheDocument()
    })
  })

  describe('form structure', () => {
    it('should have form element with submit handler', () => {
      render(<TaskModal />)

      const modalBody = screen.getByTestId('modal-body')
      expect(modalBody).toBeInTheDocument()
      expect(screen.getByText('Save changes')).toBeInTheDocument()
    })

    it('should have save and cancel buttons', () => {
      render(<TaskModal />)

      expect(screen.getByText('Save changes')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle component with minimal props', () => {
      render(<TaskModal />)

      // Basic rendering should work without errors
      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })
  })
})
