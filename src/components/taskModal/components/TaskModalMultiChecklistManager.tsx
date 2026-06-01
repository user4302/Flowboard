'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, X, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  onAddChecklistItems: (checklistId: string, texts: string[]) => void;
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
  onRemoveChecklistItem,
  onAddChecklistItems
}: TaskModalMultiChecklistManagerProps) {
  const [expandedChecklists, setExpandedChecklists] = useState<Set<string>>(new Set());
  const [newChecklistName, setNewChecklistName] = useState('');
  const [showNewChecklistInput, setShowNewChecklistInput] = useState(false);
  const [editingChecklistId, setEditingChecklistId] = useState<string | null>(null);
  const [editingChecklistName, setEditingChecklistName] = useState('');
  const [newItemInputs, setNewItemInputs] = useState<Record<string, string>>({});
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemText, setEditingItemText] = useState('');

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

  const handleAddMultipleItems = (checklistId: string, texts: string[]) => {
    if (typeof onAddChecklistItems === 'function') {
      onAddChecklistItems(checklistId, texts);
      return;
    }

    texts.forEach((text) => {
      const trimmedText = text.trim();
      if (trimmedText) {
        onAddChecklistItem(checklistId, trimmedText);
      }
    });
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

  const handleStartEditItem = (itemId: string, currentText: string) => {
    setEditingItemId(itemId);
    setEditingItemText(currentText);
  };

  const handleSaveItem = (checklistId: string, itemId: string) => {
    if (editingItemText.trim()) {
      onUpdateChecklistItem(checklistId, itemId, { text: editingItemText.trim() });
    }
    setEditingItemId(null);
    setEditingItemText('');
  };

  const handleCancelEditItem = () => {
    setEditingItemId(null);
    setEditingItemText('');
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
                {checklist.items.map((item) => {
                  const isEditingItem = editingItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "group relative flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-200",
                        "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800",
                        "hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm",
                        item.done && "bg-slate-50 dark:bg-slate-700/50"
                      )}
                    >
                      {/* Custom checkbox with enhanced styling */}
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={(e) => handleToggleItem(checklist.id, item.id, e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          onClick={() => handleToggleItem(checklist.id, item.id, !item.done)}
                          className={cn(
                            "w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all duration-200",
                            "border-slate-300 dark:border-slate-500",
                            "hover:border-indigo-500 dark:hover:border-indigo-400",
                            item.done && "bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500"
                          )}
                        >
                          {item.done && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Item text or input field */}
                      {isEditingItem ? (
                        <Input
                          type="text"
                          value={editingItemText}
                          onChange={(e) => setEditingItemText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveItem(checklist.id, item.id);
                            } else if (e.key === 'Escape') {
                              handleCancelEditItem();
                            }
                          }}
                          className="flex-1 h-8 text-sm border-indigo-300 dark:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                          autoFocus
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex-1 text-sm cursor-pointer select-none transition-all duration-200",
                            "text-slate-700 dark:text-slate-200",
                            "hover:text-indigo-600 dark:hover:text-indigo-400",
                            item.done && "line-through text-slate-500 dark:text-slate-400"
                          )}
                          onClick={() => handleStartEditItem(item.id, item.text)}
                        >
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.text}</ReactMarkdown>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className={cn(
                        "flex items-center gap-1 transition-opacity duration-200",
                        isEditingItem ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}>
                        {isEditingItem ? (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleSaveItem(checklist.id, item.id)}
                              disabled={!editingItemText.trim()}
                              className="h-7 px-2 text-xs bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                            >
                              Save
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelEditItem}
                              className="h-7 w-7 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStartEditItem(item.id, item.text)}
                              className={cn(
                                "h-7 w-7 p-0 rounded-md flex items-center justify-center transition-all duration-200",
                                "text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400",
                                "hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                              )}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(checklist.id, item.id)}
                              className={cn(
                                "h-7 w-7 p-0 rounded-md flex items-center justify-center transition-all duration-200",
                                "text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400",
                                "hover:bg-red-50 dark:hover:bg-red-900/30"
                              )}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Add new item input */}
                <div className={cn(
                  "flex items-center gap-2 p-2.5 rounded-lg border border-dashed transition-all duration-200",
                  "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50",
                  "hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800"
                )}>
                  <div className="w-5 h-5 rounded-md border-2 border-dashed border-slate-400 dark:border-slate-500 flex items-center justify-center">
                    <Plus className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  </div>
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
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData('text');
                      if (pastedText.includes('\n')) {
                        e.preventDefault();
                        e.stopPropagation();
                        const items = pastedText
                          .split(/\r?\n/)
                          .map(line => line.trim())
                          .filter(line => line.length > 0);
                        handleAddMultipleItems(checklist.id, items);
                        setNewItemInputs(prev => ({ ...prev, [checklist.id]: '' }));
                      }
                    }}
                    className="flex-1 h-8 text-sm border-0 bg-transparent focus:ring-0 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleAddItem(checklist.id)}
                    disabled={!newItemText.trim()}
                    className="h-7 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
