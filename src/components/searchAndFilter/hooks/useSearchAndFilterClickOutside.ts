import { useEffect, useRef } from 'react';

/**
 * Hook to detect clicks outside multiple elements and handle escape key
 * 
 * @param refs - Array of refs to monitor for outside clicks
 * @param callback - Function to call when click outside is detected or escape key is pressed
 */
export const useSearchAndFilterClickOutside = (
  refs: React.RefObject<HTMLDivElement | null>[],
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = refs.every(ref =>
        !ref.current || !ref.current.contains(event.target as Node)
      );

      if (isOutside) {
        callback();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [refs, callback]);
};
