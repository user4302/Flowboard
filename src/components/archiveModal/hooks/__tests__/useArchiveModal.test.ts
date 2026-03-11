import { renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useArchiveModal } from '../useArchiveModal'

// Mock dependencies properly
jest.mock('@/store', () => ({
  useBoardStore: () => ({
    currentBoardId: 'board-1',
    getCurrentBoard: () => ({
      id: 'board-1',
      archivedCards: [],
    }),
    unarchiveCard: jest.fn(),
    permanentlyDeleteArchivedCard: jest.fn(),
  }),
}))

jest.mock('@/hooks', () => ({
  useClickOutside: () => ({ current: null }),
}))

describe('useArchiveModal Hook', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useArchiveModal(mockOnClose))
    
    expect(result.current).toBeDefined()
    expect(result.current.isProcessing).toBe(false)
    expect(result.current.deleteConfirmation).toEqual({
      isOpen: false,
      archivedCardId: '',
      cardTitle: '',
    })
    expect(result.current.archivedCards).toEqual([])
    expect(result.current.handleUnarchive).toEqual(expect.any(Function))
    expect(result.current.handlePermanentlyDelete).toEqual(expect.any(Function))
    expect(result.current.confirmPermanentDelete).toEqual(expect.any(Function))
    expect(result.current.closeDeleteConfirmation).toEqual(expect.any(Function))
    expect(result.current.modalRef).toEqual(expect.any(Object))
    expect(result.current.deleteModalRef).toEqual(expect.any(Object))
  })

  it('should handle unarchive card', async () => {
    const { result } = renderHook(() => useArchiveModal(mockOnClose))
    
    await act(async () => {
      await result.current.handleUnarchive('card-1')
    })
    
    expect(result.current.isProcessing).toBe(false)
  })

  it('should open delete confirmation', async () => {
    const { result } = renderHook(() => useArchiveModal(mockOnClose))
    
    await act(async () => {
      result.current.handlePermanentlyDelete('card-1', 'Test Card 1')
    })
    
    expect(result.current.deleteConfirmation).toEqual({
      isOpen: true,
      archivedCardId: 'card-1',
      cardTitle: 'Test Card 1',
    })
  })

  it('should confirm permanent delete', async () => {
    const { result } = renderHook(() => useArchiveModal(mockOnClose))
    
    // Open delete confirmation
    await act(async () => {
      result.current.handlePermanentlyDelete('card-1', 'Test Card 1')
    })
    
    // Confirm delete
    await act(async () => {
      await result.current.confirmPermanentDelete()
    })
    
    expect(result.current.deleteConfirmation.isOpen).toBe(false)
    expect(result.current.isProcessing).toBe(false)
  })

  it('should close delete confirmation', () => {
    const { result } = renderHook(() => useArchiveModal(mockOnClose))
    
    // Open delete confirmation
    act(() => {
      result.current.handlePermanentlyDelete('card-1', 'Test Card 1')
    })
    
    // Close confirmation
    act(() => {
      result.current.closeDeleteConfirmation()
    })
    
    expect(result.current.deleteConfirmation).toEqual({
      isOpen: false,
      archivedCardId: '',
      cardTitle: '',
    })
  })

  it('should handle missing archived cards', () => {
    const { result } = renderHook(() => useArchiveModal(mockOnClose))
    
    expect(result.current.archivedCards).toEqual([])
  })
})
