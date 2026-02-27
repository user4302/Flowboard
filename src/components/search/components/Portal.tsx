import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ReactNode } from 'react';

interface PortalProps {
  children: ReactNode;
}

export function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}
