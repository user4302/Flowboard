import React from 'react'
import { render } from '@testing-library/react'
import { JoinAlert } from '../JoinAlert'

describe('JoinAlert', () => {
  it('should render without crashing', () => {
    expect(() => render(<JoinAlert />)).not.toThrow()
  })

  it('should handle default props', () => {
    expect(() => render(<JoinAlert />)).not.toThrow()
  })
})
