export interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DeleteConfirmation {
  isOpen: boolean;
  archivedCardId: string;
  cardTitle: string;
}

export interface ArchivedCardItemProps {
  archivedCard: any;
  onUnarchive: (archivedCardId: string) => void;
  onPermanentlyDelete: (archivedCardId: string, cardTitle: string) => void;
  isProcessing: boolean;
  currentBoard: any;
  formatDate: (date: Date) => string;
}

export interface EmptyStateProps {
  archivedCardsLength: number;
}
