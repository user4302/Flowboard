import { useState, useEffect, useCallback } from 'react';
import { validateCardJSON, CardJSON } from '@/lib/cardJsonUtils';

/**
 * Hook for detecting valid card JSON in clipboard
 * Provides cross-platform clipboard monitoring
 */
export function useClipboardDetection() {
  const [hasValidCardJSON, setHasValidCardJSON] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isPasting, setIsPasting] = useState(false);

  /**
   * Checks if clipboard contains valid card JSON
   */
  const checkClipboard = useCallback(async () => {
    if (!navigator.clipboard) {
      // Fallback for browsers that don't support clipboard API
      setHasValidCardJSON(false);
      return;
    }

    // More lenient focus check - allow clipboard access even if document doesn't have focus
    // This helps when context menu or other elements have focus
    if (document.hidden) {
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
      // Handle clipboard access errors gracefully
      if (error instanceof Error && error.name === 'NotAllowedError') {
        // Silently handle permission errors - document not focused
        setHasValidCardJSON(false);
      } else {
        console.error('Error checking clipboard:', error);
        setHasValidCardJSON(false);
      }
    } finally {
      setIsChecking(false);
    }
  }, []);

  /**
   * Gets card JSON from clipboard if valid
   */
  const getCardJSONFromClipboard = useCallback(async (): Promise<CardJSON | null> => {
    if (!navigator.clipboard) {
      return null;
    }

    // More lenient focus check - allow clipboard access even if document doesn't have focus
    if (document.hidden) {
      return null;
    }

    setIsPasting(true);
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        return null;
      }

      const data = JSON.parse(text);
      if (validateCardJSON(data)) {
        return data;
      }
    } catch (error) {
      // Handle clipboard access errors gracefully
      if (error instanceof Error && error.name === 'NotAllowedError') {
        // Silently handle permission errors - document not focused
        return null;
      } else {
        console.error('Error getting card JSON from clipboard:', error);
      }
    } finally {
      setIsPasting(false);
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

    // Set up periodic check as fallback (only when focused)
    const interval = setInterval(() => {
      if (!document.hidden) {
        checkClipboard();
      }
    }, 10000); // Check every 10 seconds (reduced frequency)

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [checkClipboard]);

  return {
    hasValidCardJSON,
    isChecking,
    isPasting,
    checkClipboard,
    getCardJSONFromClipboard
  };
}
