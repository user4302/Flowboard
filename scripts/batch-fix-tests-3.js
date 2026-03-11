// Fix remaining component tests that just need proper props
const fs = require('fs');

// Fix TimelineGrid test
const timelineGridTest = `import React from 'react'
import { render } from '@testing-library/react'
import { TimelineGrid } from '../TimelineGrid'
import { Card } from '@/lib/types'

describe('TimelineGrid', () => {
  const createMockCard = (overrides: Partial<Card> = {}): Card => ({
    id: 'card1',
    title: 'Test Task',
    labelIds: [],
    members: [],
    checklists: [],
    completed: false,
    position: 0,
    listId: 'list1',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  })

  const mockProps = {
    tasks: [createMockCard()],
    dateRange: [new Date()],
    onTaskClick: jest.fn(),
    hiddenTasksBefore: [],
    hiddenTasksAfter: []
  }

  it('should render without crashing', () => {
    expect(() => render(<TimelineGrid {...mockProps} />)).not.toThrow()
  })
})`;

fs.writeFileSync('src/components/views/timeline/components/__tests__/TimelineGrid.test.tsx', timelineGridTest);

// Fix TimelineListLane test
const timelineListLaneTest = `import React from 'react'
import { render } from '@testing-library/react'
import { TimelineListLane } from '../TimelineListLane'
import { Card } from '@/lib/types'

describe('TimelineListLane', () => {
  const createMockCard = (overrides: Partial<Card> = {}): Card => ({
    id: 'card1',
    title: 'Test Task',
    labelIds: [],
    members: [],
    checklists: [],
    completed: false,
    position: 0,
    listId: 'list1',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  })

  const mockProps = {
    cards: [createMockCard()],
    hiddenTasksBefore: [],
    hiddenTasksAfter: []
  }

  it('should render without crashing', () => {
    expect(() => render(<TimelineListLane {...mockProps} />)).not.toThrow()
  })
})`;

fs.writeFileSync('src/components/views/timeline/components/__tests__/TimelineListLane.test.tsx', timelineListLaneTest);

// Fix TimelineQueue test
const timelineQueueTest = `import React from 'react'
import { render } from '@testing-library/react'
import { TimelineQueue } from '../TimelineQueue'
import { Card } from '@/lib/types'

describe('TimelineQueue', () => {
  const createMockCard = (overrides: Partial<Card> = {}): Card => ({
    id: 'card1',
    title: 'Test Task',
    labelIds: [],
    members: [],
    checklists: [],
    completed: false,
    position: 0,
    listId: 'list1',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  })

  const mockProps = {
    queuedTasks: [createMockCard()],
    onTaskClick: jest.fn()
  }

  it('should render without crashing', () => {
    expect(() => render(<TimelineQueue {...mockProps} />)).not.toThrow()
  })
})`;

fs.writeFileSync('src/components/views/timeline/components/__tests__/TimelineQueue.test.tsx', timelineQueueTest);

// Fix TimelineTaskLane test
const timelineTaskLaneTest = `import React from 'react'
import { render } from '@testing-library/react'
import { TimelineTaskLane } from '../TimelineTaskLane'
import { Card } from '@/lib/types'

describe('TimelineTaskLane', () => {
  const createMockCard = (overrides: Partial<Card> = {}): Card => ({
    id: 'card1',
    title: 'Test Task',
    labelIds: [],
    members: [],
    checklists: [],
    completed: false,
    position: 0,
    listId: 'list1',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  })

  const mockProps = {
    tasks: [createMockCard()],
    hiddenTasksBefore: [],
    hiddenTasksAfter: []
  }

  it('should render without crashing', () => {
    expect(() => render(<TimelineTaskLane {...mockProps} />)).not.toThrow()
  })
})`;

fs.writeFileSync('src/components/views/timeline/components/__tests__/TimelineTaskLane.test.tsx', timelineTaskLaneTest);

console.log('Fixed 4 more timeline tests');
