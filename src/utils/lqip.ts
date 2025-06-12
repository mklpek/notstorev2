/******************************************************************************
 * File: lqip.ts
 * Layer: utils
 * Desc: Low Quality Image Placeholder utility for optimized image loading
 ******************************************************************************/

/**
 * Generates a Low Quality Image Placeholder (LQIP) URL
 * Adds optimization parameters for faster loading and better UX
 * @param src - Original image source URL
 * @param w - Width for the low quality version (default: 16px)
 * @returns Optimized image URL or original if invalid
 */
export const lqip = (src: string, w = 16) => {
  // Return empty string if src is empty or invalid
  if (!src) return '';

  // URL security check
  try {
    // Is it a valid URL?
    new URL(src);

    // Add URL parameters for optimization
    return `${src}${src.includes('?') ? '&' : '?'}width=${w}&optimize=low&format=webp`;
  } catch (error) {
    // Return original src if URL is invalid
    console.warn('Invalid URL:', src);
    return src;
  }
};
