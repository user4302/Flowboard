/**
 * TypeScript types for the BoardSidebar component
 */

export interface Board {
  id: string;
  name: string;
  lists: any[];
  members: any[];
}

export interface SidebarState {
  isCreatingBoard: boolean;
  newBoardName: string;
}

export interface BoardActions {
  handleCreateBoard: () => void;
  handleDeleteBoard: (boardId: string, boardName: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}
