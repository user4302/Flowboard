import { Card, Label, Board } from '@/lib/types';

export interface CardModalData {
  currentBoard: Board | null;
  foundCard: Card | null | undefined;
  boardLabels: Label[];
}

export interface CardModalHandlers {
  handleSave: (data: Partial<Card>) => void;
  handleToggleCompleted: () => void;
  handleArchive: () => void;
}
