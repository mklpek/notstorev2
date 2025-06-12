/******************************************************************************
 * File: ItemPageSkeleton.tsx
 * Layer: core
 * Desc: Item page skeleton component for product detail loading states
 ******************************************************************************/

import React from 'react';
import styles from './ItemPageSkeleton.module.css';
import { TextSkeleton } from './SkeletonElements';

/**
 * ItemPage (Product Detail) skeleton component
 * Optimized with memo for performance
 * @returns JSX element containing item page skeleton
 */
const ItemPageSkeleton = React.memo(() => {
  // Create array for slider thumbnail images
  const sliderImagesCount = 5;

  return (
    <div className={styles.itemPage} aria-busy="true" aria-label="Loading product details">
      <div className={styles.body}>
        {/* Stickers Info */}
        <div className={styles.stickersInfo}>
          {/* Stickers Collections */}
          <div className={styles.stickersCollections}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.left}>
                <div className={styles.title}>
                  {/* Title skeleton - same size as real titleText */}
                  <TextSkeleton height={26} width="70%" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={styles.description}>
              {/* Description skeleton - same as real descriptionText */}
              <TextSkeleton height={17} width="100%" />
              <TextSkeleton height={17} width="85%" />
              <TextSkeleton height={17} width="60%" />
            </div>
          </div>

          {/* Tags */}
          <div className={styles.tags}>
            <div className={styles.tag}>
              <TextSkeleton width={40} height={12} />
            </div>
            <div className={styles.tag}>
              <TextSkeleton width={30} height={12} />
            </div>
            <div className={styles.tag}>
              <TextSkeleton width={45} height={12} />
            </div>
          </div>
        </div>

        {/* Big Sticker Container */}
        <div className={styles.bigStickerContainer}>
          <div className={styles.bigSticker}>{/* Skeleton background for large image */}</div>
        </div>
      </div>

      {/* Fixed Bottom Content */}
      <div className={styles.fixedBottom}>
        {/* Stickers Slider */}
        <div className={styles.sliderContainer}>
          <div className={`${styles.stickersSlider} hide-scrollbar`}>
            {Array.from({ length: sliderImagesCount }).map((_, index) => (
              <div key={index} className={styles.sticker}>
                {/* Background for small image skeletons */}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.body}>
            {/* Add to Cart Button Skeleton */}
            <div className={styles.addToCartButton}></div>
            {/* Buy Now Button Skeleton */}
            <div className={styles.buyNowButton}></div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Component name for React DevTools
ItemPageSkeleton.displayName = 'ItemPageSkeleton';

export default ItemPageSkeleton;
