import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Modal component props interface
 * Extends standard HTML div attributes with modal-specific props
 */
export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement> {
  // Whether the modal is currently open
  open?: boolean;
  // Function to call when the modal should be closed
  onClose?: () => void;
}

/**
 * Modal component - A flexible modal dialog component
 * Features backdrop overlay, responsive sizing, and accessibility
 * Renders as null when not open for performance
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className, open = false, onClose, children, ...props }, ref) => {
    // Early return if modal is closed
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop overlay - closes modal when clicked */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal content container */}
        <div
          ref={ref}
          className={cn(
            'relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

// Set display name for debugging purposes
Modal.displayName = 'Modal';

/**
 * ModalHeader component - Header section for modal dialogs
 * Contains title and close button with bottom border
 */
export const ModalHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700',
        className
      )}
      {...props}
    />
  )
);

// Set display name for debugging purposes
ModalHeader.displayName = 'ModalHeader';

/**
 * ModalTitle component - Title heading for modal dialogs
 * Styled as h2 element with appropriate typography
 */
export const ModalTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold text-slate-900 dark:text-slate-100', className)}
      {...props}
    />
  )
);

// Set display name for debugging purposes
ModalTitle.displayName = 'ModalTitle';

/**
 * ModalBody component - Main content area for modal dialogs
 * Features vertical scrolling with max height constraint
 */
export const ModalBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 overflow-y-auto max-h-[60vh]', className)}
      {...props}
    />
  )
);

// Set display name for debugging purposes
ModalBody.displayName = 'ModalBody';

/**
 * ModalFooter component - Footer section for modal dialogs
 * Contains action buttons with top border and right alignment
 */
export const ModalFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700',
        className
      )}
      {...props}
    />
  )
);

// Set display name for debugging purposes
ModalFooter.displayName = 'ModalFooter';
