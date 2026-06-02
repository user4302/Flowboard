import { useState, useEffect } from 'react';
import { useBoardStore } from '@/store';
import { Label } from '@/lib/types';
import { BASIC_LABEL_COLORS } from '@/lib/constants';
import { LabelManagerView } from '../../../types/TaskModal.form.types';

interface UseTaskModalLabelManagerProps {
  boardId: string;
  cardId: string;
  selectedLabelIds: string[];
}

export function useTaskModalLabelManager({ boardId, cardId, initialSelectedLabelIds }: { boardId: string, cardId: string, initialSelectedLabelIds: string[] }) {
  const {
    boards,
    addLabelToCard,
    removeLabelFromCard,
    createBoardLabel,
    updateBoardLabel,
    deleteBoardLabel
  } = useBoardStore();

  const board = boards.find(b => b.id === boardId);
  const boardLabels = board?.labels || [];

  const [view, setView] = useState<LabelManagerView>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [labelTitle, setLabelTitle] = useState('');
  const [labelColor, setLabelColor] = useState<string>(BASIC_LABEL_COLORS[0]);
  
  // Local state for selected labels on this card
  const [localSelectedLabelIds, setLocalSelectedLabelIds] = useState<string[]>(initialSelectedLabelIds);
  const [isDirty, setIsDirty] = useState(false);

  // Sync with prop changes (e.g. if card changes)
  useEffect(() => {
    setLocalSelectedLabelIds(initialSelectedLabelIds);
    setIsDirty(false);
  }, [initialSelectedLabelIds]);

  const filteredLabels = boardLabels.filter(label =>
    label && label.text && typeof label.text === 'string' &&
    label.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleLabel = (labelId: string) => {
    setLocalSelectedLabelIds(prev => {
      const next = prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId];
      setIsDirty(true);
      return next;
    });
  };

  const handleCreateLabel = () => {
    if (!labelTitle.trim()) return;
    createBoardLabel(boardId, { text: labelTitle, color: labelColor });
    setView('list');
    setLabelTitle('');
  };

  const handleUpdateLabel = () => {
    if (!editingLabel || !labelTitle.trim()) return;
    updateBoardLabel(boardId, editingLabel.id, { text: labelTitle, color: labelColor });
    setView('list');
    setEditingLabel(null);
  };

  const handleDeleteLabel = (labelId: string) => {
    deleteBoardLabel(boardId, labelId);
    if (view === 'edit') setView('list');
    
    // Also remove from local selection if it was deleted from board
    if (localSelectedLabelIds.includes(labelId)) {
      setLocalSelectedLabelIds(prev => prev.filter(id => id !== labelId));
    }
  };

  const syncLabelsToStore = () => {
    // Determine which labels were added and which were removed
    const added = localSelectedLabelIds.filter(id => !initialSelectedLabelIds.includes(id));
    const removed = initialSelectedLabelIds.filter(id => !localSelectedLabelIds.includes(id));

    added.forEach(id => addLabelToCard(boardId, cardId, id));
    removed.forEach(id => removeLabelFromCard(boardId, cardId, id));
    
    setIsDirty(false);
  };

  const openEdit = (label: Label) => {
    setEditingLabel(label);
    setLabelTitle(label.text);
    setLabelColor(label.color as any);
    setView('edit');
  };

  const openCreate = () => {
    setLabelTitle('');
    setLabelColor(BASIC_LABEL_COLORS[0]);
    setView('create');
  };

  return {
    // State
    view,
    searchTerm,
    editingLabel,
    labelTitle,
    labelColor,
    boardLabels,
    filteredLabels,
    localSelectedLabelIds,
    isDirty,

    // Actions
    setView,
    setSearchTerm,
    setLabelTitle,
    setLabelColor,
    handleToggleLabel,
    handleCreateLabel,
    handleUpdateLabel,
    handleDeleteLabel,
    syncLabelsToStore,
    openEdit,
    openCreate
  };
};
