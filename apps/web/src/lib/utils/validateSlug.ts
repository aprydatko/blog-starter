/**
 * Validate if the given string is a valid slug.
 * A valid slug contains lowercase letters, numbers, and hyphens.
 * @param slug The slug string to validate.
 * @returns {boolean} Returns true if the slug is valid, otherwise false.
 */
export function validateSlug(slug: string | null): boolean {
  // Regular expression to match slugs (lowercase alphanumeric and hyphens)
  const slugRegex = /^[a-z0-9-]+$/;

  if (!slug) {
    return false; // Handle null, undefined, or empty strings
  }

  return slugRegex.test(slug); // Validate using regex
}