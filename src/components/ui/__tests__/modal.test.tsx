import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../modal'

describe('Modal Components', () => {
  describe('Modal', () => {
    it('should not render when open is false', () => {
      render(<Modal open={false}>Modal Content</Modal>)

      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should render when open is true', () => {
      render(<Modal open={true}>Modal Content</Modal>)

      expect(screen.getByText('Modal Content')).toBeInTheDocument()
    })

    it('should render with default open state (false)', () => {
      render(<Modal>Modal Content</Modal>)

      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
    })

    it('should render backdrop overlay', () => {
      render(<Modal open={true}>Modal Content</Modal>)

      const backdrop = screen.getByText('Modal Content').parentElement?.firstElementChild
      expect(backdrop).toHaveClass('bg-black/50', 'backdrop-blur-sm')
    })

    it('should render modal content container', () => {
      render(<Modal open={true}>Modal Content</Modal>)

      const modalContainer = screen.getByText('Modal Content').parentElement?.lastElementChild
      expect(modalContainer).toHaveClass(
        'relative',
        'z-10',
        'w-full',
        'max-w-2xl',
        'max-h-[90vh]',
        'rounded-2xl',
        'bg-white'
      )
    })

    it('should call onClose when backdrop is clicked', async () => {
      const user = userEvent.setup()
      const handleClose = jest.fn()

      render(
        <Modal open={true} onClose={handleClose}>
          Modal Content
        </Modal>
      )

      const backdrop = screen.getByText('Modal Content').parentElement?.firstElementChild
      if (backdrop) {
        await user.click(backdrop)
        expect(handleClose).toHaveBeenCalledTimes(1)
      }
    })

    it('should not call onClose when modal content is clicked', async () => {
      const user = userEvent.setup()
      const handleClose = jest.fn()

      render(
        <Modal open={true} onClose={handleClose}>
          Modal Content
        </Modal>
      )

      const modalContent = screen.getByText('Modal Content')
      await user.click(modalContent)

      expect(handleClose).not.toHaveBeenCalled()
    })

    it('should render with custom className', () => {
      render(
        <Modal open={true} className="custom-modal">
          Modal Content
        </Modal>
      )

      const modalContainer = screen.getByText('Modal Content').parentElement?.lastElementChild
      expect(modalContainer).toHaveClass('custom-modal')
    })

    it('should pass through additional props', () => {
      render(
        <Modal open={true} data-testid="modal-test" role="dialog">
          Modal Content
        </Modal>
      )

      const modalContainer = screen.getByTestId('modal-test')
      expect(modalContainer).toHaveAttribute('role', 'dialog')
    })

    it('should handle ref forwarding', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(
        <Modal open={true} ref={ref}>
          Modal Content
        </Modal>
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toBeInTheDocument()
    })

    it('should render children properly', () => {
      render(
        <Modal open={true}>
          <div>Child Element 1</div>
          <div>Child Element 2</div>
        </Modal>
      )

      expect(screen.getByText('Child Element 1')).toBeInTheDocument()
      expect(screen.getByText('Child Element 2')).toBeInTheDocument()
    })

    it('should have proper z-index and positioning', () => {
      render(<Modal open={true}>Modal Content</Modal>)

      const modalWrapper = screen.getByText('Modal Content').parentElement
      expect(modalWrapper).toHaveClass('fixed', 'inset-0', 'z-50')
      expect(modalWrapper).toHaveClass('flex', 'items-center', 'justify-center')
    })
  })

  describe('ModalHeader', () => {
    it('should render with default styling', () => {
      render(<ModalHeader>Header Content</ModalHeader>)

      const header = screen.getByText('Header Content')
      expect(header).toHaveClass(
        'flex',
        'items-center',
        'justify-between',
        'border-b',
        'border-slate-200',
        'px-6',
        'py-4'
      )
    })

    it('should render with custom className', () => {
      render(<ModalHeader className="custom-header">Header Content</ModalHeader>)

      const header = screen.getByText('Header Content')
      expect(header).toHaveClass('custom-header')
    })

    it('should pass through additional props', () => {
      render(<ModalHeader data-testid="header-test">Header Content</ModalHeader>)

      const header = screen.getByTestId('header-test')
      expect(header).toBeInTheDocument()
    })

    it('should handle ref forwarding', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(<ModalHeader ref={ref}>Header Content</ModalHeader>)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toBeInTheDocument()
    })

    it('should render complex content', () => {
      render(
        <ModalHeader>
          <span>Title</span>
          <button>Close</button>
        </ModalHeader>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Close')).toBeInTheDocument()
    })
  })

  describe('ModalTitle', () => {
    it('should render as h2 element with proper styling', () => {
      render(<ModalTitle>Modal Title</ModalTitle>)

      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toHaveTextContent('Modal Title')
      expect(title).toHaveClass('text-lg', 'font-semibold', 'text-slate-900')
    })

    it('should render with custom className', () => {
      render(<ModalTitle className="custom-title">Modal Title</ModalTitle>)

      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toHaveClass('custom-title')
    })

    it('should pass through additional props', () => {
      render(<ModalTitle id="modal-title">Modal Title</ModalTitle>)

      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toHaveAttribute('id', 'modal-title')
    })

    it('should handle ref forwarding', () => {
      const ref = React.createRef<HTMLHeadingElement>()

      render(<ModalTitle ref={ref}>Modal Title</ModalTitle>)

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
      expect(ref.current).toBeInTheDocument()
    })

    it('should support dark mode styling', () => {
      render(<ModalTitle>Modal Title</ModalTitle>)

      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toHaveClass('dark:text-slate-100')
    })
  })

  describe('ModalBody', () => {
    it('should render with proper styling', () => {
      render(<ModalBody>Body Content</ModalBody>)

      const body = screen.getByText('Body Content')
      expect(body).toHaveClass(
        'px-6',
        'py-4',
        'overflow-y-auto',
        'max-h-[60vh]'
      )
    })

    it('should render with custom className', () => {
      render(<ModalBody className="custom-body">Body Content</ModalBody>)

      const body = screen.getByText('Body Content')
      expect(body).toHaveClass('custom-body')
    })

    it('should handle long content with scrolling', () => {
      const longContent = 'A'.repeat(1000)
      render(<ModalBody>{longContent}</ModalBody>)

      const body = screen.getByText(longContent)
      expect(body).toHaveClass('overflow-y-auto', 'max-h-[60vh]')
    })

    it('should pass through additional props', () => {
      render(<ModalBody data-testid="body-test">Body Content</ModalBody>)

      const body = screen.getByTestId('body-test')
      expect(body).toBeInTheDocument()
    })

    it('should handle ref forwarding', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(<ModalBody ref={ref}>Body Content</ModalBody>)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toBeInTheDocument()
    })

    it('should render complex content structure', () => {
      render(
        <ModalBody>
          <p>Paragraph 1</p>
          <ul>
            <li>List Item 1</li>
            <li>List Item 2</li>
          </ul>
          <p>Paragraph 2</p>
        </ModalBody>
      )

      expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
      expect(screen.getByText('List Item 1')).toBeInTheDocument()
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
    })
  })

  describe('ModalFooter', () => {
    it('should render with proper styling', () => {
      render(<ModalFooter>Footer Content</ModalFooter>)

      const footer = screen.getByText('Footer Content')
      expect(footer).toHaveClass(
        'flex',
        'items-center',
        'justify-end',
        'gap-3',
        'border-t',
        'border-slate-200',
        'px-6',
        'py-4'
      )
    })

    it('should render with custom className', () => {
      render(<ModalFooter className="custom-footer">Footer Content</ModalFooter>)

      const footer = screen.getByText('Footer Content')
      expect(footer).toHaveClass('custom-footer')
    })

    it('should properly align buttons', () => {
      render(
        <ModalFooter>
          <button>Cancel</button>
          <button>Submit</button>
        </ModalFooter>
      )

      const footer = screen.getByRole('button', { name: 'Cancel' }).parentElement
      expect(footer).toHaveClass('justify-end', 'gap-3')
    })

    it('should pass through additional props', () => {
      render(<ModalFooter data-testid="footer-test">Footer Content</ModalFooter>)

      const footer = screen.getByTestId('footer-test')
      expect(footer).toBeInTheDocument()
    })

    it('should handle ref forwarding', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(<ModalFooter ref={ref}>Footer Content</ModalFooter>)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toBeInTheDocument()
    })

    it('should support dark mode styling', () => {
      render(<ModalFooter>Footer Content</ModalFooter>)

      const footer = screen.getByText('Footer Content')
      expect(footer).toHaveClass('dark:border-slate-700')
    })
  })

  describe('Integration Tests', () => {
    it('should render complete modal structure', () => {
      render(
        <Modal open={true}>
          <ModalHeader>
            <ModalTitle>Test Modal</ModalTitle>
            <button>Close</button>
          </ModalHeader>
          <ModalBody>
            <p>Modal body content goes here.</p>
          </ModalBody>
          <ModalFooter>
            <button>Cancel</button>
            <button>Submit</button>
          </ModalFooter>
        </Modal>
      )

      expect(screen.getByRole('heading', { name: 'Test Modal' })).toBeInTheDocument()
      expect(screen.getByText('Modal body content goes here.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    })

    it('should handle modal close interaction', async () => {
      const user = userEvent.setup()
      const handleClose = jest.fn()

      render(
        <Modal open={true} onClose={handleClose}>
          <ModalHeader>
            <ModalTitle>Test Modal</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>Content</p>
          </ModalBody>
        </Modal>
      )

      // Find and click the backdrop
      const backdrop = screen.getByText('Content').closest('[role="dialog"]')?.parentElement?.firstElementChild
      if (backdrop) {
        await user.click(backdrop)
        expect(handleClose).toHaveBeenCalledTimes(1)
      }
    })

    it('should support accessibility attributes', () => {
      render(
        <Modal open={true} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <ModalHeader>
            <ModalTitle id="modal-title">Accessible Modal</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>Accessible content</p>
          </ModalBody>
        </Modal>
      )

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-modal', 'true')
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title')
      expect(screen.getByRole('heading', { name: 'Accessible Modal' })).toBeInTheDocument()
    })
  })
})
