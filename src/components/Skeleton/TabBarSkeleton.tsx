import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './AppSkeleton.module.css';

/**
 * TabBar için skeleton bileşeni
 * Memoize edilmiş saf bileşen, gereksiz render'ları önler
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

// React DevTools için komponent adı
TabBarSkeleton.displayName = 'TabBarSkeleton';

export default TabBarSkeleton; 