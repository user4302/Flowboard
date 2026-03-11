import React from 'react'
import { render } from '@testing-library/react'

// Basic test for SearchAndFilterPriority
describe('SearchAndFilterPriority', () => {
  it('should exist as a module', () => {
    expect(() => require('../SearchAndFilterPriority')).not.toThrow()
  })

  it('should render without crashing', () => {
    const Component = require('../SearchAndFilterPriority').default || require('../SearchAndFilterPriority')[Object.keys(require('../SearchAndFilterPriority'))[0]]
    if (typeof Component === 'function') {
      expect(() => render(<Component />)).not.toThrow()
    }
  })
})
