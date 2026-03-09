'use client';

import { useEffect, useState } from 'react';
import { BoardSidebar } from '@/components/boardSidebar';
import { BoardHeader } from '@/components/boardHeader';
import { KanbanView, TimelineView, CalendarView, TableView } from '@/components/views';
import { TaskModal } from '@/components/taskModal';
import { JoinBoardModal } from '@/components/boardShare';
import { useBoard, useUIStore } from '@/hooks';
import { useSharingStore } from '@/store/sharingStore';

export default function Home() {
  const { currentBoard, currentBoardId, createBoard, boards, setCurrentBoard } = useBoard();
  const { currentView, initializeTheme, openCardModal } = useUIStore();
  const { showJoinModal, setShowJoinModal } = useSharingStore();
  const [inviteId, setInviteId] = useState<string | null>(null);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  useEffect(() => {
    initializeTheme();

    // Auto-hide welcome screen after 2 seconds
    const timer = setTimeout(() => {
      setShowWelcomeScreen(false);
    }, 500);

    // Check for invitation in URL
    const urlParams = new URLSearchParams(window.location.search);
    const invite = urlParams.get('invite');
    if (invite) {
      // Use setTimeout to avoid calling setState synchronously
      const timeoutId = setTimeout(() => {
        setInviteId(invite);
        setShowJoinModal(true);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    // Check for task modal parameters in URL
    const pathSegments = window.location.pathname.split('/');
    if (pathSegments.length >= 5 && pathSegments[1] === 'board' && pathSegments[3] === 'card') {
      const urlBoardId = pathSegments[2];
      const urlCardId = pathSegments[4];

      // Find the board and set it as current
      const board = boards.find(b => b.id === urlBoardId);
      if (board) {
        setCurrentBoard(urlBoardId);

        // Open the task modal after a short delay
        setTimeout(() => {
          openCardModal(urlCardId);
        }, 100);
      }
    }

    return () => clearTimeout(timer);
  }, [initializeTheme, setShowJoinModal, boards, setCurrentBoard, openCardModal]);

  const handleCreateBoard = () => {
    const board = createBoard('New Board');
    // The board store will automatically set this as current board
  };

  if (!currentBoard || !currentBoardId) {
    return (
      <>
        {/* Welcome screen overlay - truly fullscreen */}
        <div className={`fixed inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-opacity duration-500 z-50 ${showWelcomeScreen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="text-center max-w-md mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Flowboard
              </h1>
            </div>
          </div>
        </div>

        {/* Main app interface - only visible when welcome screen is hidden */}
        <div className={`flex h-screen bg-slate-50 dark:bg-slate-900 transition-opacity duration-500 ${showWelcomeScreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <BoardSidebar />
          <div className="flex flex-1 flex-col lg:ml-64">
            <BoardHeader />
            <main className="flex-1 overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  No Board Selected
                </h2>
                <p className="text-slate-500 dark:text-slate-500">
                  Select a board from the sidebar or create a new one
                </p>
              </div>
            </main>
          </div>
        </div>
      </>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'kanban':
        return <KanbanView boardId={currentBoardId!} />;
      case 'timeline':
        return <TimelineView boardId={currentBoardId!} />;
      case 'calendar':
        return <CalendarView boardId={currentBoardId!} />;
      case 'table':
        return <TableView boardId={currentBoardId!} />;
      default:
        return <KanbanView boardId={currentBoardId!} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <BoardSidebar />

      <div className="flex flex-1 flex-col lg:ml-64">
        <BoardHeader />

        <main className="flex-1 overflow-hidden">
          {renderCurrentView()}
        </main>
      </div>

      <TaskModal />
      <JoinBoardModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        inviteId={inviteId || undefined}
      />
    </div>
  );
}
