'use client';

import { X } from 'lucide-react';

/**
 * Props for the ConfirmationModal component
 */
interface ConfirmationModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal is closed */
  onClose: () => void;
  /** Function to call when the confirmation is confirmed */
  onConfirm: () => void;
  /** Title displayed in the modal header */
  title: string;
  /** Content/message displayed in the modal body */
  content: string;
  /** Text for the confirm button (default: 'Confirm') */
  confirmText?: string;
  /** Text for the cancel button (default: 'Cancel') */
  cancelText?: string;
  /** Visual variant for the modal (default: 'danger') */
  variant?: 'danger' | 'warning' | 'info';
  /** Whether the confirm action is currently processing */
  isProcessing?: boolean;
}

/**
 * ConfirmationModal component - Reusable modal for confirming dangerous actions
 * 
 * Provides a consistent interface for confirming potentially destructive actions
 * like deletion, with support for different visual variants and processing states.
 * 
 * @param props - Component props containing modal configuration
 * @returns A rendered confirmation modal or null if not open
 */

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isProcessing = false,
}: ConfirmationModalProps) {
  // Note: Confirmation dialogs should NOT close on outside click per UX standards
  // Users must explicitly choose Cancel or Confirm for destructive actions
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          confirmBg: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
          confirmText: 'text-white',
          iconBg: 'bg-red-100 dark:bg-red-900/20',
          iconColor: 'text-red-600 dark:text-red-400',
        };
      case 'warning':
        return {
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600',
          confirmText: 'text-white',
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
        };
      case 'info':
      default:
        return {
          confirmBg: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
          confirmText: 'text-white',
          iconBg: 'bg-blue-100 dark:bg-blue-900/20',
          iconColor: 'text-blue-600 dark:text-blue-400',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${styles.iconBg}`}>
                <X className={`h-5 w-5 ${styles.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-slate-700 dark:text-slate-300">
              {content}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-600">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className={`px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${styles.confirmBg} ${styles.confirmText}`}
            >
              {isProcessing ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
