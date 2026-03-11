import React from 'react'
import { render } from '@testing-library/react'

// Basic test for custom-tooltip
describe('custom-tooltip', () => {
  it('should exist as a module', () => {
    expect(() => require('../custom-tooltip')).not.toThrow()
  })

  it('should render without crashing', () => {
    const Component = require('../custom-tooltip').default || require('../custom-tooltip')[Object.keys(require('../custom-tooltip'))[0]]
    if (typeof Component === 'function') {
      expect(() => render(<Component />)).not.toThrow()
    }
  })
})
