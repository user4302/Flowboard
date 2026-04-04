'use client';

import { useState } from 'react';
import {
  Upload,
  Download,
  Share2,
  UserPlus,
  Users,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { getContrastColor } from '@/lib/colorUtils';
import { useBoardHeaderActions } from '../hooks/useBoardHeaderActions';
import { useClickOutside } from '@/hooks';
import { Board } from '@/lib/types';

interface BoardHeaderActionMenuProps {
  currentBoard: Board;
  isOwner: boolean;
  onInviteModalOpen: () => void;
  onMemberManagementOpen: () => void;
}

/**
 * BoardHeaderActionMenu component with dropdown for operations
 * 
 * Provides access to:
 * - Import/Export functionality
 * - Member management (owner only)
 * - Team members and settings (placeholder)
 */
export function BoardHeaderActionMenu({
  currentBoard,
  isOwner,
  onInviteModalOpen,
  onMemberManagementOpen
}: BoardHeaderActionMenuProps) {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const { handleExportBoard, handleImportBoard } = useBoardHeaderActions(currentBoard);
  const actionMenuRef = useClickOutside<HTMLDivElement>(() => setShowActionMenu(false));

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowActionMenu(!showActionMenu)}
        title="Actions"
      >
        <MoreHorizontal className="h-5 w-5" />
      </Button>

      {/* Action menu dropdown */}
      {showActionMenu && (
        <div ref={actionMenuRef} className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-50 dark:bg-slate-800 dark:border-slate-600 w-48">
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
                handleExportBoard();
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
                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                onClick={() => {
                  onInviteModalOpen();
                  setShowActionMenu(false);
                }}
              >
                <Share2 className="h-4 w-4" />
                <span>Invite Members</span>
              </button>
            )}

            {/* Member Management - Owner only */}
            {isOwner && (
              <button
                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                onClick={() => {
                  onMemberManagementOpen();
                  setShowActionMenu(false);
                }}
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

      {/* Hidden file input for import */}
      <input
        type="file"
        accept=".json"
        onChange={handleImportBoard}
        className="hidden"
        id="board-import"
      />
    </div>
  );
}
