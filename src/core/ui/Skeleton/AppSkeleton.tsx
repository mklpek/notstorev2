/******************************************************************************
 * File: AppSkeleton.tsx
 * Layer: core
 * Desc: Main application skeleton component for loading states
 ******************************************************************************/

import React from 'react';
import styles from './AppSkeleton.module.css';
import ProductCardSkeleton from './ProductCardSkeleton';
import HeaderSkeleton from './HeaderSkeleton';
import TabBarSkeleton from './TabBarSkeleton';

/**
 * Application skeleton component
 * Memoized pure component - prevents unnecessary re-renders
 * @returns JSX element containing full app skeleton layout
 */
const AppSkeleton = React.memo(() => {
  return (
    <div className={styles.wrapper} aria-busy="true" aria-label="Page loading">
      {/* Header Skeleton */}
      <HeaderSkeleton />

      {/* Product Grid Skeleton */}
      <section className={styles.grid} aria-busy="true" aria-label="Products loading">
        <ProductCardSkeleton count={6} />
      </section>

      {/* TabBar Skeleton */}
      <TabBarSkeleton />
    </div>
  );
});

// Component name for React DevTools
AppSkeleton.displayName = 'AppSkeleton';

export default AppSkeleton;
