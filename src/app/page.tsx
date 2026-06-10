'use client';

import { useEffect, useState } from 'react';
import { BoardSidebar } from '@/components/boardSidebar';
import { BoardHeader } from '@/components/boardHeader';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import { FilterSheet } from '@/components/mobile/FilterSheet';
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
  const [isClosingModal, setIsClosingModal] = useState(false);

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
    const globalIsClosingModal = (window as any).__isClosingModal || false;
    if (pathSegments.length >= 5 && pathSegments[1] === 'board' && pathSegments[3] === 'card' && !isClosingModal && !globalIsClosingModal) {
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
      } else {
        // Board not found, redirect to root but maintain clean URL
        window.history.pushState({}, '', '/');
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

        <div className={`flex h-dvh w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-opacity duration-500 ${showWelcomeScreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <BoardSidebar />
          <div className="flex flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-slate-900 lg:ml-64 w-full">
            <BoardHeader />
            <main className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
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

  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <BoardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-slate-900 lg:ml-64 w-full">
        <BoardHeader />

        <main className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900 pb-16 md:pb-0">
          {renderCurrentView()}
        </main>
        <MobileBottomNav />
      </div>

      <FilterSheet boardId={currentBoardId!} />

      <TaskModal />
      <JoinBoardModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        inviteId={inviteId || undefined}
      />
    </div>
  );
}
