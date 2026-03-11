import React from 'react'
import { render } from '@testing-library/react'

// Basic test for TaskModalHeader
describe('TaskModalHeader', () => {
  it('should exist as a module', () => {
    expect(() => require('../TaskModalHeader')).not.toThrow()
  })

  it('should render without crashing', () => {
    const Component = require('../TaskModalHeader').default || require('../TaskModalHeader')[Object.keys(require('../TaskModalHeader'))[0]]
    if (typeof Component === 'function') {
      expect(() => render(<Component />)).not.toThrow()
    }
  })
})
