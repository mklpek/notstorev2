import React from 'react';
import styles from './AppSkeleton.module.css';
import ProductCardSkeleton from './ProductCardSkeleton';
import HeaderSkeleton from './HeaderSkeleton';
import TabBarSkeleton from './TabBarSkeleton';

/**
 * Uygulama skeleton bileşeni
 * Memoize edilmiş saf bileşen - gereksiz render'ları önler
 */
const AppSkeleton = React.memo(() => {
  return (
    <div className={styles.wrapper} aria-busy="true" aria-label="Sayfa yükleniyor">
      {/* Header Skeleton */}
      <HeaderSkeleton />
      
      {/* Product Grid Skeleton */}
      <section className={styles.grid} aria-busy="true" aria-label="Ürünler yükleniyor">
        <ProductCardSkeleton count={6} />
      </section>
      
      {/* TabBar Skeleton */}
      <TabBarSkeleton />
    </div>
  );
});

// React DevTools için komponent adı
AppSkeleton.displayName = 'AppSkeleton';

export default AppSkeleton; 