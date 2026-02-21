import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className, open = false, onClose, children, ...props }, ref) => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal content */}
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

Modal.displayName = 'Modal';

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

ModalHeader.displayName = 'ModalHeader';

export const ModalTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold text-slate-900 dark:text-slate-100', className)}
      {...props}
    />
  )
);

ModalTitle.displayName = 'ModalTitle';

export const ModalBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 overflow-y-auto max-h-[60vh]', className)}
      {...props}
    />
  )
);

ModalBody.displayName = 'ModalBody';

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

ModalFooter.displayName = 'ModalFooter';
