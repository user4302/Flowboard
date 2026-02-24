import { useState, useEffect } from 'react';

/**
 * useLocalStorage hook - Custom hook for persisting state in localStorage
 * Provides useState-like API with automatic localStorage synchronization
 * Handles SSR safety and error handling for localStorage operations
 * 
 * @param key - localStorage key to store the value under
 * @param initialValue - Initial value to use if no value exists in localStorage
 * @returns Tuple of [value, setValue] similar to useState
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  /**
   * Initialize state with value from localStorage or initialValue
   * Handles SSR safety by checking for window object
   */
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Wrapped version of useState's setter function that persists the new value to localStorage
   * Supports both direct values and function updates like useState
   * @param value - New value or function to update the current value
   */
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
