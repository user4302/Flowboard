import React from 'react'
import { render } from '@testing-library/react'

// Basic test for SearchAndFilterButton
describe('SearchAndFilterButton', () => {
  it('should exist as a module', () => {
    expect(() => require('../SearchAndFilterButton')).not.toThrow()
  })

  it('should render without crashing', () => {
    const Component = require('../SearchAndFilterButton').default || require('../SearchAndFilterButton')[Object.keys(require('../SearchAndFilterButton'))[0]]
    if (typeof Component === 'function') {
      expect(() => render(<Component />)).not.toThrow()
    }
  })
})
