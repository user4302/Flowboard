import React from 'react'
import { render } from '@testing-library/react'

// Basic test for BoardSidebarCreationForm
describe('BoardSidebarCreationForm', () => {
  it('should exist as a module', () => {
    expect(() => require('../BoardSidebarCreationForm')).not.toThrow()
  })

  it('should render without crashing', () => {
    const Component = require('../BoardSidebarCreationForm').default || require('../BoardSidebarCreationForm')[Object.keys(require('../BoardSidebarCreationForm'))[0]]
    if (typeof Component === 'function') {
      expect(() => render(<Component />)).not.toThrow()
    }
  })
})
