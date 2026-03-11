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
    members: [],
    labels: [],
    archivedCards: [],
    createdAt: new Date(),
    updatedAt: new Date(),
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

      expect(() => exportData(mockBoard)).not.toThrow()
    })

    it('should handle empty board export', () => {
      const mockBoard = createMockBoard()

      expect(() => exportData(mockBoard)).not.toThrow()
    })

    it('should handle board with cards', () => {
      const mockBoard = createMockBoard({
        lists: [
          createMockList({
            cards: [createMockCard()]
          })
        ]
      })

      expect(() => exportData(mockBoard)).not.toThrow()
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
