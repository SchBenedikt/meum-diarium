/**
 * Utility functions for slug generation and sanitization
 */

/**
 * Sanitizes a string to create a URL-friendly slug
 * @param text - Text to slugify
 * @returns URL-safe slug
 */
export function sanitizeSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove all non-alphanumeric characters except hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Replace multiple consecutive hyphens with a single hyphen
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a slug from a title or text
 * @param text - Text to generate slug from
 * @param maxLength - Maximum length of the slug (default: 60)
 * @returns Generated slug
 */
export function generateSlug(text: string, maxLength: number = 60): string {
  const slug = sanitizeSlug(text);
  
  if (slug.length <= maxLength) {
    return slug;
  }
  
  // Truncate at the last hyphen before maxLength
  const truncated = slug.substring(0, maxLength);
  const lastHyphen = truncated.lastIndexOf('-');
  
  return lastHyphen > 0 ? truncated.substring(0, lastHyphen) : truncated;
}

/**
 * Validates if a string is a valid slug
 * @param slug - Slug to validate
 * @returns True if valid slug
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  
  // Only lowercase letters, numbers, and hyphens
  // Cannot start or end with hyphen
  // No consecutive hyphens
  const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  
  return slugPattern.test(slug);
}
