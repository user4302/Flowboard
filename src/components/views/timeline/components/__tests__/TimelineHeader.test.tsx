import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TimelineHeader } from '../TimelineHeader'

describe('TimelineHeader', () => {
  const mockCurrentDate = new Date('2023-01-15')
  const mockOnDateChange = jest.fn()
  const mockOnZoomChange = jest.fn()

  const defaultProps = {
    currentDate: mockCurrentDate,
    zoomLevel: 'week' as const,
    onDateChange: mockOnDateChange,
    onZoomChange: mockOnZoomChange
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render with week zoom level', () => {
      render(<TimelineHeader {...defaultProps} />)

      expect(screen.getByText('Week')).toBeInTheDocument()
      expect(screen.getByText('January 2023')).toBeInTheDocument()
    })

    it('should render with day zoom level', () => {
      render(<TimelineHeader {...defaultProps} zoomLevel="day" />)
      expect(screen.getByText('Day')).toBeInTheDocument()
    })

    it('should render with month zoom level', () => {
      render(<TimelineHeader {...defaultProps} zoomLevel="month" />)
      expect(screen.getByText('Month')).toBeInTheDocument()
    })

    it('should render with year zoom level', () => {
      render(<TimelineHeader {...defaultProps} zoomLevel="year" />)
      expect(screen.getByText('Year')).toBeInTheDocument()
    })

    it('should render navigation buttons', () => {
      render(<TimelineHeader {...defaultProps} />)

      const prevButton = screen.getByRole('button', { name: '←' })
      const nextButton = screen.getByRole('button', { name: '→' })

      expect(prevButton).toBeInTheDocument()
      expect(nextButton).toBeInTheDocument()
    })

    it('should render today button', () => {
      render(<TimelineHeader {...defaultProps} />)

      const todayButton = screen.getByText('Today')
      expect(todayButton).toBeInTheDocument()
      expect(todayButton.closest('button')).toBeInTheDocument()
    })
  })

  describe('Date Navigation', () => {
    it('should navigate to previous date', () => {
      render(<TimelineHeader {...defaultProps} zoomLevel="day" />)

      const prevButton = screen.getByRole('button', { name: '←' })
      fireEvent.click(prevButton)

      expect(mockOnDateChange).toHaveBeenCalled()
    })

    it('should navigate to next date', () => {
      render(<TimelineHeader {...defaultProps} zoomLevel="day" />)

      const nextButton = screen.getByRole('button', { name: '→' })
      fireEvent.click(nextButton)

      expect(mockOnDateChange).toHaveBeenCalled()
    })

    it('should handle week navigation', () => {
      render(<TimelineHeader {...defaultProps} zoomLevel="week" />)

      const prevButton = screen.getByRole('button', { name: '←' })
      fireEvent.click(prevButton)

      expect(mockOnDateChange).toHaveBeenCalled()
    })

    it('should handle month navigation', () => {
      render(<TimelineHeader {...defaultProps} zoomLevel="month" />)

      const nextButton = screen.getByRole('button', { name: '→' })
      fireEvent.click(nextButton)

      expect(mockOnDateChange).toHaveBeenCalled()
    })

    it('should handle year navigation', () => {
      render(<TimelineHeader {...defaultProps} zoomLevel="year" />)

      const prevButton = screen.getByRole('button', { name: '←' })
      fireEvent.click(prevButton)

      expect(mockOnDateChange).toHaveBeenCalled()
    })
  })

  describe('Zoom Level Changes', () => {
    it('should handle zoom level change to day', () => {
      render(<TimelineHeader {...defaultProps} />)

      const dayButton = screen.getByText('Day')
      fireEvent.click(dayButton)

      expect(mockOnZoomChange).toHaveBeenCalledWith('day')
    })

    it('should handle zoom level change to week', () => {
      render(<TimelineHeader {...defaultProps} zoomLevel="day" />)

      const weekButton = screen.getByText('Week')
      fireEvent.click(weekButton)

      expect(mockOnZoomChange).toHaveBeenCalledWith('week')
    })

    it('should handle zoom level change to month', () => {
      render(<TimelineHeader {...defaultProps} />)

      const monthButton = screen.getByText('Month')
      fireEvent.click(monthButton)

      expect(mockOnZoomChange).toHaveBeenCalledWith('month')
    })

    it('should handle zoom level change to year', () => {
      render(<TimelineHeader {...defaultProps} />)

      const yearButton = screen.getByText('Year')
      fireEvent.click(yearButton)

      expect(mockOnZoomChange).toHaveBeenCalledWith('year')
    })
  })

  describe('Today Button', () => {
    it('should call onDateChange when today clicked', () => {
      render(<TimelineHeader {...defaultProps} />)

      const todayButton = screen.getByText('Today')
      fireEvent.click(todayButton)

      expect(mockOnDateChange).toHaveBeenCalledWith(
        expect.objectContaining({ getTime: expect.any(Function) })
      )
    })
  })

  describe('Date Display', () => {
    it('should display formatted date for week view', () => {
      render(<TimelineHeader {...defaultProps} />)

      const dateDisplay = screen.getByRole('heading')
      expect(dateDisplay.textContent).toContain('January 2023')
    })

    it('should show "Invalid Date" for invalid date', () => {
      render(<TimelineHeader {...defaultProps} currentDate={new Date('invalid') as any} />)

      expect(screen.getByText('Invalid Date')).toBeInTheDocument()
    })

    it('should show "Invalid Date" for null date', () => {
      render(<TimelineHeader {...defaultProps} currentDate={null as any} />)

      expect(screen.getByText('Invalid Date')).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('should render header container', () => {
      render(<TimelineHeader {...defaultProps} />)

      const header = document.querySelector('.sticky.top-0.z-20')
      expect(header).toBeInTheDocument()
    })

    it('should have proper heading element', () => {
      render(<TimelineHeader {...defaultProps} />)

      const heading = screen.getByRole('heading')
      expect(heading).toBeInTheDocument()
    })

    it('should render navigation buttons', () => {
      render(<TimelineHeader {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })
})
