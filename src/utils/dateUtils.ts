import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Configure dayjs plugins
dayjs.extend(relativeTime);

/**
 * Safely parse a date from various formats
 * @param date - Date in various formats (Date, string, Firestore Timestamp, etc.)
 * @returns dayjs object or null if invalid
 */
export const safeParseDate = (date: any): Dayjs | null => {
  if (!date) return null;

  try {
    // Handle Firestore Timestamp
    if (date.toDate && typeof date.toDate === 'function') {
      const parsedDate = dayjs(date.toDate());
      return parsedDate.isValid() ? parsedDate : null;
    }

    // Handle Date object or string
    const parsedDate = dayjs(date);
    return parsedDate.isValid() ? parsedDate : null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

/**
 * Format a date safely with fallback
 * @param date - Date in various formats
 * @param format - dayjs format string (default: 'MMM DD, YYYY')
 * @param fallback - Fallback string if date is invalid (default: 'No date')
 * @returns Formatted date string or fallback
 */
export const formatDate = (
  date: any,
  format: string = 'MMM DD, YYYY',
  fallback: string = 'No date'
): string => {
  const parsedDate = safeParseDate(date);
  if (!parsedDate) return fallback;
  
  try {
    return parsedDate.format(format);
  } catch (error) {
    console.error('Error formatting date:', error);
    return fallback;
  }
};

/**
 * Get relative time (e.g., "2 hours ago") safely
 * @param date - Date in various formats
 * @param fallback - Fallback string if date is invalid (default: 'Unknown')
 * @returns Relative time string or fallback
 */
export const getRelativeTime = (
  date: any,
  fallback: string = 'Unknown'
): string => {
  const parsedDate = safeParseDate(date);
  if (!parsedDate) return fallback;
  
  try {
    return parsedDate.fromNow();
  } catch (error) {
    console.error('Error getting relative time:', error);
    return fallback;
  }
};

/**
 * Check if a date is in the past
 * @param date - Date in various formats
 * @returns true if date is in the past, false otherwise
 */
export const isPast = (date: any): boolean => {
  const parsedDate = safeParseDate(date);
  if (!parsedDate) return false;
  
  try {
    return parsedDate.isBefore(dayjs());
  } catch (error) {
    console.error('Error checking if date is past:', error);
    return false;
  }
};

/**
 * Check if a date is within the next X hours
 * @param date - Date in various formats
 * @param hours - Number of hours to check (default: 24)
 * @returns true if date is within the specified hours, false otherwise
 */
export const isDueSoon = (date: any, hours: number = 24): boolean => {
  const parsedDate = safeParseDate(date);
  if (!parsedDate) return false;
  
  try {
    const now = dayjs();
    const hoursDiff = parsedDate.diff(now, 'hours');
    return hoursDiff > 0 && hoursDiff <= hours;
  } catch (error) {
    console.error('Error checking if date is due soon:', error);
    return false;
  }
};

/**
 * Check if a date is overdue (past and not completed)
 * @param date - Date in various formats
 * @param isCompleted - Whether the item is completed
 * @returns true if date is overdue, false otherwise
 */
export const isOverdue = (date: any, isCompleted: boolean = false): boolean => {
  if (isCompleted) return false;
  return isPast(date);
};

/**
 * Get a safe Date object from various formats
 * @param date - Date in various formats
 * @returns Date object or null if invalid
 */
export const getSafeDate = (date: any): Date | null => {
  const parsedDate = safeParseDate(date);
  if (!parsedDate) return null;
  
  try {
    return parsedDate.toDate();
  } catch (error) {
    console.error('Error converting to Date object:', error);
    return null;
  }
};

/**
 * Validate if a date is valid
 * @param date - Date in various formats
 * @returns true if date is valid, false otherwise
 */
export const isValidDate = (date: any): boolean => {
  return safeParseDate(date) !== null;
};

