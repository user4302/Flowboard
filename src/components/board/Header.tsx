'use client';

import { useState, useRef } from 'react';
import { Search, Menu, Sun, Moon, Users, Plus, Download, Upload, UserPlus, MoreHorizontal, Menu as MenuIcon, Share2, Settings, X, Calendar } from 'lucide-react';
import { useBoardStore, useUIStore } from '@/store';
import { fromUTCString } from '@/lib/dateUtils';
import { useSharingStore } from '@/store/sharingStore';
import { Button, Input } from '@/components/ui';
import { VIEWS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { InviteModal, MemberManagement } from '@/components/sharing';
import { SearchAndFilterBar } from '@/components/search';

/**
 * Header Component
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
export function Header() {
  // Store hooks for board and UI state management
  const { boards, currentBoardId, updateBoard, setCurrentBoard } = useBoardStore();
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

  const {
    showInviteModal,
    showMemberManagement,
    isOwner,
    setShowInviteModal,
    setShowMemberManagement
  } = useSharingStore();

  // Local state for board title editing and menu
  const [isEditingTitle, setIsEditingTitle] = useState(false); // Track if title is being edited
  const [tempTitle, setTempTitle] = useState(''); // Temporary storage for edited title
  const [showActionMenu, setShowActionMenu] = useState(false); // Track hamburger menu state

  // Find the current board from the boards array
  const currentBoard = boards.find(board => board.id === currentBoardId);

  /**
   * Handle board title editing initiation
   * 
   * Sets up editing state and copies the current title to temp storage
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
   * - Escape: Cancel editing and revert to the original title
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
        labels: currentBoard.labels,
        lists: currentBoard.lists.map(list => ({
          title: list.title,
          cards: list.cards.map(card => ({
            title: card.title,
            description: card.description,
            startDate: card.startDate,
            dueDate: card.dueDate,
            labelIds: card.labelIds,
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

                // Validate dates before importing
                let startDate: Date | undefined = cardData.startDate;
                let dueDate: Date | undefined = cardData.dueDate;

                // Convert string dates to Date objects using fromUTCString
                if (typeof cardData.startDate === 'string') {
                  const date = fromUTCString(cardData.startDate);
                  if (date && !isNaN(date.getTime())) {
                    startDate = date;
                  } else {
                    console.warn('Invalid start date format:', cardData.startDate);
                    startDate = undefined;
                  }
                }

                if (typeof cardData.dueDate === 'string') {
                  const date = fromUTCString(cardData.dueDate);
                  if (date && !isNaN(date.getTime())) {
                    dueDate = date;
                  } else {
                    console.warn('Invalid due date format:', cardData.dueDate);
                    dueDate = undefined;
                  }
                }

                useBoardStore.getState().updateCard(newBoard.id, card.id, {
                  description: cardData.description,
                  startDate,
                  dueDate,
                });

                // Store a mapping of old label IDs (from file) to new label IDs (created in store)
                const labelMap = new Map<string, string>();

                // Recreate labels at board level if they exist
                if (boardData.labels) {
                  boardData.labels.forEach((labelData: any) => {
                    const existing = newBoard.labels.find(l => l.text === labelData.text && l.color === labelData.color);
                    if (existing) {
                      labelMap.set(labelData.id, existing.id);
                    } else {
                      const newLabel = useBoardStore.getState().createBoardLabel(newBoard.id, {
                        text: labelData.text,
                        color: labelData.color
                      });
                      labelMap.set(labelData.id, newLabel.id);
                    }
                  });
                }

                // Add labels to the card (handle both old and new formats)
                const importedLabelIds = cardData.labelIds || [];
                const importedLabels = cardData.labels || []; // Backward compatibility

                // Add by ID
                importedLabelIds.forEach((oldId: string) => {
                  const newId = labelMap.get(oldId);
                  if (newId) {
                    useBoardStore.getState().addLabelToCard(newBoard.id, card.id, newId);
                  }
                });

                // Add by text/color logic for old format
                importedLabels.forEach((labelData: any) => {
                  const existing = newBoard.labels.find(l => l.text === labelData.text && l.color === labelData.color);
                  if (existing) {
                    useBoardStore.getState().addLabelToCard(newBoard.id, card.id, existing.id);
                  } else {
                    const newLabel = useBoardStore.getState().createBoardLabel(newBoard.id, {
                      text: labelData.text,
                      color: labelData.color
                    });
                    useBoardStore.getState().addLabelToCard(newBoard.id, card.id, newLabel.id);
                  }
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

            // Force UI update by switching to the new board
            setCurrentBoard(newBoard.id);
          }
        } catch (error) {
          console.error('Error importing board:', error);
          alert('Error importing board. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Always show header, even when no board is selected
  return (
    <>
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
                  {currentBoard ? currentBoard.name : null}
                </h1>
              )}
            </div>
          </div>

          {/* Center - View navigation tabs and search */}
          <div className="flex items-center justify-center w-3/5">
            {currentBoard && (
              <div className="flex items-center gap-4">
                {/* View navigation tabs */}
                <div className="flex items-center gap-2">
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
            )}
          </div>

          {/* Right side - Search and hamburger menu */}
          <div className="flex items-center justify-end gap-3 flex-shrink-0 w-2/5">
            {/* Search and Filter Bar */}
            {currentBoard && (
              <div className="flex-1 max-w-sm">
                <SearchAndFilterBar boardId={currentBoard.id} compact={true} />
              </div>
            )}
            {/* Hamburger menu for actions */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowActionMenu(!showActionMenu)}
                title="Actions"
              >
                <MenuIcon className="h-5 w-5" />
              </Button>

              {/* Action menu dropdown */}
              {showActionMenu && (
                <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-50 dark:bg-slate-800 dark:border-slate-600 w-48">
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        document.getElementById('board-import')?.click();
                        setShowActionMenu(false);
                      }}
                      className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors duration-150 ease-in-out dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                    >
                      <Upload className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span>Import Board</span>
                    </button>
                    <button
                      onClick={() => {
                        if (currentBoard) {
                          handleExportBoard();
                        }
                        setShowActionMenu(false);
                      }}
                      disabled={!currentBoard}
                      className={cn(
                        "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out",
                        currentBoard
                          ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                          : "text-slate-400 cursor-not-allowed dark:text-slate-600"
                      )}
                    >
                      <Download className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span>Export Board</span>
                    </button>

                    {/* Divider */}
                    <div className="border-t border-slate-200 dark:border-slate-600 my-1"></div>

                    {/* Invite Members - Owner only */}
                    {isOwner && (
                      <button
                        onClick={() => {
                          setShowInviteModal(true);
                          setShowActionMenu(false);
                        }}
                        className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Invite Members</span>
                      </button>
                    )}

                    {/* Member Management - Owner only */}
                    {isOwner && (
                      <button
                        onClick={() => {
                          setShowMemberManagement(true);
                          setShowActionMenu(false);
                        }}
                        className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Member Management</span>
                      </button>
                    )}

                    {/* Team Members */}
                    <button
                      onClick={() => {
                        alert('Team Members feature coming soon!');
                        setShowActionMenu(false);
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Users className="h-4 w-4" />
                      <span>Team Members</span>
                    </button>

                    {/* Settings */}
                    <button
                      onClick={() => {
                        alert('Settings feature coming soon!');
                        setShowActionMenu(false);
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden file input for import */}
            <input
              type="file"
              accept=".json"
              onChange={handleImportBoard}
              className="hidden"
              id="board-import"
            />
          </div>
        </div>
      </header>

      {/* Sharing Modals */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
      <MemberManagement
        isOpen={showMemberManagement}
        onClose={() => setShowMemberManagement(false)}
      />
    </>
  );
}
