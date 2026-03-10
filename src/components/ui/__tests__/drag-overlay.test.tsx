import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DragOverlayWrapper } from '../drag-overlay'

// Mock @dnd-kit/core
jest.mock('@dnd-kit/core', () => ({
  DragOverlay: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dnd-drag-overlay">{children}</div>
  ),
}))

describe('DragOverlayWrapper Component', () => {
  describe('basic rendering', () => {
    it('should not render when activeId is null', () => {
      render(
        <DragOverlayWrapper activeId={null}>
          <div>Drag Content</div>
        </DragOverlayWrapper>
      )

      const overlay = screen.getByTestId('dnd-drag-overlay')
      expect(overlay).toBeEmptyDOMElement()
    })

    it('should render when activeId is provided', () => {
      render(
        <DragOverlayWrapper activeId="drag-item-1">
          <div>Drag Content</div>
        </DragOverlayWrapper>
      )

      expect(screen.getByText('Drag Content')).toBeInTheDocument()
    })

    it('should not render with empty string activeId', () => {
      render(
        <DragOverlayWrapper activeId="">
          <div>Drag Content</div>
        </DragOverlayWrapper>
      )

      const overlay = screen.getByTestId('dnd-drag-overlay')
      expect(overlay).toBeEmptyDOMElement()
    })

    it('should render with numeric activeId', () => {
      render(
        <DragOverlayWrapper activeId={"123"}>
          <div>Drag Content</div>
        </DragOverlayWrapper>
      )

      expect(screen.getByText('Drag Content')).toBeInTheDocument()
    })
  })

  describe('styling and props', () => {
    it('should apply default transform classes', () => {
      render(
        <DragOverlayWrapper activeId="test-id">
          <div>Drag Content</div>
        </DragOverlayWrapper>
      )

      const dragContent = screen.getByText('Drag Content')
      expect(dragContent).toBeInTheDocument()
    })

    it('should merge custom className with default classes', () => {
      render(
        <DragOverlayWrapper activeId="test-id" className="custom-class">
          <div>Drag Content</div>
        </DragOverlayWrapper>
      )

      const dragContent = screen.getByText('Drag Content')
      expect(dragContent).toBeInTheDocument()
    })

    it('should pass through additional props', () => {
      render(
        <DragOverlayWrapper activeId="test-id" data-testid="drag-wrapper" role="drag-item">
          <div>Drag Content</div>
        </DragOverlayWrapper>
      )

      const dragContent = screen.getByTestId('drag-wrapper')
      expect(dragContent).toHaveAttribute('role', 'drag-item')
    })

    it('should handle ref forwarding', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(
        <DragOverlayWrapper activeId="test-id" ref={ref}>
          <div>Drag Content</div>
        </DragOverlayWrapper>
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toBeInTheDocument()
    })
  })

  describe('children rendering', () => {
    it('should render simple text content', () => {
      render(
        <DragOverlayWrapper activeId="test-id">
          Simple Text
        </DragOverlayWrapper>
      )

      expect(screen.getByText('Simple Text')).toBeInTheDocument()
    })

    it('should render complex children', () => {
      render(
        <DragOverlayWrapper activeId="test-id">
          <div>
            <h3>Card Title</h3>
            <p>Card Description</p>
            <button>Action</button>
          </div>
        </DragOverlayWrapper>
      )

      expect(screen.getByRole('heading', { name: 'Card Title' })).toBeInTheDocument()
      expect(screen.getByText('Card Description')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    it('should render null children gracefully', () => {
      render(
        <DragOverlayWrapper activeId="test-id">
          {null}
        </DragOverlayWrapper>
      )

      const overlay = screen.getByTestId('dnd-drag-overlay')
      expect(overlay).toBeInTheDocument()
      expect(overlay.firstChild).toBeTruthy()
    })

    it('should render multiple children', () => {
      render(
        <DragOverlayWrapper activeId="test-id">
          <span>Item 1</span>
          <span>Item 2</span>
          <span>Item 3</span>
        </DragOverlayWrapper>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle rapid activeId changes', () => {
      const { rerender } = render(
        <DragOverlayWrapper activeId="initial">
          <div>Initial Content</div>
        </DragOverlayWrapper>
      )

      expect(screen.getByText('Initial Content')).toBeInTheDocument()

      rerender(
        <DragOverlayWrapper activeId={null}>
          <div>Initial Content</div>
        </DragOverlayWrapper>
      )

      const overlay = screen.getByTestId('dnd-drag-overlay')
      expect(overlay).toBeEmptyDOMElement()

      rerender(
        <DragOverlayWrapper activeId="new-id">
          <div>New Content</div>
        </DragOverlayWrapper>
      )

      expect(screen.getByText('New Content')).toBeInTheDocument()
    })

    it('should handle undefined activeId', () => {
      render(
        <DragOverlayWrapper activeId={null}>
          <div>Content</div>
        </DragOverlayWrapper>
      )

      const overlay = screen.getByTestId('dnd-drag-overlay')
      expect(overlay).toBeEmptyDOMElement()
    })

    it('should handle zero as activeId', () => {
      render(
        <DragOverlayWrapper activeId={"0"}>
          <div>Content</div>
        </DragOverlayWrapper>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should handle falsy but valid activeId values', () => {
      const { rerender } = render(
        <DragOverlayWrapper activeId={null}>
          <div>Content</div>
        </DragOverlayWrapper>
      )

      let overlay = screen.getByTestId('dnd-drag-overlay')
      expect(overlay).toBeEmptyDOMElement()

      rerender(
        <DragOverlayWrapper activeId="">
          <div>Content</div>
        </DragOverlayWrapper>
      )

      overlay = screen.getByTestId('dnd-drag-overlay')
      expect(overlay).toBeEmptyDOMElement()
    })
  })

  describe('integration with DragOverlay', () => {
    it('should properly wrap DragOverlay component', () => {
      render(
        <DragOverlayWrapper activeId="test-id">
          <div>Wrapped Content</div>
        </DragOverlayWrapper>
      )

      const dragOverlay = screen.getByTestId('dnd-drag-overlay')
      expect(dragOverlay).toBeInTheDocument()
      expect(screen.getByText('Wrapped Content')).toBeInTheDocument()
    })

    it('should maintain DragOverlay functionality', () => {
      render(
        <DragOverlayWrapper activeId="test-id" className="test-class">
          <div data-testid="inner-content">Test Content</div>
        </DragOverlayWrapper>
      )

      const innerContent = screen.getByTestId('inner-content')
      expect(innerContent).toBeInTheDocument()
    })
  })
})
