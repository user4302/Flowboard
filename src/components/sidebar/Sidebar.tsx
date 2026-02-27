'use client';

import { Plus } from 'lucide-react';
import { useBoardStore, useUIStore } from '@/store';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  SidebarBackdrop,
  SidebarHeader,
  BoardList
} from './components';
import { useSidebarState } from './hooks';

/**
 * Sidebar component - Main navigation sidebar for the Flowboard application
 * Provides access to boards, sharing features, and quick actions
 * Features responsive design with mobile backdrop and collapsible navigation
 */
export function Sidebar() {
  // Store hooks for state management
  const { boards, currentBoardId, createBoard, setCurrentBoard, deleteBoard } = useBoardStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  // Local state for board creation
  const { isCreatingBoard, setIsCreatingBoard } = useSidebarState();

  /**
   * Handles the creation of a new board
   * Validates input, creates board, and resets form state
   */
  const handleCreateBoard = (boardName: string) => {
    createBoard(boardName);
    setIsCreatingBoard(false);
  };

  /**
   * Handles board deletion with confirmation
   * Prevents deletion of the last board and switches to another board if current is deleted
   */
  const handleDeleteBoard = (boardId: string, boardName: string) => {
    if (confirm(`Are you sure you want to delete "${boardName}"? This action cannot be undone.`)) {
      deleteBoard(boardId);
      if (currentBoardId === boardId) {
        // Switch to another board if current board is deleted
        const remainingBoards = boards.filter(b => b.id !== boardId);
        if (remainingBoards.length > 0) {
          setCurrentBoard(remainingBoards[0].id);
        }
      }
    }
  };

  const handleStartCreatingBoard = () => {
    setIsCreatingBoard(true);
  };

  const handleCancelCreation = () => {
    setIsCreatingBoard(false);
  };

  return (
    <>
      {/* Mobile backdrop - closes sidebar when clicked */}
      <SidebarBackdrop
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Sidebar - Fixed positioning with responsive behavior */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-900 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header - App branding and mobile close button */}
          <SidebarHeader onClose={() => setSidebarOpen(false)} />

          {/* Boards Section - Board list and creation */}
          <div className="flex-1 overflow-y-auto p-4">
            <BoardList
              boards={boards}
              currentBoardId={currentBoardId}
              isCreatingBoard={isCreatingBoard}
              onSelectBoard={setCurrentBoard}
              onDeleteBoard={handleDeleteBoard}
              onCreateBoard={handleCreateBoard}
              onCancelCreation={handleCancelCreation}
              onCloseSidebar={() => setSidebarOpen(false)}
              onStartCreatingBoard={handleStartCreatingBoard}
            />

            {/* Footer - App version information */}
            <div className="border-t border-slate-200 p-4 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Flowboard v1.1.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
