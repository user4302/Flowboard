'use client';

import { useState } from 'react';
import { Plus, LayoutGrid, Users, Settings, Trash2, Share2, UserPlus } from 'lucide-react';
import { useBoardStore, useUIStore } from '@/store';
import { useSharingStore } from '@/store/sharingStore';
import { Button } from '@/components/ui';
import { InviteModal, MemberManagement } from '@/components/sharing';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { boards, currentBoardId, createBoard, setCurrentBoard, deleteBoard } = useBoardStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const {
    showInviteModal,
    showMemberManagement,
    isOwner,
    setShowInviteModal,
    setShowMemberManagement
  } = useSharingStore();
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createBoard(newBoardName.trim());
      setNewBoardName('');
      setIsCreatingBoard(false);
    }
  };

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateBoard();
    } else if (e.key === 'Escape') {
      setIsCreatingBoard(false);
      setNewBoardName('');
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-900 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-6 w-6 text-indigo-600" />
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Flowboard
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </Button>
          </div>

          {/* Boards Section */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Your Boards
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsCreatingBoard(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* New Board Input */}
              {isCreatingBoard && (
                <div className="mb-3 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                  <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={() => {
                      setTimeout(() => {
                        setIsCreatingBoard(false);
                        setNewBoardName('');
                      }, 200);
                    }}
                    placeholder="Board name..."
                    className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    autoFocus
                  />
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" onClick={handleCreateBoard}>
                      Add
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsCreatingBoard(false);
                        setNewBoardName('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Boards List */}
              <div className="space-y-1">
                {boards.map((board) => (
                  <div key={board.id} className="relative group">
                    <button
                      onClick={() => {
                        setCurrentBoard(board.id);
                        setSidebarOpen(false);
                      }}
                      className={cn(
                        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        currentBoardId === board.id
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <LayoutGrid className="h-4 w-4" />
                          <span className="truncate">{board.name}</span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {board.lists.length} lists • {board.members.length} members
                        </div>
                      </div>
                    </button>

                    {/* Delete button - positioned outside the main button */}
                    {boards.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBoard(board.id, board.name);
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                        title={`Delete ${board.name}`}
                      >
                        <Trash2 className="h-3 w-3 text-slate-400 hover:text-red-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1">
              {isOwner && (
                <>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Invite Members</span>
                  </button>
                  <button
                    onClick={() => setShowMemberManagement(true)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Member Management</span>
                  </button>
                </>
              )}
              <button
                onClick={() => alert('Team Members feature coming soon!')}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Users className="h-4 w-4" />
                <span>Team Members</span>
              </button>
              <button
                onClick={() => alert('Settings feature coming soon!')}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-4 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Flowboard v1.0.0
            </div>
          </div>
        </div>
      </div>

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
