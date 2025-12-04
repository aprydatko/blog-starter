// src/utils/formatDate.ts

/**
 * Format a Date object into the format "Month Day, Year" (e.g., "January 1, 2024").
 * @param date The Date object to format.
 * @returns {string} The formatted date string.
 */
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat('en-US', options).format(date)
}
