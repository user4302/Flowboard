import React from 'react'
import { render } from '@testing-library/react'

// Basic test for BoardSidebarHeader
describe('BoardSidebarHeader', () => {
  it('should exist as a module', () => {
    expect(() => require('../BoardSidebarHeader')).not.toThrow()
  })

  it('should render without crashing', () => {
    const Component = require('../BoardSidebarHeader').default || require('../BoardSidebarHeader')[Object.keys(require('../BoardSidebarHeader'))[0]]
    if (typeof Component === 'function') {
      expect(() => render(<Component />)).not.toThrow()
    }
  })
})
