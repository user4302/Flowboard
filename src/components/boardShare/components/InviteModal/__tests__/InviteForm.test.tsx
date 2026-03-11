import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { InviteForm } from '../InviteForm'

describe('InviteForm Component', () => {
  const defaultProps = {
    expiresIn: 168,
    onExpiresInChange: jest.fn(),
    onCreateInvite: jest.fn(),
    onCancel: jest.fn(),
    boardName: 'Test Board',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('should render form elements', () => {
      render(<InviteForm {...defaultProps} />)

      expect(screen.getByText('Invite to Board')).toBeInTheDocument()
      expect(screen.getByText(/Test Board/)).toBeInTheDocument()
      expect(screen.getByText('Create & Copy Link')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getAllByRole('button')).toHaveLength(2)
    })

    it('should render with default props', () => {
      render(<InviteForm {...defaultProps} />)

      expect(screen.getByDisplayValue('1 week')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should render without crashing', () => {
      render(<InviteForm {...defaultProps} />)

      expect(screen.getByText('Invite to Board')).toBeInTheDocument()
    })

    it('should handle missing board name', () => {
      render(<InviteForm {...defaultProps} boardName="" />)

      expect(screen.getByText('Invite to Board')).toBeInTheDocument()
      expect(screen.getAllByRole('button')).toHaveLength(2)
    })

    it('should handle custom expiration time', () => {
      render(<InviteForm {...defaultProps} expiresIn={24} />)

      expect(screen.getByDisplayValue('24 hours')).toBeInTheDocument()
    })
  })

  describe('form submission', () => {
    it('should call onCreateInvite when Create & Copy Link is clicked', async () => {
      const user = userEvent.setup()
      render(<InviteForm {...defaultProps} />)

      const createButton = screen.getByRole('button', { name: /Create & Copy Link/i })
      await user.click(createButton)

      expect(defaultProps.onCreateInvite).toHaveBeenCalled()
    })

    it('should call onCancel when Cancel is clicked', async () => {
      const user = userEvent.setup()
      render(<InviteForm {...defaultProps} />)

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      await user.click(cancelButton)

      expect(defaultProps.onCancel).toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('should have proper form structure', () => {
      render(<InviteForm {...defaultProps} />)

      expect(screen.getByText('Invite to Board')).toBeInTheDocument()
      expect(screen.getAllByRole('button')).toHaveLength(2)
    })

    it('should have accessible buttons', () => {
      render(<InviteForm {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
    })
  })
})
