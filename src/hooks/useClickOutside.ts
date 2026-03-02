'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to detect clicks outside a specific element
 * 
 * @param callback - Function to call when click outside is detected
 * @param additionalRefs - Optional additional refs to include in the click detection
 * @returns Ref to attach to the element to monitor
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void,
  additionalRefs?: React.RefObject<Node>[]
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Node;

    // Check if click is outside the main ref
    const isOutsideMainRef = ref.current && !ref.current.contains(target);

    // Check if click is outside any additional refs
    const isOutsideAdditionalRefs = additionalRefs?.every(additionalRef =>
      !additionalRef.current || !additionalRef.current.contains(target)
    ) ?? true;

    if (isOutsideMainRef && isOutsideAdditionalRefs) {
      callback();
    }
  }, [callback, additionalRefs]);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      callback();
    }
  }, [callback]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleClickOutside, handleEscapeKey]);

  return ref;
}
