// src/utils/formatSlug.ts

/**
 * Convert a title to a URL-friendly slug.
 * - Converts to lowercase.
 * - Replaces spaces with hyphens.
 * - Removes special characters.
 * @param title The title string to convert.
 * @returns {string} The formatted slug.
 */
export function formatSlug(title: string): string {
  return title
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove any non-alphanumeric characters (except hyphens)
}
