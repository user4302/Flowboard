import React from 'react'
import { render } from '@testing-library/react'

// Basic test for SearchAndFilterPanel
describe('SearchAndFilterPanel', () => {
  it('should exist as a module', () => {
    expect(() => require('../SearchAndFilterPanel')).not.toThrow()
  })

  it('should render without crashing', () => {
    const Component = require('../SearchAndFilterPanel').default || require('../SearchAndFilterPanel')[Object.keys(require('../SearchAndFilterPanel'))[0]]
    if (typeof Component === 'function') {
      expect(() => render(<Component />)).not.toThrow()
    }
  })
})
