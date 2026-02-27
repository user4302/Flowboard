'use client';

import { X } from 'lucide-react';
import { ModalHeader as UIModalHeader, ModalTitle } from '@/components/ui';

interface ModalHeaderProps {
  onClose: () => void;
}

export function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <UIModalHeader>
      <ModalTitle>Edit Card</ModalTitle>
      <button
        onClick={onClose}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
      >
        <X className="h-5 w-5" />
      </button>
    </UIModalHeader>
  );
}
