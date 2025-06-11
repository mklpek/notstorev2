import React from 'react';
import styles from './ProductCardSkeleton.module.css';
import { ImageSkeleton, TextSkeleton } from './SkeletonElements';

interface ProductCardSkeletonProps {
  count?: number;
}

/**
 * Ürün kartı skeleton bileşeni - optimizasyonlar kaldırıldı
 */
const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ count = 1 }) => {
  // Array'i basit şekilde oluştur - useMemo optimizasyonu kaldırıldı
  const skeletonItems = Array.from({ length: count }).map((_, index) => (
    <div key={index} className={styles.skeletonCard} aria-hidden="true">
      {/* Image container */}
      <div className={styles.skeletonImageContainer}>
        <ImageSkeleton className="" />
      </div>
      {/* Product info */}
      <div className={styles.skeletonProductInfo}>
        <TextSkeleton height={20} />
        <TextSkeleton width="60%" height={16} />
      </div>
    </div>
  ));

  return <>{skeletonItems}</>;
};

// React.memo kaldırıldı - normal export
export default ProductCardSkeleton;
