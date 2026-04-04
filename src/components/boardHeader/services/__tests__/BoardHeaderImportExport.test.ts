import { exportData, importData } from '../BoardHeaderImportExport'
import { Board, List, Card, Label } from '@/lib/types'

// Mock browser APIs
Object.defineProperty(URL, 'createObjectURL', {
  value: jest.fn(() => 'mock-url'),
  writable: true,
})

Object.defineProperty(URL, 'revokeObjectURL', {
  value: jest.fn(),
  writable: true,
})

// Mock document methods
Object.defineProperty(document, 'createElement', {
  value: jest.fn(() => ({
    href: '',
    download: '',
    click: jest.fn(),
  })),
  writable: true,
})

Object.defineProperty(document.body, 'appendChild', {
  value: jest.fn(),
  writable: true,
})

Object.defineProperty(document.body, 'removeChild', {
  value: jest.fn(),
  writable: true,
})

// Mock FileReader
global.FileReader = class {
  readAsText = jest.fn(() => { })
  result = '{}'
  addEventListener = jest.fn()
  readyState = 2
} as any

describe('BoardHeaderImportExport', () => {
  const createMockCard = (overrides: Partial<Card> = {}): Card => ({
    id: 'card1',
    title: 'Test Card',
    labelIds: [],
    members: [],
    checklists: [],
    completed: false,
    position: 0,
    listId: 'list1',
    priority: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  })

  const createMockList = (overrides: Partial<List> = {}): List => ({
    id: 'list1',
    title: 'Test List',
    cards: [],
    position: 0,
    ...overrides
  })

  const createMockLabel = (overrides: Partial<Label> = {}): Label => ({
    id: 'label1',
    text: 'Test Label',
    color: '#ff0000',
    ...overrides
  })

  const createMockBoard = (overrides: Partial<Board> = {}): Board => ({
    id: 'board1',
    name: 'Test Board',
    lists: [],
    labels: [],
    archivedCards: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [],
    ...overrides
  })

  describe('exportData', () => {
    it('should export exportData function', () => {
      expect(typeof exportData).toBe('function')
    })

    it('should handle board export', () => {
      const mockBoard = createMockBoard({
        lists: [createMockList()],
        labels: [createMockLabel()]
      })

      expect(() => exportData({ board: mockBoard })).not.toThrow()
    })

    it('should handle empty board export', () => {
      const mockBoard = createMockBoard()

      expect(() => exportData({ board: mockBoard })).not.toThrow()
    })

    it('should handle board with cards', () => {
      const mockBoard = createMockBoard({
        lists: [
          createMockList({
            cards: [createMockCard()]
          })
        ]
      })

      expect(() => exportData({ board: mockBoard })).not.toThrow()
    })

    it('should export cards with labelIds but without labels property', () => {
      const mockCard = createMockCard({
        labelIds: ['label1', 'label2'],
        // Simulate the problematic case where card might have both properties
        ...(Object.defineProperty({}, 'labels', { value: [{ id: 'label1', text: 'Test', color: 'bg-red-500' }], enumerable: true }))
      })

      const mockBoard = createMockBoard({
        lists: [
          createMockList({
            cards: [mockCard]
          })
        ],
        labels: [createMockLabel()]
      })

      // Mock JSON.stringify to capture the exported data
      const jsonString = JSON.stringify(mockBoard)
      const mockBlob = new Blob([jsonString], { type: 'application/json' })
      const mockUrl = 'mock-url'

      // Mock the download process to capture exported data
      let exportedData: any = null
      const originalStringify = JSON.stringify
      JSON.stringify = jest.fn((obj: any, replacer?: any, space?: any) => {
        const result = originalStringify(obj, replacer, space)
        exportedData = JSON.parse(result)
        return result
      }) as jest.MockedFunction<typeof JSON.stringify>

      exportData({ board: mockBoard })

      // Restore original JSON.stringify
      JSON.stringify = originalStringify

      // Verify exported structure
      expect(exportedData).toBeDefined()
      expect(exportedData.lists).toBeDefined()
      expect(exportedData.lists[0].cards).toBeDefined()
      expect(exportedData.lists[0].cards[0]).toBeDefined()

      const exportedCard = exportedData.lists[0].cards[0]

      // Should include labelIds
      expect(exportedCard.labelIds).toEqual(['label1', 'label2'])

      // Should NOT include labels property (this was causing duplication)
      expect(exportedCard.labels).toBeUndefined()

      // Should include other expected properties
      expect(exportedCard.id).toBe('card1')
      expect(exportedCard.title).toBe('Test Card')
      expect(exportedCard.checklists).toBeDefined()
      expect(exportedCard.members).toBeDefined()
    })

    it('should export all required card properties', () => {
      const mockCard = createMockCard({
        description: 'Test description',
        labelIds: ['label1'],
        members: ['user1'],
        checklists: [{
          id: 'checklist1',
          name: 'Test Checklist',
          items: [],
          position: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }],
        startDate: new Date('2026-03-27'),
        dueDate: new Date('2026-03-28'),
        completed: true,
        position: 1,
        priority: 5
      })

      const mockBoard = createMockBoard({
        lists: [
          createMockList({
            cards: [mockCard]
          })
        ]
      })

      // Mock the download process to capture exported data
      let exportedData: any = null
      const originalStringify = JSON.stringify
      JSON.stringify = jest.fn((obj: any, replacer?: any, space?: any) => {
        const result = originalStringify(obj, replacer, space)
        exportedData = JSON.parse(result)
        return result
      }) as jest.MockedFunction<typeof JSON.stringify>

      exportData({ board: mockBoard })

      // Restore original JSON.stringify
      JSON.stringify = originalStringify

      const exportedCard = exportedData.lists[0].cards[0]

      // Verify all required properties are present
      expect(exportedCard.id).toBe('card1')
      expect(exportedCard.title).toBe('Test Card')
      expect(exportedCard.description).toBe('Test description')
      expect(exportedCard.labelIds).toEqual(['label1'])
      expect(exportedCard.members).toEqual(['user1'])
      expect(exportedCard.checklists).toBeDefined()
      expect(exportedCard.startDate).toBeDefined()
      expect(exportedCard.dueDate).toBeDefined()
      expect(exportedCard.completed).toBe(true)
      expect(exportedCard.position).toBe(1)
      expect(exportedCard.listId).toBe('list1')
      expect(exportedCard.priority).toBe(5)
      expect(exportedCard.createdAt).toBeDefined()
      expect(exportedCard.updatedAt).toBeDefined()

      // Verify labels property is not present
      expect(exportedCard.labels).toBeUndefined()
    })
  })

  describe('importData', () => {
    it('should export importData function', () => {
      expect(typeof importData).toBe('function')
    })

    it('should handle file import', () => {
      const mockFile = new File(['{}'], 'test.json', { type: 'application/json' })
      const mockSetCurrentBoard = jest.fn()

      expect(() => importData(mockFile, mockSetCurrentBoard)).not.toThrow()
    })

    it('should handle invalid file type', () => {
      const mockFile = new File(['{}'], 'test.txt', { type: 'text/plain' })
      const mockSetCurrentBoard = jest.fn()

      expect(() => importData(mockFile, mockSetCurrentBoard)).not.toThrow()
    })

    it('should handle valid JSON file', () => {
      const validData = {
        name: 'Test Board',
        lists: [],
        labels: []
      }
      const mockFile = new File([JSON.stringify(validData)], 'test.json', { type: 'application/json' })
      const mockSetCurrentBoard = jest.fn()

      expect(() => importData(mockFile, mockSetCurrentBoard)).not.toThrow()
    })
  })
})
