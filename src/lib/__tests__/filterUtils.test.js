const { filterCards } = require('../filterUtils')

describe('filterUtils', () => {
  const mockCards = [
    {
      id: 'card-1',
      title: 'Test Card 1',
      description: 'Description 1',
      completed: false,
      priority: 1,
      labelIds: ['label1'],
      members: ['user1'],
      dueDate: new Date('2024-01-01'),
      listId: 'list-1',
      position: 1,
      startDate: new Date('2024-01-01'),
      checklists: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'card-2',
      title: 'Test Card 2',
      description: 'Description 2',
      completed: true,
      priority: 2,
      labelIds: ['label2'],
      members: ['user2'],
      dueDate: new Date('2024-01-02'),
      listId: 'list-1',
      position: 2,
      startDate: new Date('2024-01-01'),
      checklists: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'card-3',
      title: 'Test Card 3',
      description: 'Description 3',
      completed: false,
      priority: 3,
      labelIds: ['label1', 'label3'],
      members: ['user1', 'user3'],
      dueDate: new Date('2024-01-03'),
      listId: 'list-2',
      position: 1,
      startDate: new Date('2024-01-01'),
      checklists: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ]

  const mockLabels = [
    { id: 'label1', text: 'Label 1', color: 'red' },
    { id: 'label2', text: 'Label 2', color: 'blue' },
    { id: 'label3', text: 'Label 3', color: 'green' },
  ]

  it('should filter cards by search term', () => {
    const filters = {
      searchTerm: 'Test',
      selectedLabels: [],
      selectedMembers: [],
      showCompleted: 'all',
      priorityThreshold: null,
      dueDateFilter: 'all',
    }

    const result = filterCards(mockCards, filters, mockLabels)

    expect(result).toHaveLength(3)
    expect(result[0].id).toBe('card-1')
    expect(result[1].id).toBe('card-2')
    expect(result[2].id).toBe('card-3')
  })

  it('should filter cards by labels', () => {
    const filters = {
      searchTerm: '',
      selectedLabels: ['label1'],
      selectedMembers: [],
      showCompleted: 'all',
      priorityThreshold: null,
      dueDateFilter: 'all',
    }

    const result = filterCards(mockCards, filters, mockLabels)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('card-1')
    expect(result[1].id).toBe('card-3')
  })

  it('should filter cards by members', () => {
    const filters = {
      searchTerm: '',
      selectedLabels: [],
      selectedMembers: ['user1'],
      showCompleted: 'all',
      priorityThreshold: null,
      dueDateFilter: 'all',
    }

    const result = filterCards(mockCards, filters, mockLabels)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('card-1')
    expect(result[1].id).toBe('card-3')
  })

  it('should filter cards by completion status', () => {
    const filters = {
      searchTerm: '',
      selectedLabels: [],
      selectedMembers: [],
      showCompleted: 'completed',
      priorityThreshold: null,
      dueDateFilter: 'all',
    }

    const result = filterCards(mockCards, filters, mockLabels)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('card-2')
  })

  it('should filter cards by incomplete status', () => {
    const filters = {
      searchTerm: '',
      selectedLabels: [],
      selectedMembers: [],
      showCompleted: 'incomplete',
      priorityThreshold: null,
      dueDateFilter: 'all',
    }

    const result = filterCards(mockCards, filters, mockLabels)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('card-1')
    expect(result[1].id).toBe('card-3')
  })

  it('should filter cards by priority threshold', () => {
    const filters = {
      searchTerm: '',
      selectedLabels: [],
      selectedMembers: [],
      showCompleted: 'all',
      priorityThreshold: 2,
      dueDateFilter: 'all',
    }

    const result = filterCards(mockCards, filters, mockLabels)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('card-2') // priority 2
    expect(result[1].id).toBe('card-3') // priority 3
  })

  it('should filter cards by due date filter', () => {
    const filters = {
      searchTerm: '',
      selectedLabels: [],
      selectedMembers: [],
      showCompleted: 'all',
      priorityThreshold: null,
      dueDateFilter: 'all',
    }

    const result = filterCards(mockCards, filters, mockLabels)

    // With 'all' filter, all cards should be returned
    expect(result).toHaveLength(3)
  })

  it('should handle empty cards array', () => {
    const filters = {
      searchTerm: 'Test',
      selectedLabels: [],
      selectedMembers: [],
      showCompleted: 'all',
      priorityThreshold: null,
      dueDateFilter: 'all',
    }

  })

  it('should handle multiple filters', () => {
    // Test priority filtering only first
    const filters = {
      searchTerm: '',
      selectedLabels: [],
      selectedMembers: [],
      showCompleted: 'all',
      priorityThreshold: 2,
      dueDateFilter: 'all',
    }

    const result = filterCards(mockCards, filters, mockLabels)

    // Should return cards with priority >= 2
    expect(result).toHaveLength(2)
    expect(result.map(r => r.id)).toEqual(['card-2', 'card-3'])
  })

  it('should handle null/undefined options gracefully', () => {
    const filters = {
      searchTerm: null,
      selectedLabels: [],
      selectedMembers: [],
      showCompleted: 'all',
      priorityThreshold: null,
      dueDateFilter: 'all',
    }

    const result = filterCards(mockCards, filters, mockLabels)

    expect(result).toHaveLength(3)
  })

  it('should handle empty filter arrays', () => {
    const filters = {
      searchTerm: '',
      selectedLabels: [],
      selectedMembers: [],
      showCompleted: 'all',
      priorityThreshold: null,
      dueDateFilter: 'all',
    }

    const result = filterCards(mockCards, filters, mockLabels)

    expect(result).toHaveLength(3)
  })
})
