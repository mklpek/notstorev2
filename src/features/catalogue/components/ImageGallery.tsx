/******************************************************************************
 * File: ImageGallery.tsx
 * Layer: feature
 * Desc: Image gallery component with pagination dots and progressive loading
 ******************************************************************************/

import React, { useMemo } from 'react';
import styles from './ImageGallery.module.css';
import ProgressiveImage from '../../../core/ui/ProgressiveImage';

interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

/**
 * Image gallery component with pagination dots
 * Displays images with navigation dots based on Figma design
 * @param images - Array of image URLs to display
 * @param currentIndex - Currently active image index
 * @param onIndexChange - Callback when image index changes
 * @returns JSX element containing image gallery with pagination
 */
const ImageGallery: React.FC<ImageGalleryProps> = ({ images, currentIndex, onIndexChange }) => {
  // Calculate dot sizes according to Figma design - optimize calculation with useMemo
  const getDotSizeClass = useMemo(() => {
    return (index: number, totalDots: number, activeIndex: number) => {
      // In Figma design, active dot is always at 5th position (index 4)
      // 4 dots on the right, 4 dots on the left
      const activePosition = 4; // 5th position (0-indexed)

      if (index === activePosition) {
        return styles.dotActive;
      }

      // Calculate sizes based on distance from active position
      const distance = Math.abs(index - activePosition);

      // Sizes according to Figma design:
      // Distance 4 (outermost): 2px
      // Distance 3 (second): 3px
      // Distance 2,1 (close to center): 4px
      if (distance === 4) {
        return styles.dotSize2px;
      } else if (distance === 3) {
        return styles.dotSize3px;
      } else {
        return styles.dotSize4px;
      }
    };
  }, []);

  return (
    <div className={styles.imageGallery}>
      <div className={styles.imageContainer}>
        {/* 
          RENDER ALL IMAGES, SHOW ONLY THE ACTIVE ONE.
          This method is more reliable than changing `src` and prevents
          the browser from re-downloading images.
        */}
        {images.map((image, index) => (
          <div
            key={image}
            style={{
              display: index === currentIndex ? 'block' : 'none',
              width: '100%',
              height: '100%',
            }}
          >
            <ProgressiveImage
              src={image}
              alt={`Product image ${index + 1}`}
              className={styles.image || ''}
              loading={index === currentIndex ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        {images.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${getDotSizeClass(index, images.length, currentIndex)}`}
            onClick={() => onIndexChange(index)}
            aria-label={`Image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Wrap component with memo to prevent unnecessary renders
export default React.memo(ImageGallery);
