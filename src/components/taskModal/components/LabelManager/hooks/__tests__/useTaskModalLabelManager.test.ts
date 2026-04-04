import { renderHook, act } from '@testing-library/react';
import { useTaskModalLabelManager } from '../useTaskModalLabelManager';
import { Label } from '@/lib/types';
import { BASIC_LABEL_COLORS } from '@/lib/constants';
import type { LabelManagerView } from '../../../../types/TaskModal.form.types';

// Mock the board store
jest.mock('@/store', () => ({
  useBoardStore: jest.fn()
}));

const mockUseBoardStore = require('@/store').useBoardStore;

// Mock constants
jest.mock('@/lib/constants', () => ({
  BASIC_LABEL_COLORS: ['#ef4444', '#f97316', '#eab308']
}));

describe('useTaskModalLabelManager', () => {
  const mockBoardId = 'board-1';
  const mockCardId = 'card-1';
  const mockSelectedLabelIds: string[] = ['label-1', 'label-2'];

  const mockBoard = {
    id: mockBoardId,
    name: 'Test Board',
    labels: [
      { id: 'label-1', text: 'Label 1', color: '#ef4444' },
      { id: 'label-2', text: 'Label 2', color: '#f97316' },
      { id: 'label-3', text: 'Label 3', color: '#eab308' }
    ]
  };

  const mockBoards = [mockBoard];

  const mockStoreFunctions = {
    addLabelToCard: jest.fn(),
    removeLabelFromCard: jest.fn(),
    createBoardLabel: jest.fn(),
    updateBoardLabel: jest.fn(),
    deleteBoardLabel: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBoardStore.mockReturnValue({
      boards: mockBoards,
      ...mockStoreFunctions
    });
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: mockSelectedLabelIds
      })
    );

    expect(result.current.view).toBe('list');
    expect(result.current.searchTerm).toBe('');
    expect(result.current.editingLabel).toBeNull();
    expect(result.current.labelTitle).toBe('');
    expect(result.current.labelColor).toBe('#ef4444');
    expect(result.current.boardLabels).toEqual(mockBoard.labels);
    expect(result.current.filteredLabels).toEqual(mockBoard.labels);
  });

  it('should handle board not found', () => {
    mockUseBoardStore.mockReturnValue({
      boards: [],
      ...mockStoreFunctions
    });

    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: 'non-existent-board',
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    expect(result.current.boardLabels).toEqual([]);
    expect(result.current.filteredLabels).toEqual([]);
  });

  it('should filter labels based on search term', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.setSearchTerm('Label 1');
    });

    expect(result.current.filteredLabels).toHaveLength(1);
    expect(result.current.filteredLabels[0].text).toBe('Label 1');
  });

  it('should filter labels case-insensitively', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.setSearchTerm('label');
    });

    expect(result.current.filteredLabels).toHaveLength(3);
  });

  it('should handle empty search term', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.setSearchTerm('');
    });

    expect(result.current.filteredLabels).toHaveLength(3);
  });

  it('should handleToggleLabel - remove label when already selected', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: ['label-1']
      })
    );

    act(() => {
      result.current.handleToggleLabel('label-1');
    });

    expect(mockStoreFunctions.removeLabelFromCard).toHaveBeenCalledWith(mockBoardId, mockCardId, 'label-1');
    expect(mockStoreFunctions.addLabelToCard).not.toHaveBeenCalled();
  });

  it('should handleToggleLabel - add label when not selected', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.handleToggleLabel('label-1');
    });

    expect(mockStoreFunctions.addLabelToCard).toHaveBeenCalledWith(mockBoardId, mockCardId, 'label-1');
    expect(mockStoreFunctions.removeLabelFromCard).not.toHaveBeenCalled();
  });

  it('should handleCreateLabel - create label with valid title', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.setLabelTitle('New Label');
      result.current.setLabelColor('bg-red-100');
    });

    act(() => {
      result.current.handleCreateLabel();
    });

    expect(mockStoreFunctions.createBoardLabel).toHaveBeenCalledWith(mockBoardId, {
      text: 'New Label',
      color: 'bg-red-100'
    });
    expect(result.current.view).toBe('list');
    expect(result.current.labelTitle).toBe('');
  });

  it('should handleCreateLabel - not create label with empty title', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    const initialView = result.current.view;

    act(() => {
      result.current.setLabelTitle('   '); // whitespace only
    });

    act(() => {
      result.current.handleCreateLabel();
    });

    expect(mockStoreFunctions.createBoardLabel).not.toHaveBeenCalled();
    // View should remain the same since create failed
    expect(result.current.view).toBe(initialView);
  });

  it('should handleUpdateLabel - update label with valid title and editing label', () => {
    const editingLabel: Label = { id: 'label-1', text: 'Old Label', color: 'bg-green-100' };

    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.openEdit(editingLabel);
      result.current.setLabelTitle('Updated Label');
      result.current.setLabelColor('bg-blue-100');
    });

    act(() => {
      result.current.handleUpdateLabel();
    });

    expect(mockStoreFunctions.updateBoardLabel).toHaveBeenCalledWith(mockBoardId, 'label-1', {
      text: 'Updated Label',
      color: 'bg-blue-100'
    });
    expect(result.current.view).toBe('list');
    expect(result.current.editingLabel).toBeNull();
  });

  it('should handleUpdateLabel - not update label without editing label', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    const initialView = result.current.view;

    act(() => {
      result.current.setLabelTitle('Updated Label');
    });

    act(() => {
      result.current.handleUpdateLabel();
    });

    expect(mockStoreFunctions.updateBoardLabel).not.toHaveBeenCalled();
    // View should remain the same since update failed
    expect(result.current.view).toBe(initialView);
  });

  it('should handleUpdateLabel - not update label with empty title', () => {
    const editingLabel: Label = { id: 'label-1', text: 'Old Label', color: 'bg-green-100' };

    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.openEdit(editingLabel);
      result.current.setLabelTitle('');
    });

    act(() => {
      result.current.handleUpdateLabel();
    });

    expect(mockStoreFunctions.updateBoardLabel).not.toHaveBeenCalled();
    expect(result.current.view).not.toBe('list');
  });

  it('should handleDeleteLabel', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.setView('edit');
    });

    act(() => {
      result.current.handleDeleteLabel('label-1');
    });

    expect(mockStoreFunctions.deleteBoardLabel).toHaveBeenCalledWith(mockBoardId, 'label-1');
    expect(result.current.view).toBe('list');
  });

  it('should handleDeleteLabel - when not in edit view', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.handleDeleteLabel('label-1');
    });

    expect(mockStoreFunctions.deleteBoardLabel).toHaveBeenCalledWith(mockBoardId, 'label-1');
    expect(result.current.view).toBe('list'); // Should remain in list view
  });

  it('should openEdit', () => {
    const label: Label = { id: 'label-1', text: 'Test Label', color: 'bg-red-100' };

    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.openEdit(label);
    });

    expect(result.current.editingLabel).toBe(label);
    expect(result.current.labelTitle).toBe('Test Label');
    expect(result.current.labelColor).toBe('bg-red-100');
    expect(result.current.view).toBe('edit');
  });

  it('should openCreate', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    // Set some initial state to verify it gets reset
    act(() => {
      result.current.setLabelTitle('Existing Title');
      result.current.setLabelColor('#eab308');
      result.current.setView('edit');
    });

    act(() => {
      result.current.openCreate();
    });

    expect(result.current.labelTitle).toBe('');
    expect(result.current.labelColor).toBe('#ef4444'); // First color in LABEL_COLORS
    expect(result.current.view).toBe('create');
  });

  it('should handle view changes', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    const views: LabelManagerView[] = ['list', 'create', 'edit'];

    views.forEach(view => {
      act(() => {
        result.current.setView(view);
      });
      expect(result.current.view).toBe(view);
    });
  });

  it('should handle label title changes', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.setLabelTitle('New Title');
    });

    expect(result.current.labelTitle).toBe('New Title');
  });

  it('should handle label color changes', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.setLabelColor('bg-yellow-100');
    });

    expect(result.current.labelColor).toBe('bg-yellow-100');
  });

  it('should handle search term changes', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.setSearchTerm('search term');
    });

    expect(result.current.searchTerm).toBe('search term');
  });

  it('should handle empty board labels array', () => {
    mockUseBoardStore.mockReturnValue({
      boards: [{ ...mockBoard, labels: [] }],
      ...mockStoreFunctions
    });

    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    expect(result.current.boardLabels).toEqual([]);
    expect(result.current.filteredLabels).toEqual([]);
  });

  it('should handle board with undefined labels', () => {
    mockUseBoardStore.mockReturnValue({
      boards: [{ ...mockBoard, labels: undefined }],
      ...mockStoreFunctions
    });

    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    expect(result.current.boardLabels).toEqual([]);
    expect(result.current.filteredLabels).toEqual([]);
  });

  it('should return all expected properties and functions', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    const expectedProperties = [
      'view', 'searchTerm', 'editingLabel', 'labelTitle', 'labelColor',
      'boardLabels', 'filteredLabels', 'setView', 'setSearchTerm', 'setLabelTitle',
      'setLabelColor', 'handleToggleLabel', 'handleCreateLabel', 'handleUpdateLabel',
      'handleDeleteLabel', 'openEdit', 'openCreate'
    ];

    expectedProperties.forEach(prop => {
      expect(result.current).toHaveProperty(prop);
    });
  });

  it('should handle complex search filtering', () => {
    const boardWithComplexLabels = {
      ...mockBoard,
      labels: [
        { id: 'label-1', text: 'Bug', color: 'bg-red-100' },
        { id: 'label-2', text: 'Feature', color: 'bg-green-100' },
        { id: 'label-3', text: 'Enhancement', color: 'bg-blue-100' },
        { id: 'label-4', text: 'Documentation', color: 'bg-yellow-100' }
      ]
    };

    mockUseBoardStore.mockReturnValue({
      boards: [boardWithComplexLabels],
      ...mockStoreFunctions
    });

    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.setSearchTerm('Enh');
    });

    expect(result.current.filteredLabels).toHaveLength(1);
    expect(result.current.filteredLabels[0].text).toBe('Enhancement');
  });

  it('should maintain filtered labels when board labels change', () => {
    const { result, rerender } = renderHook(
      ({ boardId, cardId, selectedLabelIds }) =>
        useTaskModalLabelManager({ boardId, cardId, selectedLabelIds }),
      {
        initialProps: {
          boardId: mockBoardId,
          cardId: mockCardId,
          selectedLabelIds: []
        }
      }
    );

    // Set search term
    act(() => {
      result.current.setSearchTerm('Label');
    });

    expect(result.current.filteredLabels).toHaveLength(3);

    // Update board labels
    const updatedBoard = {
      ...mockBoard,
      labels: [
        { id: 'label-1', text: 'Label 1', color: 'bg-green-100' },
        { id: 'label-4', text: 'Label 4', color: 'bg-purple-100' }
      ]
    };

    mockUseBoardStore.mockReturnValue({
      boards: [updatedBoard],
      ...mockStoreFunctions
    });

    rerender({
      boardId: mockBoardId,
      cardId: mockCardId,
      selectedLabelIds: []
    });

    expect(result.current.boardLabels).toHaveLength(2);
    expect(result.current.filteredLabels).toHaveLength(2);
    expect(result.current.filteredLabels.map(l => l.id)).toEqual(['label-1', 'label-4']);
  });

  it('should handle whitespace-only label titles correctly', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    const whitespaceTitles = ['   ', '\t', '\n', ' \t \n '];

    whitespaceTitles.forEach(title => {
      act(() => {
        result.current.setLabelTitle(title);
        result.current.handleCreateLabel();
      });

      expect(mockStoreFunctions.createBoardLabel).not.toHaveBeenCalled();
    });
  });

  it('should handle special characters in search term', () => {
    const boardWithSpecialLabels = {
      ...mockBoard,
      labels: [
        { id: 'label-1', text: 'Bug #123', color: 'bg-red-100' },
        { id: 'label-2', text: 'Feature@home', color: 'bg-green-100' },
        { id: 'label-3', text: 'Enhancement!', color: 'bg-blue-100' }
      ]
    };

    mockUseBoardStore.mockReturnValue({
      boards: [boardWithSpecialLabels],
      ...mockStoreFunctions
    });

    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.setSearchTerm('#');
    });

    expect(result.current.filteredLabels).toHaveLength(1);
    expect(result.current.filteredLabels[0].text).toBe('Bug #123');
  });

  it('should test all return properties are accessible', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    // Test all state properties
    expect(typeof result.current.view).toBe('string');
    expect(typeof result.current.searchTerm).toBe('string');
    expect(typeof result.current.labelTitle).toBe('string');
    expect(typeof result.current.labelColor).toBe('string');
    expect(Array.isArray(result.current.boardLabels)).toBe(true);
    expect(Array.isArray(result.current.filteredLabels)).toBe(true);
    expect(result.current.editingLabel === null || typeof result.current.editingLabel === 'object').toBe(true);

    // Test all setter functions
    expect(typeof result.current.setView).toBe('function');
    expect(typeof result.current.setSearchTerm).toBe('function');
    expect(typeof result.current.setLabelTitle).toBe('function');
    expect(typeof result.current.setLabelColor).toBe('function');

    // Test all action functions
    expect(typeof result.current.handleToggleLabel).toBe('function');
    expect(typeof result.current.handleCreateLabel).toBe('function');
    expect(typeof result.current.handleUpdateLabel).toBe('function');
    expect(typeof result.current.handleDeleteLabel).toBe('function');
    expect(typeof result.current.openEdit).toBe('function');
    expect(typeof result.current.openCreate).toBe('function');
  });

  it('should handle board with null labels', () => {
    mockUseBoardStore.mockReturnValue({
      boards: [{ ...mockBoard, labels: null }],
      ...mockStoreFunctions
    });

    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    expect(result.current.boardLabels).toEqual([]);
    expect(result.current.filteredLabels).toEqual([]);
  });

  it('should handle search with mixed case', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.setSearchTerm('LABEL');
    });

    expect(result.current.filteredLabels).toHaveLength(3);
  });

  it('should handle search with no matches', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.setSearchTerm('nonexistent');
    });

    expect(result.current.filteredLabels).toHaveLength(0);
  });

  it('should test all BASIC_LABEL_COLORS are accessible', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    // Test setting different colors
    const colors: string[] = ['#ef4444', '#f97316', '#eab308'];

    colors.forEach(color => {
      act(() => {
        result.current.setLabelColor(color);
      });
      expect(result.current.labelColor).toBe(color);
    });
  });

  it('should handle delete label when in edit view', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    // Start in edit view
    act(() => {
      result.current.setView('edit');
    });

    act(() => {
      result.current.handleDeleteLabel('label-1');
    });

    expect(mockStoreFunctions.deleteBoardLabel).toHaveBeenCalledWith(mockBoardId, 'label-1');
    expect(result.current.view).toBe('list'); // Should change to list after delete
  });

  it('should handle create label with different colors', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    // Test with different color
    act(() => {
      result.current.setLabelColor('bg-yellow-100');
      result.current.setLabelTitle('Test Label');
    });

    act(() => {
      result.current.handleCreateLabel();
    });

    expect(mockStoreFunctions.createBoardLabel).toHaveBeenCalledWith(mockBoardId, {
      text: 'Test Label',
      color: 'bg-yellow-100'
    });
  });

  it('should handle update label with different color', () => {
    const editingLabel: Label = { id: 'label-1', text: 'Old Label', color: 'bg-green-100' };

    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.openEdit(editingLabel);
      result.current.setLabelTitle('Updated Label');
      result.current.setLabelColor('bg-red-100');
    });

    act(() => {
      result.current.handleUpdateLabel();
    });

    expect(mockStoreFunctions.updateBoardLabel).toHaveBeenCalledWith(mockBoardId, 'label-1', {
      text: 'Updated Label',
      color: 'bg-red-100'
    });
  });

  it('should handle multiple rapid state changes', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    // Rapid state changes
    act(() => {
      result.current.setSearchTerm('test');
      result.current.setLabelTitle('Test');
      result.current.setLabelColor('bg-red-100');
      result.current.setView('create');
    });

    expect(result.current.searchTerm).toBe('test');
    expect(result.current.labelTitle).toBe('Test');
    expect(result.current.labelColor).toBe('bg-red-100');
    expect(result.current.view).toBe('create');
  });

  it('should handle all view states', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    const views: LabelManagerView[] = ['list', 'create', 'edit'];

    views.forEach(view => {
      act(() => {
        result.current.setView(view);
      });
      expect(result.current.view).toBe(view);
    });
  });

  it('should handle empty selectedLabelIds array', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.handleToggleLabel('label-1');
    });

    expect(mockStoreFunctions.addLabelToCard).toHaveBeenCalledWith(mockBoardId, mockCardId, 'label-1');
    expect(mockStoreFunctions.removeLabelFromCard).not.toHaveBeenCalled();
  });

  it('should handle non-empty selectedLabelIds array', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: ['label-1']
      })
    );

    act(() => {
      result.current.handleToggleLabel('label-1');
    });

    expect(mockStoreFunctions.removeLabelFromCard).toHaveBeenCalledWith(mockBoardId, mockCardId, 'label-1');
    expect(mockStoreFunctions.addLabelToCard).not.toHaveBeenCalled();
  });

  it('should handle label title with only spaces', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.setLabelTitle('     ');
    });

    act(() => {
      result.current.handleCreateLabel();
    });

    expect(mockStoreFunctions.createBoardLabel).not.toHaveBeenCalled();
  });

  it('should handle label title with tabs and newlines', () => {
    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    const whitespaceTitles = ['\t', '\n', ' \t \n '];

    whitespaceTitles.forEach(title => {
      act(() => {
        result.current.setLabelTitle(title);
        result.current.handleCreateLabel();
      });

      expect(mockStoreFunctions.createBoardLabel).not.toHaveBeenCalled();
    });
  });

  it('should handle multiple board labels filtering', () => {
    const boardWithManyLabels = {
      ...mockBoard,
      labels: [
        { id: 'label-1', text: 'Urgent', color: 'bg-red-100' },
        { id: 'label-2', text: 'Important', color: 'bg-yellow-100' },
        { id: 'label-3', text: 'Low Priority', color: 'bg-green-100' },
        { id: 'label-4', text: 'Medium', color: 'bg-blue-100' }
      ]
    };

    mockUseBoardStore.mockReturnValue({
      boards: [boardWithManyLabels],
      ...mockStoreFunctions
    });

    const { result } = renderHook(() =>
      useTaskModalLabelManager({
        boardId: mockBoardId,
        cardId: mockCardId,
        selectedLabelIds: []
      })
    );

    act(() => {
      result.current.setSearchTerm('or');
    });

    expect(result.current.filteredLabels).toHaveLength(2);
    expect(result.current.filteredLabels.map(l => l.text)).toEqual(['Important', 'Low Priority']);
  });
});
