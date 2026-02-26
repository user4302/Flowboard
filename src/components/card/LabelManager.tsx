'use client';

import { useState } from 'react';
import { Search, Plus, ChevronLeft, X, Edit2, Check } from 'lucide-react';
import { useBoardStore } from '@/store';
import { Label } from '@/lib/types';
import { LABEL_COLORS } from '@/lib/constants';
import { cn, generateId } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LabelManagerProps {
    boardId: string;
    cardId: string;
    selectedLabelIds: string[];
    onClose: () => void;
}

type View = 'list' | 'create' | 'edit';

export function LabelManager({ boardId, cardId, selectedLabelIds, onClose }: LabelManagerProps) {
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

    const [view, setView] = useState<View>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingLabel, setEditingLabel] = useState<Label | null>(null);

    // Create/Edit state
    const [labelTitle, setLabelTitle] = useState('');
    const [labelColor, setLabelColor] = useState<typeof LABEL_COLORS[number]>(LABEL_COLORS[0]);

    const filteredLabels = boardLabels.filter(label =>
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
        setLabelColor(LABEL_COLORS[0]);
        setView('create');
    };

    return (
        <div className="w-80 max-h-[480px] flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
            <div className="mb-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    {view !== 'list' && (
                        <button
                            type="button"
                            onClick={() => setView('list')}
                            className="text-slate-500 hover:text-slate-700"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                    )}
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {view === 'list' ? 'Labels' : view === 'create' ? 'Create label' : 'Edit label'}
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="text-slate-400 hover:text-slate-600"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                {view === 'list' ? (
                    <div className="flex flex-col h-full space-y-4 overflow-hidden">
                        <div className="relative flex-shrink-0">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search labels..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-9"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1 min-h-0 custom-scrollbar space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 sticky top-0 bg-white dark:bg-slate-900 py-1 z-10">Labels</p>
                            {filteredLabels.map((label) => (
                                <div key={label.id} className="group flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleLabel(label.id);
                                        }}
                                        className={cn(
                                            "flex h-9 flex-1 items-center justify-between rounded px-3 transition-all",
                                            label.color,
                                            "hover:brightness-90 active:scale-95"
                                        )}
                                    >
                                        <span className="text-sm font-medium text-white truncate max-w-[180px]">
                                            {label.text}
                                        </span>
                                        {selectedLabelIds.includes(label.id) && (
                                            <Check className="h-4 w-4 text-white" />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEdit(label);
                                        }}
                                        className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded dark:hover:bg-slate-800"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full h-9 gap-2 text-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openCreate();
                                }}
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Create a new label
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full space-y-4 overflow-hidden">
                        <div className="space-y-4 flex-shrink-0">
                            <div className="space-y-2">
                                <div className={cn("h-10 w-full rounded flex items-center justify-center text-sm font-medium text-white", labelColor)}>
                                    {labelTitle || 'Label preview'}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Title</label>
                                <Input
                                    value={labelTitle}
                                    onChange={(e) => setLabelTitle(e.target.value)}
                                    placeholder="Label name"
                                    className="h-9"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1 min-h-0 custom-scrollbar space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 sticky top-0 bg-white dark:bg-slate-900 py-1 z-10">Select a color</label>
                            <div className="grid grid-cols-5 gap-2 pb-2">
                                {LABEL_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLabelColor(color);
                                        }}
                                        className={cn(
                                            "h-8 w-full rounded transition-all hover:brightness-110",
                                            color,
                                            labelColor === color && "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-shrink-0">
                            {view === 'create' ? (
                                <Button type="button" onClick={handleCreateLabel} className="flex-1 h-9">Create</Button>
                            ) : (
                                <>
                                    <Button type="button" onClick={handleUpdateLabel} className="flex-1 h-9">Save</Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteLabel(editingLabel!.id);
                                        }}
                                        className="h-9 px-3"
                                    >
                                        Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
