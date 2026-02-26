import { forwardRef } from 'react';
import { DragOverlay } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

export interface DragOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  activeId: string | null;
  children: React.ReactNode;
}

/**
 * DragOverlay component - A reusable drag overlay wrapper using @dnd-kit/core
 * Provides visual feedback during drag operations with rotation and opacity effects
 */
export const DragOverlayWrapper = forwardRef<HTMLDivElement, DragOverlayProps>(
  ({ className, activeId, children, ...props }, ref) => {
    return (
      <DragOverlay>
        {activeId ? (
          <div
            ref={ref}
            className={cn("rotate-2 transform opacity-90", className)}
            {...props}
          >
            {children}
          </div>
        ) : null}
      </DragOverlay>
    );
  }
);

DragOverlayWrapper.displayName = 'DragOverlayWrapper';
