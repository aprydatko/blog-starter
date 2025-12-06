// src/your-post-validator.ts

import { validateSlug } from '@/lib/utils/index' // Reusing the validateSlug function

/**
 * Validates the post data, ensuring that title, content, and slug are valid.
 * @param post The post data to validate.
 * @returns {boolean} Returns true if the post data is valid, otherwise false.
 */
export function validatePostData(post: { title: string; content?: string; slug?: string }): boolean {
  // Check if title and content are non-empty strings
  if (!post.title || typeof post.title !== 'string' || post.title.trim() === '') {
    return false
  }

  if (!post.content || typeof post.content !== 'string' || post.content.trim() === '') {
    return false
  }

  // Validate slug using the existing validateSlug function
  if (!validateSlug(post.slug!)) {
    return false
  }

  // All fields are valid
  return true
}
