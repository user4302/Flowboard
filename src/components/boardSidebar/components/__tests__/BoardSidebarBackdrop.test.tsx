import React from 'react'
import { render } from '@testing-library/react'

// Basic test for BoardSidebarBackdrop
describe('BoardSidebarBackdrop', () => {
  it('should exist as a module', () => {
    expect(() => require('../BoardSidebarBackdrop')).not.toThrow()
  })

  it('should render without crashing', () => {
    const Component = require('../BoardSidebarBackdrop').default || require('../BoardSidebarBackdrop')[Object.keys(require('../BoardSidebarBackdrop'))[0]]
    if (typeof Component === 'function') {
      expect(() => render(<Component />)).not.toThrow()
    }
  })
})
