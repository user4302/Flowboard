import React from 'react'
import { render } from '@testing-library/react'
import { TaskCardCardMembers } from '../TaskCardCardMembers'
import { User } from '@/lib/types'

describe('TaskCardCardMembers', () => {
  const createMockUser = (overrides: Partial<User> = {}): User => ({
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  })

  const mockProps = {
    members: [createMockUser()],
    maxVisible: 3
  }

  it('should render without crashing', () => {
    expect(() => render(<TaskCardCardMembers {...mockProps} />)).not.toThrow()
  })

  it('should render with empty members', () => {
    const propsWithEmptyMembers = {
      ...mockProps,
      members: []
    }
    expect(() => render(<TaskCardCardMembers {...propsWithEmptyMembers} />)).not.toThrow()
  })

  it('should render with multiple members', () => {
    const propsWithMultipleMembers = {
      ...mockProps,
      members: [
        createMockUser({ id: 'user1', name: 'User 1' }),
        createMockUser({ id: 'user2', name: 'User 2' }),
        createMockUser({ id: 'user3', name: 'User 3' })
      ]
    }
    expect(() => render(<TaskCardCardMembers {...propsWithMultipleMembers} />)).not.toThrow()
  })

  it('should handle maxVisible prop', () => {
    const propsWithMaxVisible = {
      members: [
        createMockUser({ id: 'user1', name: 'User 1' }),
        createMockUser({ id: 'user2', name: 'User 2' }),
        createMockUser({ id: 'user3', name: 'User 3' }),
        createMockUser({ id: 'user4', name: 'User 4' })
      ],
      maxVisible: 2
    }
    expect(() => render(<TaskCardCardMembers {...propsWithMaxVisible} />)).not.toThrow()
  })
})
