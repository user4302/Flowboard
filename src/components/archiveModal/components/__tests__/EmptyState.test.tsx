import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { EmptyState } from '../EmptyState'

describe('EmptyState Component', () => {
  describe('basic rendering', () => {
    it('should render empty state with zero archived cards', () => {
      render(<EmptyState archivedCardsLength={0} />)

      expect(screen.getByText('No archived cards')).toBeInTheDocument()
      expect(screen.getByText('Cards you archive will appear here for easy restoration.')).toBeInTheDocument()
    })

    it('should render with non-zero archived cards', () => {
      render(<EmptyState archivedCardsLength={5} />)

      expect(screen.getByText('No archived cards')).toBeInTheDocument()
      expect(screen.getByText('Cards you archive will appear here for easy restoration.')).toBeInTheDocument()
    })

    it('should render archive icon', () => {
      render(<EmptyState archivedCardsLength={0} />)

      // Check for the Archive icon by finding the SVG element
      const archiveIcon = document.querySelector('.lucide-archive')
      expect(archiveIcon).toBeInTheDocument()
      expect(archiveIcon).toHaveClass('h-6', 'w-6', 'text-slate-400', 'dark:text-slate-500')
    })

    it('should render proper heading structure', () => {
      render(<EmptyState archivedCardsLength={0} />)

      const heading = screen.getByRole('heading', { name: /no archived cards/i })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveClass('text-lg', 'font-medium', 'text-slate-900', 'dark:text-slate-100', 'mb-2')
    })

    it('should render descriptive paragraph', () => {
      render(<EmptyState archivedCardsLength={0} />)

      const description = screen.getByText(/Cards you archive will appear here for easy restoration/)
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-slate-600', 'dark:text-slate-400')
    })
  })

  describe('container structure', () => {
    it('should render with proper container styling', () => {
      render(<EmptyState archivedCardsLength={0} />)

      const container = screen.getByText('No archived cards').closest('div')
      expect(container).toHaveClass('text-center', 'py-12')
    })

    it('should render icon container with proper styling', () => {
      render(<EmptyState archivedCardsLength={0} />)

      const iconContainer = document.querySelector('[class*="h-12 w-12 rounded-full"]')
      expect(iconContainer).toHaveClass(
        'mx-auto',
        'h-12',
        'w-12',
        'rounded-full',
        'bg-slate-100',
        'dark:bg-slate-700',
        'flex',
        'items-center',
        'justify-center',
        'mb-4'
      )
    })
  })

  describe('accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<EmptyState archivedCardsLength={0} />)

      // Check for heading
      expect(screen.getByRole('heading')).toBeInTheDocument()

      // Check for descriptive content
      expect(screen.getByText(/Cards you archive will appear here/)).toBeInTheDocument()
    })

    it('should have accessible icon with proper alt text', () => {
      render(<EmptyState archivedCardsLength={0} />)

      // The SVG has aria-hidden="true", so it's decorative
      const archiveIcon = document.querySelector('.lucide-archive')
      expect(archiveIcon).toBeInTheDocument()
      expect(archiveIcon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('props handling', () => {
    it('should handle different archivedCardsLength values', () => {
      const { rerender } = render(<EmptyState archivedCardsLength={0} />)

      // Rerender with different values
      rerender(<EmptyState archivedCardsLength={10} />)
      rerender(<EmptyState archivedCardsLength={100} />)

      // Component should still render properly
      expect(screen.getByText('No archived cards')).toBeInTheDocument()
      expect(screen.getByText('Cards you archive will appear here for easy restoration.')).toBeInTheDocument()
    })

    it('should handle large numbers gracefully', () => {
      render(<EmptyState archivedCardsLength={999999} />)

      expect(screen.getByText('No archived cards')).toBeInTheDocument()
      expect(screen.getByText('Cards you archive will appear here for easy restoration.')).toBeInTheDocument()
    })
  })

  describe('visual consistency', () => {
    it('should maintain consistent spacing and layout', () => {
      render(<EmptyState archivedCardsLength={0} />)

      const container = screen.getByText('No archived cards').closest('div')
      const iconContainer = document.querySelector('[class*="h-12 w-12 rounded-full"]')

      // Check vertical spacing
      expect(container).toHaveClass('py-12')
      expect(iconContainer).toHaveClass('mb-4')

      // Check icon sizing
      const archiveIcon = document.querySelector('.lucide-archive')
      expect(archiveIcon).toHaveClass('h-6', 'w-6')
    })

    it('should render dark mode compatible classes', () => {
      render(<EmptyState archivedCardsLength={0} />)

      // Check for dark mode classes
      expect(screen.getByText('No archived cards')).toHaveClass('text-slate-900', 'dark:text-slate-100')
      expect(screen.getByText(/Cards you archive will appear here/)).toHaveClass('text-slate-600', 'dark:text-slate-400')

      const iconContainer = document.querySelector('[class*="h-12 w-12 rounded-full"]')
      expect(iconContainer).toHaveClass('bg-slate-100', 'dark:bg-slate-700')

      const archiveIcon = document.querySelector('.lucide-archive')
      expect(archiveIcon).toHaveClass('text-slate-400', 'dark:text-slate-500')
    })
  })

  describe('edge cases', () => {
    it('should render without crashing when archivedCardsLength is undefined', () => {
      render(<EmptyState archivedCardsLength={undefined as any} />)

      expect(screen.getByText('No archived cards')).toBeInTheDocument()
      expect(screen.getByText('Cards you archive will appear here for easy restoration.')).toBeInTheDocument()
    })

    it('should render without crashing when archivedCardsLength is negative', () => {
      render(<EmptyState archivedCardsLength={-5} />)

      expect(screen.getByText('No archived cards')).toBeInTheDocument()
      expect(screen.getByText('Cards you archive will appear here for easy restoration.')).toBeInTheDocument()
    })

    it('should render without crashing when archivedCardsLength is null', () => {
      render(<EmptyState archivedCardsLength={null as any} />)

      expect(screen.getByText('No archived cards')).toBeInTheDocument()
      expect(screen.getByText('Cards you archive will appear here for easy restoration.')).toBeInTheDocument()
    })
  })
})
