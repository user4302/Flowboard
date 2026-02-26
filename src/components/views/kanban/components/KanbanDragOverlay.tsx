'use client';

import { DragOverlay } from '@dnd-kit/core';
import { Card } from '@/components/card';

interface KanbanDragOverlayProps {
  activeId: string | null;
  getActiveCard: () => any;
  members: any[];
}

/**
 * KanbanDragOverlay component - Provides visual feedback during drag operations
 */
export function KanbanDragOverlay({ activeId, getActiveCard, members }: KanbanDragOverlayProps) {
  return (
    <DragOverlay>
      {activeId ? (
        <div className="rotate-2 transform opacity-90">
          <Card
            card={getActiveCard()!}
            members={members}
            onClick={() => { }}
          />
        </div>
      ) : null}
    </DragOverlay>
  );
}
