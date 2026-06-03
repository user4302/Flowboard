import { useState, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
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
  const [localChecklists, setLocalChecklists] = useState<Checklist[]>(initialChecklists);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalChecklists(initialChecklists);
    setIsDirty(false);
  }, [initialChecklists]);

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
    setIsDirty(true);
  };

  const updateChecklist = (checklistId: string, updates: Partial<Checklist>) => {
    setLocalChecklists(prev =>
      prev.map(checklist =>
        checklist.id === checklistId
          ? { ...checklist, ...updates, updatedAt: new Date() }
          : checklist
      )
    );
    setIsDirty(true);
  };

  const removeChecklist = (checklistId: string) => {
    setLocalChecklists(prev => prev.filter(checklist => checklist.id !== checklistId));
    setIsDirty(true);
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
    setIsDirty(true);
  };

  const addChecklistItems = (checklistId: string, texts: string[]) => {
    const normalizedTexts = texts
      .map(text => text.trim())
      .filter(text => text.length > 0);

    if (normalizedTexts.length === 0) {
      return;
    }

    setLocalChecklists(prev =>
      prev.map(checklist =>
        checklist.id === checklistId
          ? {
            ...checklist,
            items: [
              ...checklist.items,
              ...normalizedTexts.map(text => ({
                id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                text,
                done: false
              }))
            ],
            updatedAt: new Date()
          }
          : checklist
      )
    );
    setIsDirty(true);
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
    setIsDirty(true);

    // Removed immediate sync to store to support "save only on button click"
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
    setIsDirty(true);
  };

  const reorderChecklistItems = (checklistId: string, fromIndex: number, toIndex: number) => {
    setLocalChecklists(prev =>
      prev.map(checklist =>
        checklist.id === checklistId
          ? {
            ...checklist,
            items: arrayMove(checklist.items, fromIndex, toIndex),
            updatedAt: new Date()
          }
          : checklist
      )
    );
    setIsDirty(true);
  };

  const syncChecklistToStore = () => {
    setIsDirty(false);
    const { addChecklist: storeAddChecklist, updateChecklist: storeUpdateChecklist, removeChecklist: storeRemoveChecklist,
      addChecklistItem: storeAddChecklistItem, updateChecklistItem: storeUpdateChecklistItem, removeChecklistItem: storeRemoveChecklistItem,
      reorderChecklistItems: storeReorderChecklistItems } = useBoardStore.getState();

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

    // Sync checklist items (add, update, remove, reorder)
    localChecklists.forEach(localChecklist => {
      const storeChecklist = currentChecklists.find(cl => cl.id === localChecklist.id);
      const currentItems = storeChecklist?.items || [];

      // Check if reordering is needed
      const currentIds = currentItems.map(i => i.id);
      const localIds = localChecklist.items.map(i => i.id);

      if (JSON.stringify(currentIds) !== JSON.stringify(localIds)) {
        // Simple reorder: just perform the reorder for each item.
        // This is inefficient but functional given the current store API.
        localChecklist.items.forEach((item, index) => {
          const currentIndex = currentItems.findIndex(i => i.id === item.id);
          if (currentIndex !== -1 && currentIndex !== index) {
            storeReorderChecklistItems(boardId, cardId, localChecklist.id, currentIndex, index);
          }
        });
      }

      // Add new items
      localChecklist.items.forEach(localItem => {
        if (!currentItems.find(item => item.id === localItem.id)) {
          storeAddChecklistItem(boardId, cardId, localChecklist.id, localItem.text);
        }
      });

      // Update existing items if text or done status changed
      localChecklist.items.forEach(localItem => {
        const storeItem = currentItems.find(item => item.id === localItem.id);
        if (storeItem && (storeItem.done !== localItem.done || storeItem.text !== localItem.text)) {
          storeUpdateChecklistItem(boardId, cardId, localChecklist.id, localItem.id, { 
            done: localItem.done,
            text: localItem.text
          });
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
    setIsDirty(false);
  };

  const resetDirty = () => {
    setIsDirty(false);
  };

  return {
    localChecklists,
    isDirty,
    resetDirty,
    addChecklist,
    updateChecklist,
    removeChecklist,
    addChecklistItem,
    addChecklistItems,
    updateChecklistItem,
    removeChecklistItem,
    reorderChecklistItems,
    syncChecklistToStore,
    resetChecklist
  };
};
