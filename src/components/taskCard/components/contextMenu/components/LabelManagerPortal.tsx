import { createPortal } from 'react-dom';
import { useClickOutside } from '@/hooks';
import { TaskModalLabelManager } from '@/components/taskModal/components/LabelManager/TaskModalLabelManager';
import { LabelManagerPosition } from '../types';

/**
 * Props for the label manager portal component
 */
interface LabelManagerPortalProps {
  /** Whether the label manager should be shown */
  show: boolean;
  /** Position where the label manager should appear */
  position: LabelManagerPosition;
  /** Board ID for the label manager */
  boardId: string;
  /** Card ID for the label manager */
  cardId: string;
  /** Currently selected label IDs */
  selectedLabelIds: string[];
  /** Function to call when the label manager should close */
  onClose: () => void;
  /** Optional additional refs to exclude from click-outside detection */
  additionalRefs?: React.RefObject<Node>[];
}

/**
 * Renders the label manager as a portal to avoid z-index issues
 * Handles click-outside detection and positioning
 */
export function LabelManagerPortal({
  show,
  position,
  boardId,
  cardId,
  selectedLabelIds,
  onClose,
  additionalRefs,
}: LabelManagerPortalProps) {
  const labelManagerRef = useClickOutside<HTMLDivElement>(onClose, additionalRefs);

  if (!show || !boardId) {
    return null;
  }

  return createPortal(
    <div
      ref={labelManagerRef}
      className="fixed z-50"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
      data-portal="label-manager"
    >
      <TaskModalLabelManager
        boardId={boardId}
        cardId={cardId}
        selectedLabelIds={selectedLabelIds}
        onClose={onClose}
      />
    </div>,
    document.body
  );
}
