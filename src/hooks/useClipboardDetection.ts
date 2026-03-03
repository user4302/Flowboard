import { useState, useEffect, useCallback } from 'react';
import { validateCardJSON, CardJSON } from '@/lib/cardJsonUtils';

/**
 * Hook for detecting valid card JSON in clipboard
 * Provides cross-platform clipboard monitoring
 */
export function useClipboardDetection() {
  const [hasValidCardJSON, setHasValidCardJSON] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  /**
   * Checks if clipboard contains valid card JSON
   */
  const checkClipboard = useCallback(async () => {
    if (!navigator.clipboard) {
      // Fallback for browsers that don't support clipboard API
      setHasValidCardJSON(false);
      return;
    }

    setIsChecking(true);
    try {
      const text = await navigator.clipboard.readText();
      
      if (!text.trim()) {
        setHasValidCardJSON(false);
        return;
      }

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        setHasValidCardJSON(false);
        return;
      }

      // Validate as card JSON
      const isValid = validateCardJSON(data);
      setHasValidCardJSON(isValid);
    } catch (error) {
      console.error('Error checking clipboard:', error);
      setHasValidCardJSON(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  /**
   * Gets card JSON from clipboard if valid
   */
  const getCardJSONFromClipboard = useCallback(async (): Promise<CardJSON | null> => {
    if (!navigator.clipboard) return null;

    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) return null;

      const data = JSON.parse(text);
      if (validateCardJSON(data)) {
        return data;
      }
    } catch (error) {
      console.error('Error getting card JSON from clipboard:', error);
    }

    return null;
  }, []);

  /**
   * Monitor clipboard changes when window gains focus
   */
  useEffect(() => {
    const handleFocus = () => {
      checkClipboard();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkClipboard();
      }
    };

    // Initial check
    checkClipboard();

    // Set up listeners
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up periodic check as fallback
    const interval = setInterval(checkClipboard, 5000); // Check every 5 seconds

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [checkClipboard]);

  return {
    hasValidCardJSON,
    isChecking,
    checkClipboard,
    getCardJSONFromClipboard
  };
}
