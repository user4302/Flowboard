import { useState } from 'react';
import { useBoardStore } from '@/store';
import { Label } from '@/lib/types';
import { BASIC_LABEL_COLORS } from '@/lib/constants';
import { LabelManagerView } from '../../../types/TaskModal.form.types';

interface UseTaskModalLabelManagerProps {
  boardId: string;
  cardId: string;
  selectedLabelIds: string[];
}

export function useTaskModalLabelManager({ boardId, cardId, selectedLabelIds }: UseTaskModalLabelManagerProps) {
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

  const filteredLabels = boardLabels.filter(label =>
    label && label.text && typeof label.text === 'string' &&
    label.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleLabel = (labelId: string) => {
    if (selectedLabelIds.includes(labelId)) {
      removeLabelFromCard(boardId, cardId, labelId);
    } else {
      addLabelToCard(boardId, cardId, labelId);
    }
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

    // Actions
    setView,
    setSearchTerm,
    setLabelTitle,
    setLabelColor,
    handleToggleLabel,
    handleCreateLabel,
    handleUpdateLabel,
    handleDeleteLabel,
    openEdit,
    openCreate
  };
};
