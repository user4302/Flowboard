import { useState } from 'react';
import { useBoardStore } from '@/store';
import { Checklist, ChecklistItem } from '@/lib/types';

interface UseChecklistProps {
  boardId: string;
  cardId: string;
  initialChecklists: Checklist[];
}

/**
 * Hook for managing checklists in a task modal with immediate store synchronization.
 * 
 * This hook provides local state management for checklists with real-time persistence
 * to the global board store. All CRUD operations immediately sync to ensure data
 * consistency across the application.
 * 
 * @param props - Configuration object
 * @param props.boardId - ID of the board containing the card
 * @param props.cardId - ID of the card with checklists
 * @param props.initialChecklists - Initial checklist data from the store
 * @returns Checklist management functions and local state
 */
export const useTaskModalChecklist = ({ boardId, cardId, initialChecklists }: UseChecklistProps) => {
  const [localChecklists, setLocalChecklists] = useState<Checklist[]>([]); // Start with empty array instead of initialChecklists

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

    // Immediately sync to store
    const { addChecklist: storeAddChecklist } = useBoardStore.getState();
    storeAddChecklist(boardId, cardId, name);
  };

  const updateChecklist = (checklistId: string, updates: Partial<Checklist>) => {
    setLocalChecklists(prev =>
      prev.map(checklist =>
        checklist.id === checklistId
          ? { ...checklist, ...updates, updatedAt: new Date() }
          : checklist
      )
    );

    // Immediately sync to store
    const { updateChecklist: storeUpdateChecklist } = useBoardStore.getState();
    storeUpdateChecklist(boardId, cardId, checklistId, updates);
  };

  const removeChecklist = (checklistId: string) => {
    setLocalChecklists(prev => prev.filter(checklist => checklist.id !== checklistId));

    // Immediately sync to store
    const { removeChecklist: storeRemoveChecklist } = useBoardStore.getState();
    storeRemoveChecklist(boardId, cardId, checklistId);
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

    // Immediately sync to store
    const { addChecklistItem: storeAddChecklistItem } = useBoardStore.getState();
    storeAddChecklistItem(boardId, cardId, checklistId, text);
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

    // Immediately sync to store if updating done status
    if (updates.done !== undefined) {
      const { updateChecklistItem: storeUpdateChecklistItem } = useBoardStore.getState();
      storeUpdateChecklistItem(boardId, cardId, checklistId, itemId, updates);
    }
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

    // Immediately sync to store
    const { removeChecklistItem: storeRemoveChecklistItem } = useBoardStore.getState();
    storeRemoveChecklistItem(boardId, cardId, checklistId, itemId);
  };

  const syncChecklistToStore = () => {
    const { addChecklist: storeAddChecklist, updateChecklist: storeUpdateChecklist, removeChecklist: storeRemoveChecklist,
      addChecklistItem: storeAddChecklistItem, updateChecklistItem: storeUpdateChecklistItem, removeChecklistItem: storeRemoveChecklistItem } = useBoardStore.getState();

    // Get current card data from store to compare
    const currentBoard = useBoardStore.getState().boards.find(b => b.id === boardId);
    const currentCard = currentBoard?.lists.flatMap(l => l.cards).find(c => c.id === cardId);
    const currentChecklists = currentCard?.checklists || [];

    // Only sync if card exists (prevents errors when card is deleted)
    if (!currentCard) {
      return;
    }

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
