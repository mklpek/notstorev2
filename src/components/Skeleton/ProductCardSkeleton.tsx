import React, { useMemo } from 'react';
import styles from './ProductCardSkeleton.module.css';
import { ImageSkeleton, TextSkeleton } from './SkeletonElements';

interface ProductCardSkeletonProps {
  count?: number;
}

/**
 * Ürün kartı skeleton bileşeni
 * Memoize edilmiş ve optimize edilmiş yapı
 */
const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = React.memo(({ count = 1 }) => {
  // Array'i useMemo ile oluştur, sadece count değiştiğinde yeniden hesaplanır
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
  }, [count]); // Sadece count değiştiğinde yeniden hesapla

  return <>{skeletonItems}</>;
});

// React DevTools için komponent adı
ProductCardSkeleton.displayName = 'ProductCardSkeleton';

export default ProductCardSkeleton; 