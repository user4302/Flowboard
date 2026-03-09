/**
 * TypeScript types for the BoardSidebar component
 */

import { List, User } from '@/lib/types';

export interface Board {
  id: string;
  name: string;
  lists: List[];
  members: User[];
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
