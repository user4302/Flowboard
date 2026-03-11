import React from 'react'
import { render } from '@testing-library/react'

// Basic test for SortableKanbanList
describe('SortableKanbanList', () => {
  it('should exist as a module', () => {
    expect(() => require('../SortableKanbanList')).not.toThrow()
  })

  it('should export SortableKanbanList', () => {
    const module = require('../SortableKanbanList')
    expect(module.SortableKanbanList).toBeDefined()
    expect(typeof module.SortableKanbanList).toBe('function')
  })
})
