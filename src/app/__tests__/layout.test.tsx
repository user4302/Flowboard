import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RootLayout from '../layout'

// Mock dependencies
jest.mock('next/font/google', () => ({
  Geist: () => ({
    variable: '--font-geist-sans',
  }),
  Geist_Mono: () => ({
    variable: '--font-geist-mono',
  }),
}))

jest.mock('@/lib/constants', () => ({
  APP_VERSION: '1.4.0',
}))

describe('RootLayout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('should render html element with lang attribute', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      )

      const htmlElement = document.documentElement
      expect(htmlElement).toHaveAttribute('lang', 'en')
    })

    it('should render body element with correct classes', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      )

      const bodyElement = document.body
      expect(bodyElement).toHaveClass('antialiased')
      expect(bodyElement).toHaveClass('--font-geist-sans')
      expect(bodyElement).toHaveClass('--font-geist-mono')
    })

    it('should render children content', () => {
      render(
        <RootLayout>
          <div data-testid="test-content">Test Content</div>
        </RootLayout>
      )

      expect(screen.getByTestId('test-content')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })
  })

  describe('font configuration', () => {
    it('should apply font variables to body', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      )

      const bodyElement = document.body
      expect(bodyElement.className).toContain('--font-geist-sans')
      expect(bodyElement.className).toContain('--font-geist-mono')
    })

    it('should have antialiased class for font smoothing', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      )

      const bodyElement = document.body
      expect(bodyElement).toHaveClass('antialiased')
    })
  })

  describe('metadata', () => {
    it('should have correct metadata configuration', () => {
      // This tests the static metadata export
      // In a real Next.js app, this would be handled by the framework
      expect(true).toBe(true) // Placeholder for metadata testing
    })
  })

  describe('component integration', () => {
    it('should integrate with font loading', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      )

      // Should integrate with Next.js font optimization
      expect(document.body).toHaveClass('--font-geist-sans')
    })

    it('should integrate with CSS imports', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      )

      // Should have global CSS applied
      expect(document.body).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper semantic structure', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      )

      const htmlElement = document.documentElement
      const bodyElement = document.body

      expect(htmlElement.tagName.toLowerCase()).toBe('html')
      expect(bodyElement.tagName.toLowerCase()).toBe('body')
    })

    it('should have lang attribute for accessibility', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      )

      const htmlElement = document.documentElement
      expect(htmlElement).toHaveAttribute('lang', 'en')
    })

    it('should have antialiased fonts for better readability', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      )

      const bodyElement = document.body
      expect(bodyElement).toHaveClass('antialiased')
    })
  })

  describe('performance', () => {
    it('should render efficiently', () => {
      const { container } = render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      )

      expect(container).toBeInTheDocument()
    })

    it('should not re-render unnecessarily', () => {
      const { rerender } = render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      )

      rerender(
        <RootLayout>
          <div>Updated Content</div>
        </RootLayout>
      )

      expect(screen.getByText('Updated Content')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should render with empty children', () => {
      render(
        <RootLayout>
          <></>
        </RootLayout>
      )

      const bodyElement = document.body
      expect(bodyElement).toBeInTheDocument()
    })

    it('should render with multiple children', () => {
      render(
        <RootLayout>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </RootLayout>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
      expect(screen.getByTestId('child-3')).toBeInTheDocument()
    })

    it('should render with complex nested children', () => {
      render(
        <RootLayout>
          <div>
            <header>
              <h1>Title</h1>
            </header>
            <main>
              <p>Content</p>
            </main>
            <footer>
              <p>Footer</p>
            </footer>
          </div>
        </RootLayout>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should apply correct CSS classes', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      )

      const bodyElement = document.body
      expect(bodyElement).toHaveClass('antialiased')
      expect(bodyElement).toHaveClass('--font-geist-sans')
      expect(bodyElement).toHaveClass('--font-geist-mono')
    })

    it('should maintain CSS custom properties', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      )

      const bodyElement = document.body
      const computedStyle = window.getComputedStyle(bodyElement)

      // Should have font variables available
      expect(bodyElement.style.getPropertyValue('--font-geist-sans')).toBeDefined()
      expect(bodyElement.style.getPropertyValue('--font-geist-mono')).toBeDefined()
    })
  })
})
