import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ReactNode } from 'react';

interface SearchAndFilterPortalProps {
  children: ReactNode;
}

export function SearchAndFilterPortal({ children }: SearchAndFilterPortalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Use setTimeout to avoid calling setState synchronously
    const timeoutId = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeoutId);
  }, []);
  return mounted ? createPortal(children, document.body) : null;
}
