import { useState, useRef, useEffect } from 'react';

interface UseDropdownPositionReturn {
  triggerRect: DOMRect | null;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  updatePosition: () => void;
}

export const useDropdownPosition = (isOpen: boolean): UseDropdownPositionReturn => {
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
  };

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
  }, [isOpen]);

  return { triggerRect, triggerRef, updatePosition };
};
