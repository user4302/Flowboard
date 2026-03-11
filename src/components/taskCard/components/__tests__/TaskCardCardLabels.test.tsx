import React from 'react'
import { render } from '@testing-library/react'

// Basic test for TaskCardCardLabels
describe('TaskCardCardLabels', () => {
  it('should exist as a module', () => {
    expect(() => require('../TaskCardCardLabels')).not.toThrow()
  })

  it('should render without crashing', () => {
    const Component = require('../TaskCardCardLabels').default || require('../TaskCardCardLabels')[Object.keys(require('../TaskCardCardLabels'))[0]]
    if (typeof Component === 'function') {
      expect(() => render(<Component />)).not.toThrow()
    }
  })
})
