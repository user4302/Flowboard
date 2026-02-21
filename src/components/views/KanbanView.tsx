'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBoardStore, useUIStore } from '@/store';
import { Card } from '@/components/card';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

interface KanbanViewProps {
  boardId: string;
}

export function KanbanView({ boardId }: KanbanViewProps) {
  const { boards, createList, createCard } = useBoardStore();
  const { searchTerm } = useUIStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [newCardTitles, setNewCardTitles] = useState<Record<string, string>>({});
  const [showNewListInput, setShowNewListInput] = useState(false);
  const [showNewCardInputs, setShowNewCardInputs] = useState<Record<string, boolean>>({});

  const board = boards.find((b) => b.id === boardId);
  if (!board) return null;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active card and its current list
    let activeCard = null;
    let fromListId = null;
    let fromIndex = -1;

    for (const list of board.lists) {
      const cardIndex = list.cards.findIndex((c) => c.id === activeId);
      if (cardIndex !== -1) {
        activeCard = list.cards[cardIndex];
        fromListId = list.id;
        fromIndex = cardIndex;
        break;
      }
    }

    if (!activeCard || !fromListId) return;

    // Find the target list and position
    let toListId = fromListId;
    let toIndex = 0;

    // Check if we're dropping on a list
    const targetList = board.lists.find((l) => l.id === overId);
    if (targetList) {
      toListId = targetList.id;
      toIndex = targetList.cards.length;
    } else {
      // Check if we're dropping on another card
      for (const list of board.lists) {
        const cardIndex = list.cards.findIndex((c) => c.id === overId);
        if (cardIndex !== -1) {
          toListId = list.id;
          toIndex = cardIndex;
          break;
        }
      }
    }

    // Move the card
    if (fromListId === toListId) {
      // Reorder within the same list
      useBoardStore.getState().reorderCards(boardId, fromListId, fromIndex, toIndex);
    } else {
      // Move to a different list
      useBoardStore.getState().moveCard(boardId, activeId, fromListId, toListId, toIndex);
    }

    setActiveId(null);
  };

  const handleCreateList = () => {
    if (newListTitle.trim()) {
      createList(boardId, newListTitle.trim());
      setNewListTitle('');
      setShowNewListInput(false);
    }
  };

  const handleCreateCard = (listId: string) => {
    const title = newCardTitles[listId];
    if (title?.trim()) {
      createCard(boardId, listId, title.trim());
      setNewCardTitles({ ...newCardTitles, [listId]: '' });
      setShowNewCardInputs({ ...showNewCardInputs, [listId]: false });
    }
  };

  const filterCards = (cards: any[]) => {
    if (!searchTerm) return cards;
    return cards.filter((card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getActiveCard = () => {
    if (!activeId) return null;
    
    for (const list of board.lists) {
      const card = list.cards.find((c) => c.id === activeId);
      if (card) return { ...card, members: board.members };
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto p-4 lg:p-6">
        <SortableContext items={board.lists.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {board.lists.map((list) => (
            <div
              key={list.id}
              className="flex w-80 flex-shrink-0 flex-col gap-3"
            >
              {/* List header */}
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-900 dark:text-slate-100">
                  {list.title}
                </h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {filterCards(list.cards).length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-1 flex-col gap-2">
                <SortableContext items={filterCards(list.cards).map((c) => c.id)} strategy={verticalListSortingStrategy}>
                  {filterCards(list.cards).map((card) => (
                    <Card
                      key={card.id}
                      card={card}
                      members={board.members}
                      onClick={() => {}}
                    />
                  ))}
                </SortableContext>

                {/* Add card button/input */}
                {showNewCardInputs[list.id] ? (
                  <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                    <Input
                      placeholder="Enter card title..."
                      value={newCardTitles[list.id] || ''}
                      onChange={(e) =>
                        setNewCardTitles({ ...newCardTitles, [list.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateCard(list.id);
                        } else if (e.key === 'Escape') {
                          setShowNewCardInputs({ ...showNewCardInputs, [list.id]: false });
                          setNewCardTitles({ ...newCardTitles, [list.id]: '' });
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowNewCardInputs({ ...showNewCardInputs, [list.id]: false });
                          setNewCardTitles({ ...newCardTitles, [list.id]: '' });
                        }, 200);
                      }}
                      className="mb-2"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleCreateCard(list.id)}>
                        Add card
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowNewCardInputs({ ...showNewCardInputs, [list.id]: false });
                          setNewCardTitles({ ...newCardTitles, [list.id]: '' });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="flex items-center gap-2 rounded-xl p-3 text-left text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                    onClick={() => setShowNewCardInputs({ ...showNewCardInputs, [list.id]: true })}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add a card</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </SortableContext>

        {/* Add list button/input */}
        {showNewListInput ? (
          <div className="w-80 flex-shrink-0">
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <Input
                placeholder="Enter list title..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateList();
                  } else if (e.key === 'Escape') {
                    setShowNewListInput(false);
                    setNewListTitle('');
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowNewListInput(false);
                    setNewListTitle('');
                  }, 200);
                }}
                className="mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateList}>
                  Add list
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowNewListInput(false);
                    setNewListTitle('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="flex h-fit w-80 flex-shrink-0 items-center gap-2 rounded-xl p-3 text-left text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            onClick={() => setShowNewListInput(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add another list</span>
          </button>
        )}
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="rotate-2 transform opacity-90">
            <Card
              card={getActiveCard()!}
              members={board.members}
              onClick={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
