import { useState } from 'react';
import { useBoardStore } from '@/store';
import { Checklist, ChecklistItem } from '@/lib/types';

interface UseChecklistProps {
  boardId: string;
  cardId: string;
  initialChecklists: Checklist[];
}

export const useTaskModalChecklist = ({ boardId, cardId, initialChecklists }: UseChecklistProps) => {
  const [localChecklists, setLocalChecklists] = useState<Checklist[]>(initialChecklists);

  const addChecklist = (name: string) => {
    const newChecklist: Checklist = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      items: [],
      position: localChecklists.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setLocalChecklists(prev => [...prev, newChecklist]);
  };

  const updateChecklist = (checklistId: string, updates: Partial<Checklist>) => {
    setLocalChecklists(prev =>
      prev.map(checklist =>
        checklist.id === checklistId
          ? { ...checklist, ...updates, updatedAt: new Date() }
          : checklist
      )
    );
  };

  const removeChecklist = (checklistId: string) => {
    setLocalChecklists(prev => prev.filter(checklist => checklist.id !== checklistId));
  };

  const addChecklistItem = (checklistId: string, text: string) => {
    const newItem: ChecklistItem = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      done: false
    };
    setLocalChecklists(prev =>
      prev.map(checklist =>
        checklist.id === checklistId
          ? {
            ...checklist,
            items: [...checklist.items, newItem],
            updatedAt: new Date()
          }
          : checklist
      )
    );
  };

  const updateChecklistItem = (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => {
    setLocalChecklists(prev =>
      prev.map(checklist =>
        checklist.id === checklistId
          ? {
            ...checklist,
            items: checklist.items.map(item =>
              item.id === itemId
                ? { ...item, ...updates }
                : item
            ),
            updatedAt: new Date()
          }
          : checklist
      )
    );
  };

  const removeChecklistItem = (checklistId: string, itemId: string) => {
    setLocalChecklists(prev =>
      prev.map(checklist =>
        checklist.id === checklistId
          ? {
            ...checklist,
            items: checklist.items.filter(item => item.id !== itemId),
            updatedAt: new Date()
          }
          : checklist
      )
    );
  };

  const syncChecklistToStore = () => {
    const { addChecklist: storeAddChecklist, updateChecklist: storeUpdateChecklist, removeChecklist: storeRemoveChecklist,
      addChecklistItem: storeAddChecklistItem, updateChecklistItem: storeUpdateChecklistItem, removeChecklistItem: storeRemoveChecklistItem } = useBoardStore.getState();

    // Get current card data from store to compare
    const currentBoard = useBoardStore.getState().boards.find(b => b.id === boardId);
    const currentCard = currentBoard?.lists.flatMap(l => l.cards).find(c => c.id === cardId);
    const currentChecklists = currentCard?.checklists || [];

    // Sync checklists (add, update, remove)
    localChecklists.forEach(localChecklist => {
      const storeChecklist = currentChecklists.find(cl => cl.id === localChecklist.id);

      if (!storeChecklist) {
        // Add new checklist
        storeAddChecklist(boardId, cardId, localChecklist.name);
      } else {
        // Update existing checklist if changed
        if (localChecklist.name !== storeChecklist.name) {
          storeUpdateChecklist(boardId, cardId, localChecklist.id, { name: localChecklist.name });
        }
      }
    });

    // Remove checklists that are no longer in local state
    currentChecklists.forEach(storeChecklist => {
      if (!localChecklists.find(lc => lc.id === storeChecklist.id)) {
        storeRemoveChecklist(boardId, cardId, storeChecklist.id);
      }
    });

    // Sync checklist items
    localChecklists.forEach(localChecklist => {
      const storeChecklist = currentChecklists.find(cl => cl.id === localChecklist.id);
      const currentItems = storeChecklist?.items || [];

      // Add new items
      localChecklist.items.forEach(localItem => {
        if (!currentItems.find(item => item.id === localItem.id)) {
          storeAddChecklistItem(boardId, cardId, localChecklist.id, localItem.text);
        }
      });

      // Update existing items
      localChecklist.items.forEach(localItem => {
        const storeItem = currentItems.find(item => item.id === localItem.id);
        if (storeItem && storeItem.done !== localItem.done) {
          storeUpdateChecklistItem(boardId, cardId, localChecklist.id, localItem.id, { done: localItem.done });
        }
      });

      // Remove items that are no longer in local state
      currentItems.forEach(storeItem => {
        if (!localChecklist.items.find(item => item.id === storeItem.id)) {
          storeRemoveChecklistItem(boardId, cardId, localChecklist.id, storeItem.id);
        }
      });
    });
  };

  const resetChecklist = () => {
    setLocalChecklists(initialChecklists);
  };

  return {
    localChecklists,
    addChecklist,
    updateChecklist,
    removeChecklist,
    addChecklistItem,
    updateChecklistItem,
    removeChecklistItem,
    syncChecklistToStore,
    resetChecklist
  };
};
