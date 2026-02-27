'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowUpDown, Calendar, User, CheckSquare, Tag, Flag, Clock, Settings, ChevronDown } from 'lucide-react';
import { useBoardStore, useUIStore } from '@/store';
import { formatDate, getChecklistProgress, formatRelativeTime } from '@/lib/utils';
import { filterCards } from '@/lib/filterUtils';
import { cn } from '@/lib/utils';

import { Card } from '@/lib/types';

interface TableViewProps {
  boardId: string;
}

type CardWithList = Card & {
  listName: string;
  listId: string;
};

type SortField = 'title' | 'list' | 'dueDate' | 'progress' | 'priority' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export function TableView({ boardId }: TableViewProps) {
  const { boards } = useBoardStore();
  const {
    searchTerm,
    selectedLabels,
    selectedMembers,
    showOverdue,
    showCompleted,
    priorityThreshold,
    dueDateFilter,
    openCardModal
  } = useUIStore();

  const board = boards.find((b) => b.id === boardId);
  if (!board) return null;

  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(['title', 'list', 'labels', 'members', 'priority', 'dueDate', 'createdAt', 'progress']));
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleColumn = (columnKey: string) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(columnKey)) {
      newVisibleColumns.delete(columnKey);
    } else {
      newVisibleColumns.add(columnKey);
    }
    setVisibleColumns(newVisibleColumns);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowColumnDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get filtered cards using the utility
  const filteredCards = useMemo<CardWithList[]>(() => {
    const cardsWithList: CardWithList[] = board.lists.flatMap(list =>
      list.cards.map(card => ({
        ...card,
        listName: list.title,
        listId: list.id,
      }))
    );

    const filterOptions = {
      searchTerm,
      selectedLabels,
      selectedMembers,
      showOverdue,
      showCompleted,
      priorityThreshold,
      dueDateFilter
    };

    return filterCards(cardsWithList, filterOptions, board.labels) as CardWithList[];
  }, [board.lists, board.labels, searchTerm, selectedLabels, selectedMembers, showOverdue, showCompleted, priorityThreshold, dueDateFilter]);

  // Sort cards
  const sortedCards = useMemo(() => {
    const sorted = [...filteredCards].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'list':
          aValue = a.listName.toLowerCase();
          bValue = b.listName.toLowerCase();
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          break;
        case 'progress':
          aValue = getChecklistProgress(a.checklist);
          bValue = getChecklistProgress(b.checklist);
          break;
        case 'priority':
          aValue = a.priority || 0;
          bValue = b.priority || 0;
          break;
        case 'createdAt':
          aValue = a.createdAt ? new Date(a.createdAt).getTime() : Infinity;
          bValue = b.createdAt ? new Date(b.createdAt).getTime() : Infinity;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredCards, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCardClick = (cardId: string) => {
    openCardModal(cardId);
  };

  const getCardMembers = (memberIds: string[]) => {
    return board.members.filter(member => memberIds.includes(member.id));
  };

  const columns = [
    { key: 'title', label: 'Title', icon: null },
    { key: 'list', label: 'List', icon: null },
    { key: 'labels', label: 'Labels', icon: Tag },
    { key: 'members', label: 'Members', icon: User },
    { key: 'priority', label: 'Priority', icon: Flag },
    { key: 'dueDate', label: 'Due Date', icon: Calendar },
    { key: 'createdAt', label: 'Created', icon: Clock },
    { key: 'progress', label: 'Progress', icon: CheckSquare },
  ] as const;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Table View
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {sortedCards.length} cards
            </div>

            {/* Column Toggle Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                className="flex items-center gap-2 px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
              >
                <Settings className="h-4 w-4" />
                Columns
                <ChevronDown className="h-3 w-3" />
              </button>

              {showColumnDropdown && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-10 dark:bg-slate-800 dark:border-slate-700">
                  <div className="p-2">
                    {columns.map((column) => (
                      <label
                        key={column.key}
                        className="flex items-center gap-2 px-2 py-1 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.has(column.key)}
                          onChange={() => toggleColumn(column.key)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
                        />
                        <span className="text-slate-700 dark:text-slate-300">{column.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              {columns.filter(column => visibleColumns.has(column.key)).map((column) => {
                const Icon = column.icon;
                return (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider"
                  >
                    <button
                      onClick={() => handleSort(column.key as SortField)}
                      className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      {column.label}
                      {column.key === sortField && (
                        <ArrowUpDown className={cn(
                          'h-3 w-3',
                          sortDirection === 'desc' && 'rotate-180'
                        )} />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {sortedCards.map((card) => (
              <tr
                key={card.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                onClick={() => handleCardClick(card.id)}
              >
                {/* Title */}
                {visibleColumns.has('title') && (
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {card.title}
                      </div>
                      {card.description && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                          {card.description}
                        </div>
                      )}
                    </div>
                  </td>
                )}

                {/* List */}
                {visibleColumns.has('list') && (
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {card.listName}
                    </span>
                  </td>
                )}

                {/* Labels */}
                {visibleColumns.has('labels') && (
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {card.labelIds?.slice(0, 2).map((labelId) => {
                        const label = board.labels.find(l => l.id === labelId);
                        if (!label) return null;
                        return (
                          <span
                            key={label.id}
                            className={cn(
                              'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white',
                              label.color
                            )}
                          >
                            {label.text}
                          </span>
                        );
                      })}
                      {(card.labelIds?.length ?? 0) > 2 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          +{(card.labelIds?.length ?? 0) - 2}
                        </span>
                      )}
                    </div>
                  </td>
                )}

                {/* Members */}
                {visibleColumns.has('members') && (
                  <td className="px-4 py-3">
                    <div className="flex -space-x-1">
                      {getCardMembers(card.members).slice(0, 3).map((member, index) => (
                        <div
                          key={member.id}
                          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-xs font-medium text-white dark:border-slate-900"
                          style={{ zIndex: 3 - index }}
                          title={member.name}
                        >
                          {member.name
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .toUpperCase()}
                        </div>
                      ))}
                      {card.members.length > 3 && (
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-xs font-medium text-slate-600 dark:border-slate-900 dark:bg-slate-600 dark:text-slate-300"
                          style={{ zIndex: 0 }}
                        >
                          +{card.members.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                )}

                {/* Priority */}
                {visibleColumns.has('priority') && (
                  <td className="px-4 py-3">
                    {card.priority ? (
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                          card.priority >= 80 ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                            card.priority >= 50 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                              card.priority >= 20 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        )}>
                          {card.priority}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">No priority</span>
                    )}
                  </td>
                )}

                {/* Due Date */}
                {visibleColumns.has('dueDate') && (
                  <td className="px-4 py-3">
                    {card.dueDate ? (
                      <div className="text-sm text-slate-900 dark:text-slate-100">
                        {formatDate(card.dueDate)}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">No due date</span>
                    )}
                  </td>
                )}

                {/* Created Date */}
                {visibleColumns.has('createdAt') && (
                  <td className="px-4 py-3">
                    {card.createdAt ? (
                      <div className="text-sm text-slate-900 dark:text-slate-100" title={formatDate(card.createdAt)}>
                        {formatRelativeTime(card.createdAt)}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">Unknown</span>
                    )}
                  </td>
                )}

                {/* Progress */}
                {visibleColumns.has('progress') && (
                  <td className="px-4 py-3">
                    {card.checklist.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2 dark:bg-slate-700">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${getChecklistProgress(card.checklist)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {getChecklistProgress(card.checklist)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">No checklist</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {sortedCards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-lg font-medium text-slate-600 dark:text-slate-400">
              No cards found
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-500">
              {searchTerm ? 'Try adjusting your search' : 'Add some cards to see them here'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
