import React from 'react'
import { render } from '@testing-library/react'

// Basic test for TaskModalChecklistManager
describe('TaskModalChecklistManager', () => {
  it('should exist as a module', () => {
    expect(() => require('../TaskModalChecklistManager')).not.toThrow()
  })

  it('should render without crashing', () => {
    const Component = require('../TaskModalChecklistManager').default || require('../TaskModalChecklistManager')[Object.keys(require('../TaskModalChecklistManager'))[0]]
    if (typeof Component === 'function') {
      expect(() => render(<Component />)).not.toThrow()
    }
  })
})
