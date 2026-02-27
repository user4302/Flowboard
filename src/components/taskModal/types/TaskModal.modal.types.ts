import { Card, Label } from '@/lib/types';

export interface CardModalData {
  currentBoard: any;
  foundCard: Card | null | undefined;
  boardLabels: Label[];
}

export interface CardModalHandlers {
  handleSave: (data: any) => void;
  handleToggleCompleted: () => void;
}
