'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BoardSidebar } from '@/components/boardSidebar';
import { BoardHeader } from '@/components/boardHeader';
import { KanbanView, TimelineView, CalendarView, TableView } from '@/components/views';
import { TaskModal } from '@/components/taskModal';
import { JoinBoardModal } from '@/components/boardShare';
import { useBoard, useUIStore } from '@/hooks';
import { useBoardStore } from '@/store/boardStore';
import { useSharingStore } from '@/store/sharingStore';

export default function BoardCardPage() {
  const params = useParams();
  const router = useRouter();
  const { boardId, cardId } = params as { boardId: string; cardId: string };

  const { boards, setCurrentBoard } = useBoard();
  const { getCurrentBoard } = useBoardStore();
  const { currentView, initializeTheme, openCardModal } = useUIStore();
  const { showJoinModal, setShowJoinModal } = useSharingStore();

  // Helper function to find board by ID
  const getBoardById = (id: string) => boards.find(board => board.id === id) || null;

  const [inviteId, setInviteId] = useState<string | null>(null);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [isBoardLoading, setIsBoardLoading] = useState(true);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [hasOpenedModal, setHasOpenedModal] = useState(false);

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
      const timeoutId = setTimeout(() => {
        setInviteId(invite);
        setShowJoinModal(true);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    return () => clearTimeout(timer);
  }, [initializeTheme, setShowJoinModal]);

  // Reset hasOpenedModal when cardId changes
  useEffect(() => {
    setHasOpenedModal(false);
  }, [cardId]);

  useEffect(() => {
    // Set current board from URL parameter
    if (boardId) {
      const globalIsClosingModal = (window as any).__isClosingModal || false;
      const board = getBoardById(boardId);

      if (board) {
        setCurrentBoard(boardId);
        setIsBoardLoading(false);

        // Only open modal if we're not in the process of closing it
        // and haven't already opened it for this navigation
        setTimeout(() => {
          const currentGlobalFlag = (window as any).__isClosingModal || false;
          if (cardId && !isClosingModal && !currentGlobalFlag && !hasOpenedModal) {
            setHasOpenedModal(true); // Mark that we've opened the modal
            // Small delay to ensure board is loaded
            setTimeout(() => {
              openCardModal(cardId);
            }, 100);
          }
        }, 50); // Small delay to check flag
      } else {
        // Board not found, redirect to root but maintain clean URL
        router.push('/');
      }
    }
  }, [boardId, cardId, getBoardById, setCurrentBoard, router, openCardModal, isClosingModal, hasOpenedModal]);

  const currentBoard = boardId ? getBoardById(boardId) : null;

  if (isBoardLoading) {
    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
            Loading Board...
          </h2>
        </div>
      </div>
    );
  }

  if (!currentBoard || !boardId) {
    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
            Board Not Found
          </h2>
          <p className="text-slate-500 dark:text-slate-500">
            The requested board could not be found.
          </p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'kanban':
        return <KanbanView boardId={boardId} />;
      case 'timeline':
        return <TimelineView boardId={boardId} />;
      case 'calendar':
        return <CalendarView boardId={boardId} />;
      case 'table':
        return <TableView boardId={boardId} />;
      default:
        return <KanbanView boardId={boardId} />;
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
