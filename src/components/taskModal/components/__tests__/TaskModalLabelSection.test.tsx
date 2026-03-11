import React from 'react'
import { render } from '@testing-library/react'

// Basic test for TaskModalLabelSection
describe('TaskModalLabelSection', () => {
  it('should exist as a module', () => {
    expect(() => require('../TaskModalLabelSection')).not.toThrow()
  })

  it('should render without crashing', () => {
    const Component = require('../TaskModalLabelSection').default || require('../TaskModalLabelSection')[Object.keys(require('../TaskModalLabelSection'))[0]]
    if (typeof Component === 'function') {
      expect(() => render(<Component />)).not.toThrow()
    }
  })
})
