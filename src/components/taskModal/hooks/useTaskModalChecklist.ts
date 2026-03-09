import { useState } from 'react';
import { useBoardStore } from '@/store';
import { ChecklistItem } from '@/lib/types';

interface UseChecklistProps {
  boardId: string;
  cardId: string;
  initialChecklist: ChecklistItem[];
}

export const useTaskModalChecklist = ({ boardId, cardId, initialChecklist }: UseChecklistProps) => {
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [showNewChecklistInput, setShowNewChecklistInput] = useState(false);
  const [localChecklist, setLocalChecklist] = useState<ChecklistItem[]>(initialChecklist);

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: newChecklistItem.trim(),
        done: false
      };
      setLocalChecklist(prev => [...prev, newItem]);
      setNewChecklistItem('');
      setShowNewChecklistInput(false);
    }
  };

  const handleToggleChecklistItem = (itemId: string, done: boolean) => {
    setLocalChecklist(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, done } : item
      )
    );
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    setLocalChecklist(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCancelNewItem = () => {
    setShowNewChecklistInput(false);
    setNewChecklistItem('');
  };

  const handleStartNewItem = () => {
    setShowNewChecklistInput(true);
  };

  const syncChecklistToStore = () => {
    const { addChecklistItem, updateChecklistItem, removeChecklistItem } = useBoardStore.getState();

    // Get current card data from store to compare
    const currentBoard = useBoardStore.getState().boards.find(b => b.id === boardId);
    const currentCard = currentBoard?.lists.flatMap(l => l.cards).find(c => c.id === cardId);
    const currentChecklist = currentCard?.checklist || [];

    // Find items to add (in local but not in store)
    localChecklist.forEach(localItem => {
      if (!currentChecklist.some(storeItem => storeItem.id === localItem.id)) {
        addChecklistItem(boardId, cardId, localItem.text);
      }
    });

    // Find items to update or remove
    currentChecklist.forEach(storeItem => {
      const localItem = localChecklist.find(l => l.id === storeItem.id);
      if (localItem) {
        // Update if changed
        if (localItem.done !== storeItem.done) {
          updateChecklistItem(boardId, cardId, storeItem.id, { done: localItem.done });
        }
      } else {
        // Remove if not in local anymore
        removeChecklistItem(boardId, cardId, storeItem.id);
      }
    });
  };

  const resetChecklist = () => {
    setLocalChecklist(initialChecklist);
  };

  return {
    newChecklistItem,
    showNewChecklistInput,
    localChecklist,
    setNewChecklistItem,
    setShowNewChecklistInput,
    handleAddChecklistItem,
    handleToggleChecklistItem,
    handleDeleteChecklistItem,
    handleCancelNewItem,
    handleStartNewItem,
    syncChecklistToStore,
    resetChecklist
  };
};
