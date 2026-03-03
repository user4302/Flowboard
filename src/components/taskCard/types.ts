import { Card as CardType, User as UserType, Label } from '@/lib/types';

export interface CardProps {
  card: CardType;
  members: UserType[];
  onClick: () => void;
}

export interface CardContextMenuProps {
  card: CardType;
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  onOpenCard: () => void;
}

export interface CardMembersProps {
  members: UserType[];
  maxVisible?: number;
}

export interface CardLabelsProps {
  labelIds: string[];
  labels: Label[];
  onLabelClick?: (labelId: string) => void;
}

export interface CardMetaProps {
  card: CardType;
  isOverdue: boolean;
  checklistProgress: number;
}

export interface CardCompletionProps {
  completed: boolean;
  onToggle: (e: React.MouseEvent) => void;
  size?: 'small' | 'medium' | 'large';
}

export interface ChecklistManagerProps {
  cardId: string;
  boardId: string;
  checklist: Array<{ id: string; text: string; done: boolean }>;
  onAddItem: (text: string) => void;
  onToggleItem: (itemId: string, done: boolean) => void;
  onDeleteItem: (itemId: string) => void;
}

export interface PopoverCoords {
  top?: number;
  bottom?: number;
  left: number;
}
