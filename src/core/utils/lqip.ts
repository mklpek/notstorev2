/******************************************************************************
 * File: lqip.ts
 * Layer: utils
 * Desc: Low Quality Image Placeholder utility for optimized image loading
 ******************************************************************************/

/**
 * Generates low quality image placeholder URL for progressive loading
 * @param src - Original image source URL
 * @param w - Width parameter for optimization (default: 16)
 * @returns Optimized image URL or original if invalid
 */
export const lqip = (src: string, w = 16) => {
  // Return empty string if src is empty or invalid
  if (!src) return '';

  // URL security check
  try {
    // Is it a valid URL?
    new URL(src);

    // Add URL parameter
    return `${src}${src.includes('?') ? '&' : '?'}width=${w}&optimize=low&format=webp`;
  } catch (error) {
    // Return original src if invalid URL
    console.warn('Invalid URL:', src);
    return src;
  }
};
