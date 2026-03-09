'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/ui';
import { Checklist, ChecklistItem } from '@/lib/types';

interface TaskModalMultiChecklistManagerProps {
  cardId: string;
  boardId: string;
  checklists: Checklist[];
  onAddChecklist: (name: string) => void;
  onUpdateChecklist: (checklistId: string, updates: Partial<Checklist>) => void;
  onRemoveChecklist: (checklistId: string) => void;
  onAddChecklistItem: (checklistId: string, text: string) => void;
  onUpdateChecklistItem: (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
  onRemoveChecklistItem: (checklistId: string, itemId: string) => void;
}

export function TaskModalMultiChecklistManager({
  cardId,
  boardId,
  checklists,
  onAddChecklist,
  onUpdateChecklist,
  onRemoveChecklist,
  onAddChecklistItem,
  onUpdateChecklistItem,
  onRemoveChecklistItem
}: TaskModalMultiChecklistManagerProps) {
  const [expandedChecklists, setExpandedChecklists] = useState<Set<string>>(new Set());
  const [newChecklistName, setNewChecklistName] = useState('');
  const [showNewChecklistInput, setShowNewChecklistInput] = useState(false);
  const [editingChecklistId, setEditingChecklistId] = useState<string | null>(null);
  const [editingChecklistName, setEditingChecklistName] = useState('');
  const [newItemInputs, setNewItemInputs] = useState<Record<string, string>>({});

  const toggleChecklistExpanded = (checklistId: string) => {
    setExpandedChecklists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(checklistId)) {
        newSet.delete(checklistId);
      } else {
        newSet.add(checklistId);
      }
      return newSet;
    });
  };

  const handleAddChecklist = () => {
    if (newChecklistName.trim()) {
      onAddChecklist(newChecklistName.trim());
      setNewChecklistName('');
      setShowNewChecklistInput(false);
    }
  };

  const handleStartEditChecklist = (checklist: Checklist) => {
    setEditingChecklistId(checklist.id);
    setEditingChecklistName(checklist.name);
  };

  const handleSaveChecklistName = (checklistId: string) => {
    if (editingChecklistName.trim()) {
      onUpdateChecklist(checklistId, { name: editingChecklistName.trim() });
    }
    setEditingChecklistId(null);
    setEditingChecklistName('');
  };

  const handleCancelEditChecklist = () => {
    setEditingChecklistId(null);
    setEditingChecklistName('');
  };

  const handleAddItem = (checklistId: string) => {
    const text = newItemInputs[checklistId];
    if (text?.trim()) {
      onAddChecklistItem(checklistId, text.trim());
      setNewItemInputs(prev => ({ ...prev, [checklistId]: '' }));
    }
  };

  const handleToggleItem = (checklistId: string, itemId: string, done: boolean) => {
    onUpdateChecklistItem(checklistId, itemId, { done });
  };

  const handleDeleteItem = (checklistId: string, itemId: string) => {
    onRemoveChecklistItem(checklistId, itemId);
  };

  const getChecklistProgress = (checklist: Checklist) => {
    const completed = checklist.items.filter(item => item.done).length;
    const total = checklist.items.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="space-y-4">
      {/* Add new checklist - only show if no checklists exist */}
      {checklists.length === 0 && !showNewChecklistInput && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowNewChecklistInput(true)}
          className="w-full justify-start"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add checklist
        </Button>
      )}

      {/* Add another checklist - show when checklists exist */}
      {checklists.length > 0 && !showNewChecklistInput && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowNewChecklistInput(true)}
          className="w-full justify-start"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add another checklist
        </Button>
      )}

      {showNewChecklistInput && (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Checklist name..."
            value={newChecklistName}
            onChange={(e) => setNewChecklistName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddChecklist();
              }
              if (e.key === 'Escape') {
                setShowNewChecklistInput(false);
                setNewChecklistName('');
              }
            }}
            className="flex-1"
            autoFocus
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAddChecklist}
            disabled={!newChecklistName.trim()}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowNewChecklistInput(false);
              setNewChecklistName('');
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Existing checklists */}
      {checklists.map((checklist) => {
        const isExpanded = expandedChecklists.has(checklist.id);
        const isEditing = editingChecklistId === checklist.id;
        const progress = getChecklistProgress(checklist);
        const newItemText = newItemInputs[checklist.id] || '';

        return (
          <div key={checklist.id} className="border border-slate-200 dark:border-slate-600 rounded-lg">
            {/* Checklist header */}
            <div
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-t-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              onClick={() => !isEditing && toggleChecklistExpanded(checklist.id)}
            >
              <div className="flex items-center gap-2 flex-1">
                <div className="p-1">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>

                {isEditing ? (
                  <Input
                    type="text"
                    value={editingChecklistName}
                    onChange={(e) => setEditingChecklistName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveChecklistName(checklist.id);
                      } else if (e.key === 'Escape') {
                        handleCancelEditChecklist();
                      }
                    }}
                    className="flex-1 h-7 text-sm"
                    autoFocus
                  />
                ) : (
                  <span className="font-medium text-sm text-slate-700 dark:text-slate-300">
                    {checklist.name}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {checklist.items.length > 0 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">
                    {checklist.items.filter(item => item.done).length}/{checklist.items.length} ({progress}%)
                  </span>
                )}

                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveChecklistName(checklist.id);
                      }}
                      disabled={!editingChecklistName.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelEditChecklist();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEditChecklist(checklist);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveChecklist(checklist.id);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Progress bar - full height section */}
            {checklist.items.length > 0 && (
              <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Checklist items */}
            {isExpanded && (
              <div className="p-3 space-y-2">
                {checklist.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={(e) => handleToggleItem(checklist.id, item.id, e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                    />
                    <span
                      className={cn(
                        'flex-1 text-sm',
                        item.done && 'line-through text-slate-500 dark:text-slate-400'
                      )}
                    >
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(checklist.id, item.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Add new item input */}
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Add new item..."
                    value={newItemText}
                    onChange={(e) => setNewItemInputs(prev => ({ ...prev, [checklist.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddItem(checklist.id);
                      } else if (e.key === 'Escape') {
                        setNewItemInputs(prev => ({ ...prev, [checklist.id]: '' }));
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleAddItem(checklist.id)}
                    disabled={!newItemText.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
