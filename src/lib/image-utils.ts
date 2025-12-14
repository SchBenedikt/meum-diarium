/**
 * Utility functions for image handling
 */

/**
 * Generates a fallback SVG data URL for broken images
 * @param width - Width of the fallback image
 * @param height - Height of the fallback image
 * @param text - Text to display in the fallback image
 * @returns Data URL for SVG fallback image
 */
export function getFallbackImageUrl(
  width: number = 400,
  height: number = 200,
  text: string = 'Bild nicht verfügbar'
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect fill="#ddd" width="${width}" height="${height}"/>
    <text fill="#999" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${text}</text>
  </svg>`;
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Validates if a URL is a valid image URL
 * @param url - URL to validate
 * @returns True if URL appears to be a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets image dimensions from URL (requires image to be loaded)
 * @param url - Image URL
 * @returns Promise with width and height
 */
export async function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = url;
  });
}
