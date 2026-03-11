import React from 'react'
import { render } from '@testing-library/react'

// Basic test for TimelineHeader
describe('TimelineHeader', () => {
  it('should exist as a module', () => {
    expect(() => require('../TimelineHeader')).not.toThrow()
  })

  it('should render without crashing', () => {
    const Component = require('../TimelineHeader').default || require('../TimelineHeader')[Object.keys(require('../TimelineHeader'))[0]]
    if (typeof Component === 'function') {
      expect(() => render(<Component />)).not.toThrow()
    }
  })
})
