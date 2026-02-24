'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/board/Sidebar';
import { BoardHeader } from '@/components/board/BoardHeader';
import { KanbanView, TimelineView, CalendarView, TableView } from '@/components/views';
import { CardModal } from '@/components/card';
import { JoinBoardModal } from '@/components/sharing';
import { useBoard, useUIStore } from '@/hooks';
import { useSharingStore } from '@/store/sharingStore';

export default function Home() {
  const { currentBoard, currentBoardId, createBoard, boards } = useBoard();
  const { currentView, initializeTheme } = useUIStore();
  const { showJoinModal, setShowJoinModal } = useSharingStore();
  const [inviteId, setInviteId] = useState<string | null>(null);

  useEffect(() => {
    initializeTheme();

    // Check for invitation in URL
    const urlParams = new URLSearchParams(window.location.search);
    const invite = urlParams.get('invite');
    if (invite) {
      setInviteId(invite);
      setShowJoinModal(true);
    }
  }, [initializeTheme, setShowJoinModal]);

  const handleCreateBoard = () => {
    const board = createBoard('New Board');
    // The board store will automatically set this as current board
  };

  if (!currentBoard || !currentBoardId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Welcome to Flowboard
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {boards.length === 0
                ? "Create your first board to get started"
                : "Select a board from the sidebar or create a new one"
              }
            </p>
          </div>

          {boards.length === 0 && (
            <button
              onClick={handleCreateBoard}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Create Your First Board
            </button>
          )}

          {boards.length > 0 && (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Please select a board from the sidebar
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'kanban':
        return <KanbanView boardId={currentBoardId} />;
      case 'timeline':
        return <TimelineView boardId={currentBoardId} />;
      case 'calendar':
        return <CalendarView boardId={currentBoardId} />;
      case 'table':
        return <TableView boardId={currentBoardId} />;
      default:
        return <KanbanView boardId={currentBoardId} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />

      <div className="flex flex-1 flex-col lg:ml-64">
        <BoardHeader />

        <main className="flex-1 overflow-hidden">
          {renderCurrentView()}
        </main>
      </div>

      <CardModal />
      <JoinBoardModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        inviteId={inviteId || undefined}
      />
    </div>
  );
}
