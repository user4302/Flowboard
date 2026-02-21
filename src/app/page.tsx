'use client';

import { useEffect } from 'react';
import { Sidebar } from '@/components/board/Sidebar';
import { BoardHeader } from '@/components/board/BoardHeader';
import { KanbanView, TimelineView, CalendarView, TableView } from '@/components/views';
import { CardModal } from '@/components/card';
import { useBoard, useUIStore } from '@/hooks';

export default function Home() {
  const { currentBoard, currentBoardId } = useBoard();
  const { currentView, initializeTheme } = useUIStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  if (!currentBoard || !currentBoardId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="mb-4 text-lg font-medium text-slate-600 dark:text-slate-400">
            Loading board...
          </div>
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

      <div className="flex flex-1 flex-col">
        <BoardHeader />

        <main className="flex-1 overflow-hidden">
          {renderCurrentView()}
        </main>
      </div>

      <CardModal />
    </div>
  );
}
