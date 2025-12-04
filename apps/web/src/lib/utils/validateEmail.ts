/**
 * Validate if the given email address is in a valid format.
 * @param email The email address to validate.
 * @returns {boolean} Returns true if the email is valid, otherwise false.
 */
export function validateEmail(email: string | null): boolean {
  // Basic regex for validating an email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email) {
    return false; // Handle null, undefined, or empty strings
  }

  return emailRegex.test(email); // Validate using regex
}