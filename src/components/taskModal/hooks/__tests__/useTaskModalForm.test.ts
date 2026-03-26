import { renderHook } from '@testing-library/react'
import { useTaskModalForm } from '../useTaskModalForm'
import { Card } from '@/lib/types'

// Basic test for useTaskModalForm
describe('useTaskModalForm', () => {
  it('should exist as a module', () => {
    expect(() => require('../useTaskModalForm')).not.toThrow()
  })

  it('should have exports', () => {
    const module = require('../useTaskModalForm')
    expect(module).toBeDefined()
  })

  describe('priority handling', () => {
    it('should handle card with priority 0', () => {
      const mockCard: Card = {
        id: 'card-1',
        title: 'Test Card',
        description: 'Test Description',
        priority: 0,
        labelIds: [],
        members: [],
        checklists: [],
        completed: false,
        position: 1,
        listId: 'list-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const { result } = renderHook(() => useTaskModalForm({ card: mockCard }))

      expect(result.current.getValues().priority).toBe(0)
    })

    it('should handle card with priority null', () => {
      const mockCard: Card = {
        id: 'card-1',
        title: 'Test Card',
        description: 'Test Description',
        priority: null,
        labelIds: [],
        members: [],
        checklists: [],
        completed: false,
        position: 1,
        listId: 'list-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const { result } = renderHook(() => useTaskModalForm({ card: mockCard }))

      expect(result.current.getValues().priority).toBeNull()
    })

    it('should handle card with priority undefined', () => {
      const mockCard: Card = {
        id: 'card-1',
        title: 'Test Card',
        description: 'Test Description',
        priority: undefined,
        labelIds: [],
        members: [],
        checklists: [],
        completed: false,
        position: 1,
        listId: 'list-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const { result } = renderHook(() => useTaskModalForm({ card: mockCard }))

      expect(result.current.getValues().priority).toBeNull()
    })

    it('should handle card with positive priority', () => {
      const mockCard: Card = {
        id: 'card-1',
        title: 'Test Card',
        description: 'Test Description',
        priority: 50,
        labelIds: [],
        members: [],
        checklists: [],
        completed: false,
        position: 1,
        listId: 'list-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const { result } = renderHook(() => useTaskModalForm({ card: mockCard }))

      expect(result.current.getValues().priority).toBe(50)
    })

    it('should handle null card', () => {
      const { result } = renderHook(() => useTaskModalForm({ card: null }))

      expect(result.current.getValues().priority).toBeNull()
    })
  })
})
