/******************************************************************************
 * File: TabBarSkeleton.tsx
 * Layer: core
 * Desc: Tab bar skeleton component for loading states with optimized rendering
 ******************************************************************************/

import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './AppSkeleton.module.css';

/**
 * TabBar skeleton component
 * Memoized pure component that prevents unnecessary renders
 * @returns JSX element containing tab bar skeleton
 */
const TabBarSkeleton = React.memo(() => {
  return (
    <div className={styles.tabBar} aria-hidden="true">
      <div className={styles.body}>
        {/* Store Tab Skeleton */}
        <div className={styles.tab}>
          <div className={styles.iconContainer}>
            <Skeleton circle width={24} height={24} aria-hidden="true" />
          </div>
          <Skeleton width={30} height={12} aria-hidden="true" />
        </div>

        {/* Profile Tab Skeleton */}
        <div className={styles.tab}>
          <div className={styles.iconContainer}>
            <div className={styles.profileContainer}>
              <Skeleton circle width={24} height={24} aria-hidden="true" />
            </div>
          </div>
          <Skeleton width={25} height={12} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
});

// Component name for React DevTools
TabBarSkeleton.displayName = 'TabBarSkeleton';

export default TabBarSkeleton;
