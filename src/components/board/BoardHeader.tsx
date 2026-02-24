'use client';

import { useState } from 'react';
import { Search, Menu, Sun, Moon, Users, Plus, Download, Upload } from 'lucide-react';
import { useBoardStore, useUIStore } from '@/store';
import { Button, Input } from '@/components/ui';
import { VIEWS } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * BoardHeader Component
 * 
 * The main header component for the board interface that provides:
 * - Board title editing functionality
 * - View switching between different board views
 * - Search functionality for cards
 * - Theme toggling (light/dark mode)
 * - Board export/import functionality
 * - Member display and management
 * - Responsive design for mobile and desktop
 * 
 * Features:
 * - Inline board title editing with keyboard shortcuts
 * - Export board data to JSON file
 * - Import board data from JSON file
 * - Search across all card titles and descriptions
 * - Visual member avatars with overflow indicator
 * - Mobile-responsive view tabs
 */
export function BoardHeader() {
  // Store hooks for board and UI state management
  const { boards, currentBoardId, updateBoard } = useBoardStore();
  const {
    currentView,
    sidebarOpen,
    theme,
    setCurrentView,
    setSidebarOpen,
    setTheme,
    searchTerm,
    setSearchTerm,
  } = useUIStore();

  // Local state for board title editing
  const [isEditingTitle, setIsEditingTitle] = useState(false); // Track if title is being edited
  const [tempTitle, setTempTitle] = useState(''); // Temporary storage for edited title

  // Find the current board from the boards array
  const currentBoard = boards.find(board => board.id === currentBoardId);

  /**
   * Handle board title editing initiation
   * 
   * Sets up the editing state and copies the current title to temp storage
   */
  const handleTitleEdit = () => {
    if (currentBoard) {
      setTempTitle(currentBoard.name);
      setIsEditingTitle(true);
    }
  };

  /**
   * Handle board title save
   * 
   * Saves the edited title if it's different from the original and not empty.
   * Updates the board state and exits editing mode.
   */
  const handleTitleSave = () => {
    if (currentBoard && tempTitle.trim() && tempTitle !== currentBoard.name) {
      useBoardStore.getState().updateBoard(currentBoard.id, { name: tempTitle.trim() });
    }
    setIsEditingTitle(false);
    setTempTitle('');
  };

  /**
   * Handle keyboard events during title editing
   * 
   * @param e - Keyboard event
   * - Enter: Save the title
   * - Escape: Cancel editing and revert to original title
   */
  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setTempTitle('');
    }
  };

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  /**
   * Export board data to JSON file
   * 
   * Creates a downloadable JSON file containing:
   * - Board name and export timestamp
   * - All lists with their cards
   * - Complete card data including labels, members, dates, etc.
   * 
   * The filename includes the board name and current date for easy identification.
   */
  const handleExportBoard = () => {
    if (currentBoard) {
      // Structure the board data for export
      const boardData = {
        name: currentBoard.name,
        exportDate: new Date().toISOString(),
        lists: currentBoard.lists.map(list => ({
          title: list.title,
          cards: list.cards.map(card => ({
            title: card.title,
            description: card.description,
            startDate: card.startDate,
            dueDate: card.dueDate,
            labels: card.labels,
            members: card.members,
            checklist: card.checklist,
            createdAt: card.createdAt,
            updatedAt: card.updatedAt
          }))
        }))
      };

      // Generate filename with board name and current date
      const filename = `${currentBoard.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;

      // Create and trigger download
      const dataStr = JSON.stringify(boardData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up object URL
    }
  };

  /**
   * Import board data from JSON file
   * 
   * Handles the complete import process:
   * - Validates JSON file format
   * - Creates new board from imported data
   * - Recreates all lists and cards
   * - Preserves card properties (dates, labels, members, checklists)
   * 
   * @param event - File input change event
   */
  const handleImportBoard = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const boardData = JSON.parse(e.target?.result as string);
          if (boardData.name && boardData.lists) {
            // Create new board from imported data
            const newBoard = useBoardStore.getState().createBoard(boardData.name);

            // Import lists and cards with their properties
            boardData.lists.forEach((listData: any, listIndex: number) => {
              const list = useBoardStore.getState().createList(newBoard.id, listData.title, listIndex);

              listData.cards.forEach((cardData: any, cardIndex: number) => {
                const card = useBoardStore.getState().createCard(newBoard.id, list.id, cardData.title, cardIndex);

                // Update card with additional data
                useBoardStore.getState().updateCard(newBoard.id, card.id, {
                  description: cardData.description,
                  startDate: cardData.startDate ? new Date(cardData.startDate) : undefined,
                  dueDate: cardData.dueDate ? new Date(cardData.dueDate) : undefined,
                });

                // Add labels to the card
                cardData.labels?.forEach((label: any) => {
                  useBoardStore.getState().addLabel(newBoard.id, card.id, label);
                });

                // Add members to the card
                cardData.members?.forEach((memberId: string) => {
                  useBoardStore.getState().updateCard(newBoard.id, card.id, {
                    members: [...card.members, memberId]
                  });
                });

                // Add checklist items and their completion status
                cardData.checklist?.forEach((item: any) => {
                  useBoardStore.getState().addChecklistItem(newBoard.id, card.id, item.text);
                  if (item.done) {
                    useBoardStore.getState().updateChecklistItem(newBoard.id, card.id, item.id, { done: true });
                  }
                });
              });
            });
          }
        } catch (error) {
          console.error('Error importing board:', error);
          alert('Error importing board. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Return null if no current board is found
  if (!currentBoard) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/80">
      <div className="flex h-16 items-center px-4 lg:px-6">
        {/* Left side - Menu button and board title */}
        <div className="flex items-center gap-4 flex-shrink-0 w-1/5">
          {/* Mobile menu button - hidden on larger screens */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Board title with inline editing capability */}
          <div className="flex items-center gap-2 truncate">
            {isEditingTitle ? (
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyPress}
                className="rounded-lg border border-slate-300 px-2 py-1 text-lg font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                autoFocus // Auto-focus when entering edit mode
              />
            ) : (
              <h1
                className="cursor-pointer text-lg font-semibold text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300 truncate"
                onClick={handleTitleEdit}
              >
                {currentBoard.name}
              </h1>
            )}
          </div>
        </div>

        {/* Center - View navigation tabs */}
        <div className="flex items-center justify-center w-3/5">
          <div className="hidden md:flex items-center gap-1">
            {VIEWS.map((view) => {
              const Icon = require('lucide-react')[view.icon];
              return (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id as any)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    currentView === view.id
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{view.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side - Export/import, search, members, theme toggle */}
        <div className="flex items-center justify-end gap-3 flex-shrink-0 w-1/5">
          {/* Export/Import buttons */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".json"
              onChange={handleImportBoard}
              className="hidden" // Hidden file input
              id="board-import"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => document.getElementById('board-import')?.click()}
              title="Import board from JSON"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExportBoard}
              title="Export board to JSON"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Search input with icon */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-32 pl-10 sm:w-48 lg:w-64"
            />
          </div>

          {/* Members section with avatars and add button */}
          <div className="flex items-center">
            <div className="flex -space-x-2"> {/* Overlapping avatars */}
              {currentBoard.members.slice(0, 3).map((member: any, index: number) => (
                <div
                  key={member.id}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-xs font-medium text-white dark:border-slate-900"
                  style={{ zIndex: 3 - index }} // Stack avatars with proper z-index
                >
                  {member.name
                    .split(' ')
                    .map((n: string) => n[0]) // Get initials
                    .join('')
                    .toUpperCase()}
                </div>
              ))}
              {/* Overflow indicator for more than 3 members */}
              {currentBoard.members.length > 3 && (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-xs font-medium text-slate-600 dark:border-slate-900 dark:bg-slate-600 dark:text-slate-300"
                  style={{ zIndex: 0 }}
                >
                  +{currentBoard.members.length - 3}
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" className="ml-2">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Theme toggle button */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile view tabs - hidden on desktop */}
      <div className="flex overflow-x-auto border-t border-slate-200 px-2 py-2 dark:border-slate-700 md:hidden">
        {VIEWS.map((view) => {
          const Icon = require('lucide-react')[view.icon];
          return (
            <button
              key={view.id}
              onClick={() => setCurrentView(view.id as any)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap',
                currentView === view.id
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{view.name}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
