/******************************************************************************
 * File: HeaderSkeleton.tsx
 * Layer: core
 * Desc: Header skeleton component for loading states with memoized rendering
 ******************************************************************************/

import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './AppSkeleton.module.css';

/**
 * Header skeleton component
 * Memoized pure component that only renders when props change
 * @returns JSX element containing header skeleton
 */
const HeaderSkeleton = React.memo(() => {
  return (
    <header className={styles.header} aria-hidden="true">
      <div className={styles.headerLeft}>
        <h1 className={styles.headerTitle}>Not Store</h1>
      </div>
    </header>
  );
});

// Component name for React DevTools
HeaderSkeleton.displayName = 'HeaderSkeleton';

export default HeaderSkeleton;
