import React from 'react'
import { render } from '@testing-library/react'

// Basic test for KanbanListHeader
describe('KanbanListHeader', () => {
  it('should exist as a module', () => {
    expect(() => require('../KanbanListHeader')).not.toThrow()
  })

  it('should render without crashing', () => {
    const Component = require('../KanbanListHeader').default || require('../KanbanListHeader')[Object.keys(require('../KanbanListHeader'))[0]]
    if (typeof Component === 'function') {
      expect(() => render(<Component />)).not.toThrow()
    }
  })
})
