import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ReactNode } from 'react';

interface SearchAndFilterPortalProps {
  children: ReactNode;
}

export function SearchAndFilterPortal({ children }: SearchAndFilterPortalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}
