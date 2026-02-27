'use client';

import { Button } from '@/components/ui';

/**
 * Mobile backdrop component for sidebar
 * Closes sidebar when clicked, shown only on mobile devices
 */
export function SidebarBackdrop({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 lg:hidden"
      onClick={onClose}
    />
  );
}
