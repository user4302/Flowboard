'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import { BoardItem } from './BoardItem';
import { BoardCreationForm } from './BoardCreationForm';
import type { Board } from '../types/sidebar.types';

/**
 * Board list component with creation functionality
 * Displays all boards and provides interface for creating new ones
 */
export function BoardList({
  boards,
  currentBoardId,
  isCreatingBoard,
  onSelectBoard,
  onDeleteBoard,
  onCreateBoard,
  onCancelCreation,
  onCloseSidebar,
  onStartCreatingBoard
}: {
  boards: Board[];
  currentBoardId: string | null;
  isCreatingBoard: boolean;
  onSelectBoard: (boardId: string) => void;
  onDeleteBoard: (boardId: string, boardName: string) => void;
  onCreateBoard: (name: string) => void;
  onCancelCreation: () => void;
  onCloseSidebar: () => void;
  onStartCreatingBoard?: () => void;
}) {
  const handleSelectBoard = (boardId: string) => {
    onSelectBoard(boardId);
    onCloseSidebar();
  };

  return (
    <div className="mb-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Your Boards
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onStartCreatingBoard}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* New Board Input - Inline form for creating new boards */}
      {isCreatingBoard && (
        <BoardCreationForm
          onCreateBoard={onCreateBoard}
          onCancel={onCancelCreation}
        />
      )}

      {/* Boards List - Interactive list of all boards */}
      <div className="space-y-1">
        {boards.map((board) => (
          <BoardItem
            key={board.id}
            board={board}
            isActive={currentBoardId === board.id}
            onSelect={handleSelectBoard}
            onDelete={onDeleteBoard}
          />
        ))}
      </div>
    </div>
  );
}
