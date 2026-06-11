import { startOfDay, endOfDay } from 'date-fns';

/**
 * Date utility functions for consistent UTC/local time handling
 * Ensures all dates are stored as UTC strings and displayed as local time
 */

/**
 * Get start of local day (00:00:00.000)
 * @param date - Date object to convert
 * @returns Date object at start of day
 */
export const getStartOfLocalDay = (date: Date): Date => {
  return startOfDay(date);
};

/**
 * Get end of local day (23:59:59.999)
 * @param date - Date object to convert
 * @returns Date object at end of day
 */
export const getEndOfLocalDay = (date: Date): Date => {
  return endOfDay(date);
};

/**
 * Convert a date (Date object or string) to UTC ISO string
 * @param date - Date object or string to convert
 * @returns UTC ISO string or undefined
 */
export function toUTCString(date?: Date | string): string | undefined {
  if (!date) return undefined;

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return undefined;

  return dateObj.toISOString();
}

/**
 * Convert a UTC string to local Date object
 * @param utcString - UTC ISO string to convert
 * @returns Local Date object or undefined
 */
export function fromUTCString(utcString?: string | Date): Date | undefined {
  if (!utcString) return undefined;

  if (utcString instanceof Date) {
    return isNaN(utcString.getTime()) ? undefined : utcString;
  }

  const dateObj = new Date(utcString);
  if (isNaN(dateObj.getTime())) return undefined;

  return dateObj;
}

/**
 * Convert a date (Date object or string) to local Date object
 * Handles both UTC strings and local Date objects
 * @param date - Date object or string to convert
 * @returns Local Date object or undefined
 */
export function toLocalDate(date?: Date | string): Date | undefined {
  if (!date) return undefined;

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return undefined;

  return dateObj;
}

/**
 * Check if a date is a UTC string
 * @param date - Date to check
 * @returns True if date is a UTC string
 */
export function isUTCString(date: unknown): date is string {
  return typeof date === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(date);
}

/**
 * Normalize date for storage (convert to UTC string)
 * @param date - Date to normalize
 * @returns UTC string or undefined
 */
export function normalizeForStorage(date?: Date | string): string | undefined {
  return toUTCString(date);
}

/**
 * Normalize date for display (convert to local Date)
 * @param date - Date to normalize
 * @returns Local Date object or undefined
 */
export function normalizeForDisplay(date?: Date | string): Date | undefined {
  return toLocalDate(date);
}
