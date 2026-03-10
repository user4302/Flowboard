import {
  CardJSON,
  validateCardJSON,
  cardToJSON,
  jsonToCardData,
  downloadCardJSON,
  readCardJSONFile,
} from '../cardJsonUtils'
import { Card, Label, User } from '../types'

// Mock DOM methods for downloadCardJSON
const mockCreateElement = jest.fn()
const mockCreateObjectURL = jest.fn()
const mockRevokeObjectURL = jest.fn()
const mockAppendChild = jest.fn()
const mockRemoveChild = jest.fn()
const mockClick = jest.fn()

Object.defineProperty(document, 'createElement', {
  value: mockCreateElement,
})
Object.defineProperty(URL, 'createObjectURL', {
  value: mockCreateObjectURL,
})
Object.defineProperty(URL, 'revokeObjectURL', {
  value: mockRevokeObjectURL,
})
Object.defineProperty(document.body, 'appendChild', {
  value: mockAppendChild,
})
Object.defineProperty(document.body, 'removeChild', {
  value: mockRemoveChild,
})

describe('cardJsonUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('validateCardJSON', () => {
    it('should return false for null/undefined', () => {
      expect(validateCardJSON(null)).toBe(false)
      expect(validateCardJSON(undefined)).toBe(false)
    })

    it('should return false for non-object values', () => {
      expect(validateCardJSON('string')).toBe(false)
      expect(validateCardJSON(123)).toBe(false)
      expect(validateCardJSON(true)).toBe(false)
      expect(validateCardJSON([])).toBe(false)
    })

    it('should return false for empty title', () => {
      expect(validateCardJSON({ title: '' })).toBe(false)
      expect(validateCardJSON({ title: '   ' })).toBe(false)
    })

    it('should return false for non-string title', () => {
      expect(validateCardJSON({ title: 123 })).toBe(false)
      expect(validateCardJSON({ title: null })).toBe(false)
      expect(validateCardJSON({ title: {} })).toBe(false)
    })

    it('should return false for invalid description', () => {
      expect(validateCardJSON({ title: 'Test', description: 123 })).toBe(false)
      expect(validateCardJSON({ title: 'Test', description: {} })).toBe(false)
    })

    it('should return false for invalid labels array', () => {
      expect(validateCardJSON({ title: 'Test', labels: 'not-array' })).toBe(false)
      expect(validateCardJSON({ title: 'Test', labels: [123] })).toBe(false)
      expect(validateCardJSON({ title: 'Test', labels: [{ text: 123, color: 'red' }] })).toBe(false)
      expect(validateCardJSON({ title: 'Test', labels: [{ text: 'label', color: 123 }] })).toBe(false)
      expect(validateCardJSON({ title: 'Test', labels: [{ text: 'label' }] })).toBe(false)
    })

    it('should return false for invalid members array', () => {
      expect(validateCardJSON({ title: 'Test', members: 'not-array' })).toBe(false)
      expect(validateCardJSON({ title: 'Test', members: [123] })).toBe(false)
      expect(validateCardJSON({ title: 'Test', members: [{ name: 123 }] })).toBe(false)
      expect(validateCardJSON({ title: 'Test', members: [{ name: 'John', email: 123 }] })).toBe(false)
      expect(validateCardJSON({ title: 'Test', members: [{}] })).toBe(false)
    })

    it('should return false for invalid dates', () => {
      expect(validateCardJSON({ title: 'Test', startDate: 123 })).toBe(false)
      expect(validateCardJSON({ title: 'Test', startDate: 'invalid-date' })).toBe(false)
      expect(validateCardJSON({ title: 'Test', startDate: '2026-03-10' })).toBe(false) // Missing time
      expect(validateCardJSON({ title: 'Test', dueDate: 'invalid-date' })).toBe(false)
    })

    it('should return false for invalid checklist', () => {
      expect(validateCardJSON({ title: 'Test', checklist: 'not-array' })).toBe(false)
      expect(validateCardJSON({ title: 'Test', checklist: [123] })).toBe(false)
      expect(validateCardJSON({ title: 'Test', checklist: [{ text: 123, done: true }] })).toBe(false)
      expect(validateCardJSON({ title: 'Test', checklist: [{ text: 'item', done: 'yes' }] })).toBe(false)
      expect(validateCardJSON({ title: 'Test', checklist: [{ text: 'item' }] })).toBe(false)
    })

    it('should return true for valid minimal card', () => {
      expect(validateCardJSON({ title: 'Test Card' })).toBe(true)
    })

    it('should return true for valid complete card', () => {
      const validCard = {
        title: 'Test Card',
        description: 'Test description',
        labels: [
          { text: 'Bug', color: 'bg-red-500' },
          { text: 'Feature', color: 'bg-blue-500' },
        ],
        members: [
          { name: 'John Doe', email: 'john@example.com' },
          { name: 'Jane Smith' },
        ],
        startDate: '2026-03-10T12:00:00.000Z',
        dueDate: '2026-03-15T12:00:00.000Z',
        checklist: [
          { text: 'Task 1', done: true },
          { text: 'Task 2', done: false },
        ],
      }
      expect(validateCardJSON(validCard)).toBe(true)
    })

    it('should handle empty arrays', () => {
      const validCard = {
        title: 'Test Card',
        labels: [],
        members: [],
        checklist: [],
      }
      expect(validateCardJSON(validCard)).toBe(true)
    })
  })

  describe('cardToJSON', () => {
    const mockBoardLabels: Label[] = [
      { id: 'label1', text: 'Bug', color: 'bg-red-500' },
      { id: 'label2', text: 'Feature', color: 'bg-blue-500' },
    ]

    const mockBoardMembers: User[] = [
      { id: 'user1', name: 'John Doe', email: 'john@example.com' },
      { id: 'user2', name: 'Jane Smith' },
    ]

    const mockCard: Card = {
      id: 'card1',
      title: 'Test Card',
      description: 'Test description',
      labelIds: ['label1', 'label2', 'nonexistent'],
      members: ['user1', 'nonexistent'],
      startDate: new Date('2026-03-10T12:00:00.000Z'),
      dueDate: new Date('2026-03-15T12:00:00.000Z'),
      checklists: [
        {
          id: 'checklist1',
          name: 'Tasks',
          items: [
            { id: 'item1', text: 'Task 1', done: true },
            { id: 'item2', text: 'Task 2', done: false },
          ],
          position: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      completed: false,
      position: 0,
      listId: 'list1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should convert card to JSON format', () => {
      const result = cardToJSON(mockCard, mockBoardLabels, mockBoardMembers)

      expect(result.title).toBe(mockCard.title)
      expect(result.description).toBe(mockCard.description)
      expect(result.labels).toHaveLength(2) // Only existing labels
      expect(result.members).toHaveLength(1) // Only existing members
      expect(result.startDate).toBe(mockCard.startDate?.toISOString())
      expect(result.dueDate).toBe(mockCard.dueDate?.toISOString())
      expect(result.checklist).toHaveLength(2) // All checklist items
    })

    it('should handle card without dates', () => {
      const cardWithoutDates = { ...mockCard }
      delete cardWithoutDates.startDate
      delete cardWithoutDates.dueDate

      const result = cardToJSON(cardWithoutDates, mockBoardLabels, mockBoardMembers)

      expect(result.startDate).toBeUndefined()
      expect(result.dueDate).toBeUndefined()
    })

    it('should handle card without checklists', () => {
      const cardWithoutChecklists = { ...mockCard, checklists: [] }

      const result = cardToJSON(cardWithoutChecklists, mockBoardLabels, mockBoardMembers)

      expect(result.checklist).toEqual([])
    })

    it('should handle card without description', () => {
      const cardWithoutDesc = { ...mockCard }
      delete cardWithoutDesc.description

      const result = cardToJSON(cardWithoutDesc, mockBoardLabels, mockBoardMembers)

      expect(result.description).toBeUndefined()
    })

    it('should handle empty board labels and members', () => {
      const result = cardToJSON(mockCard, [], [])

      expect(result.labels).toEqual([])
      expect(result.members).toEqual([])
    })
  })

  describe('jsonToCardData', () => {
    const mockBoardLabels: Label[] = [
      { id: 'label1', text: 'Bug', color: 'bg-red-500' },
      { id: 'label2', text: 'Feature', color: 'bg-blue-500' },
    ]

    const mockBoardMembers: User[] = [
      { id: 'user1', name: 'John Doe', email: 'john@example.com' },
      { id: 'user2', name: 'Jane Smith' },
    ]

    const mockCardJSON: CardJSON = {
      title: 'Test Card',
      description: 'Test description',
      labels: [
        { text: 'Bug', color: 'bg-red-500' },
        { text: 'Feature', color: 'bg-blue-500' },
        { text: 'Nonexistent', color: 'bg-yellow-500' },
      ],
      members: [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith' },
        { name: 'Nonexistent User' },
      ],
      startDate: '2026-03-10T12:00:00.000Z',
      dueDate: '2026-03-15T12:00:00.000Z',
      checklist: [
        { text: 'Task 1', done: true },
        { text: 'Task 2', done: false },
      ],
    }

    it('should convert JSON to card data', () => {
      const result = jsonToCardData(mockCardJSON, mockBoardLabels, mockBoardMembers)

      expect(result.title).toBe(mockCardJSON.title)
      expect(result.description).toBe(mockCardJSON.description)
      expect(result.labelIds).toHaveLength(2) // Only matching labels
      expect(result.members).toHaveLength(2) // Only matching members
      expect(result.startDate).toEqual(new Date(mockCardJSON.startDate!))
      expect(result.dueDate).toEqual(new Date(mockCardJSON.dueDate!))
      expect(result.checklists).toHaveLength(1)
      expect(result.checklists[0].items).toHaveLength(2)
      expect(result.completed).toBe(false)
    })

    it('should handle JSON without dates', () => {
      const jsonWithoutDates = { ...mockCardJSON }
      delete jsonWithoutDates.startDate
      delete jsonWithoutDates.dueDate

      const result = jsonToCardData(jsonWithoutDates, mockBoardLabels, mockBoardMembers)

      expect(result.startDate).toBeUndefined()
      expect(result.dueDate).toBeUndefined()
    })

    it('should handle JSON without description', () => {
      const jsonWithoutDesc = { ...mockCardJSON }
      delete jsonWithoutDesc.description

      const result = jsonToCardData(jsonWithoutDesc, mockBoardLabels, mockBoardMembers)

      expect(result.description).toBeUndefined()
    })

    it('should handle empty arrays', () => {
      const jsonWithEmptyArrays = {
        title: 'Test Card',
        labels: [],
        members: [],
        checklist: [],
      }

      const result = jsonToCardData(jsonWithEmptyArrays, mockBoardLabels, mockBoardMembers)

      expect(result.labelIds).toEqual([])
      expect(result.members).toEqual([])
      expect(result.checklists).toHaveLength(1) // Still creates one checklist
      expect(result.checklists[0].items).toEqual([])
    })

    it('should match members by name when email is not provided', () => {
      const jsonWithMemberWithoutEmail = {
        title: 'Test Card',
        labels: [],
        members: [{ name: 'Jane Smith' }],
        checklist: [],
      }

      const result = jsonToCardData(jsonWithMemberWithoutEmail, mockBoardLabels, mockBoardMembers)

      expect(result.members).toContain('user2')
    })

    it('should not match member if email does not match', () => {
      const jsonWithWrongEmail = {
        title: 'Test Card',
        labels: [],
        members: [{ name: 'John Doe', email: 'wrong@example.com' }],
        checklist: [],
      }

      const result = jsonToCardData(jsonWithWrongEmail, mockBoardLabels, mockBoardMembers)

      expect(result.members).toEqual([])
    })
  })

  describe('downloadCardJSON', () => {
    const mockCardJSON: CardJSON = {
      title: 'Test Card',
      labels: [],
      members: [],
      checklist: [],
    }

    const mockLink = {
      href: '',
      download: '',
      click: mockClick,
    }

    beforeEach(() => {
      mockCreateElement.mockReturnValue(mockLink)
      mockCreateObjectURL.mockReturnValue('mock-url')
    })

    it('should download JSON file', () => {
      downloadCardJSON(mockCardJSON, 'test-card.json')

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockCreateObjectURL).toHaveBeenCalledWith(
        expect.any(Blob)
      )
      expect(mockLink.href).toBe('mock-url')
      expect(mockLink.download).toBe('test-card.json')
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink)
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalledWith(mockLink)
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-url')
    })

    it('should create JSON blob with correct content', () => {
      downloadCardJSON(mockCardJSON, 'test-card.json')

      const blobCall = mockCreateObjectURL.mock.calls[0][0] as Blob
      expect(blobCall.type).toBe('application/json')

      // Verify blob exists and has correct size
      expect(blobCall).toBeInstanceOf(Blob)
      expect(blobCall.size).toBeGreaterThan(0)
    })
  })

  describe('readCardJSONFile', () => {
    const mockValidJSON: CardJSON = {
      title: 'Test Card',
      labels: [],
      members: [],
      checklist: [],
    }

    it('should read and validate JSON file', async () => {
      const mockFile = {
        text: jest.fn().mockResolvedValue(JSON.stringify(mockValidJSON)),
      } as unknown as File

      const result = await readCardJSONFile(mockFile)

      expect(result).toEqual(mockValidJSON)
    })

    it('should throw error for invalid JSON format', async () => {
      const mockFile = {
        text: jest.fn().mockResolvedValue('invalid json'),
      } as unknown as File

      await expect(readCardJSONFile(mockFile)).rejects.toThrow()
    })

    it('should throw error for valid JSON but invalid card format', async () => {
      const invalidCardJSON = { notTitle: 'Missing title field' }
      const mockFile = {
        text: jest.fn().mockResolvedValue(JSON.stringify(invalidCardJSON)),
      } as unknown as File

      await expect(readCardJSONFile(mockFile)).rejects.toThrow(
        'Invalid card JSON format'
      )
    })

    it('should handle file reading errors', async () => {
      const mockFile = {
        text: jest.fn().mockRejectedValue(new Error('Read error')),
      } as unknown as File

      await expect(readCardJSONFile(mockFile)).rejects.toThrow('Read error')
    })
  })
})
