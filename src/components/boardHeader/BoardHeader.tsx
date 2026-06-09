'use client';

import { useState, useEffect } from 'react';
import { Menu, Archive } from 'lucide-react';
import { useBoardStore, useUIStore } from '@/store';
import { useSharingStore } from '@/store/sharingStore';
import { Button } from '@/components/ui';
import { InviteModal, MemberManagement } from '@/components/boardShare';
import { SearchAndFilter } from '@/components/searchAndFilter';
import { BoardHeaderTitle } from './components/BoardHeaderTitle';
import { BoardHeaderViewNavigation } from './components/BoardHeaderViewNavigation';
import { BoardHeaderActionMenu } from './components/BoardHeaderActionMenu';
import { ArchiveModal } from '@/components/archiveModal';

/**
 * BoardHeader Component
 * 
 * The main header component for the interface that provides:
 * - Title editing functionality
 * - View switching between different views
 * - Search functionality for cards
 * - Theme toggling (light/dark mode)
 * - Data export/import functionality
 * - Member display and management
 * - Responsive design for mobile and desktop
 * 
 * Features:
 * - Inline title editing with keyboard shortcuts
 * - Export data to JSON file
 * - Import data from JSON file
 * - Search across all card titles and descriptions
 * - Visual member avatars with overflow indicator
 * - Mobile-responsive view tabs
 */
export function BoardHeader() {
  // Store hooks for data and UI state management
  const { boards, currentBoardId, setCurrentBoard, getCurrentBoard } = useBoardStore();
  const {
    currentView,
    sidebarOpen,
    theme,
    setCurrentView,
    setSidebarOpen,
    setTheme,
  } = useUIStore();

  const {
    showInviteModal,
    showMemberManagement,
    isOwner,
    setShowInviteModal,
    setShowMemberManagement
  } = useSharingStore();

  // Archived cards modal state
  const [showArchivedCards, setShowArchivedCards] = useState(false);

  // Find the current board from the boards array
  const currentBoard = boards.find(board => board.id === currentBoardId);

  // Update document title
  useEffect(() => {
    if (currentBoard) {
      document.title = `Flowboard | ${currentBoard.name}`;
    } else {
      document.title = 'Flowboard';
    }
  }, [currentBoard]);
  const archivedCardsCount = currentBoard?.archivedCards?.length || 0;

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Always show header, even when no board is selected
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/80">
        <div className="flex h-16 items-center px-4 md:px-6 w-full">
          {/* Left side - Menu button and board title */}
          <div className="flex items-center gap-2 flex-shrink-0 md:w-1/5">
            {/* Mobile menu button - hidden on larger screens */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Title with inline editing capability */}
            <BoardHeaderTitle currentBoard={currentBoard!} />
          </div>

          {/* Center - View navigation tabs and search - Stack on mobile */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            {currentBoard && (
              <div className="flex items-center gap-4">
                {/* View navigation tabs */}
                <BoardHeaderViewNavigation
                  currentView={currentView}
                  onViewChange={(viewId: string) => setCurrentView(viewId as 'kanban' | 'timeline' | 'calendar' | 'table')}
                />
              </div>
            )}
          </div>

          {/* Right side - Search and action menu */}
          <div className="flex items-center justify-end gap-3 flex-shrink-0 md:w-2/5">
            {/* Search and Filter Bar */}
            {currentBoard && (
              <div className="flex-1 max-w-sm hidden md:block">
                <SearchAndFilter boardId={currentBoard.id} compact={true} />
              </div>
            )}

            {/* Action menu */}
            <BoardHeaderActionMenu
              currentBoard={currentBoard!}
              isOwner={isOwner}
              onInviteModalOpen={() => setShowInviteModal(true)}
              onMemberManagementOpen={() => setShowMemberManagement(true)}
            />

            {/* Archived cards button */}
            {currentBoard && archivedCardsCount > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowArchivedCards(true)}
                className="relative"
                title={`View ${archivedCardsCount} archived ${archivedCardsCount === 1 ? 'card' : 'cards'}`}
              >
                <Archive className="h-5 w-5" />
                {archivedCardsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                    {archivedCardsCount}
                  </span>
                )}
              </Button>
            )}
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

      {/* Archived Cards Modal */}
      <ArchiveModal
        isOpen={showArchivedCards}
        onClose={() => setShowArchivedCards(false)}
      />
    </>
  );
}
