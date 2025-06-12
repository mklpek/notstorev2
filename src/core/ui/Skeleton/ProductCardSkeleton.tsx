/******************************************************************************
 * File: ProductCardSkeleton.tsx
 * Layer: core
 * Desc: Product card skeleton component with optimized array rendering
 ******************************************************************************/

import React, { useMemo } from 'react';
import styles from './ProductCardSkeleton.module.css';
import { ImageSkeleton, TextSkeleton } from './SkeletonElements';

interface ProductCardSkeletonProps {
  count?: number;
}

/**
 * Product card skeleton component
 * Memoized and optimized structure for loading states
 * @param count - Number of skeleton cards to render (default: 1)
 * @returns Array of product card skeletons
 */
const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = React.memo(({ count = 1 }) => {
  // Create array with useMemo, only recalculated when count changes
  const skeletonItems = useMemo(() => {
    return Array.from({ length: count }).map((_, index) => (
      <div key={index} className={styles.skeletonCard} aria-hidden="true">
        {/* Image container */}
        <div className={styles.skeletonImageContainer}>
          <ImageSkeleton className={styles.skeletonImage || ''} />
        </div>
        {/* Product info */}
        <div className={styles.skeletonProductInfo}>
          <TextSkeleton height={20} />
          <TextSkeleton width="60%" height={16} />
        </div>
      </div>
    ));
  }, [count]); // Only recalculate when count changes

  return <>{skeletonItems}</>;
});

// Component name for React DevTools
ProductCardSkeleton.displayName = 'ProductCardSkeleton';

export default ProductCardSkeleton;
