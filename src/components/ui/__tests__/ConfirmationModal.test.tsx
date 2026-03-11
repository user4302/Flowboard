import React from 'react'
import { render } from '@testing-library/react'

// Basic test for ConfirmationModal
describe('ConfirmationModal', () => {
  it('should exist as a module', () => {
    expect(() => require('../ConfirmationModal')).not.toThrow()
  })

  it('should render without crashing', () => {
    const Component = require('../ConfirmationModal').default || require('../ConfirmationModal')[Object.keys(require('../ConfirmationModal'))[0]]
    if (typeof Component === 'function') {
      expect(() => render(<Component />)).not.toThrow()
    }
  })
})
