// src/utils/truncateText.ts

/**
 * Truncate the input text to the specified length and append "..." if it exceeds that length.
 * @param text The text to truncate.
 * @param maxLength The maximum length of the truncated text.
 * @returns {string} The truncated text with "..." appended if necessary.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';  // Truncate and add ellipsis
  }
  return text;  // Return the original text if it's within the limit
}
