import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './AppSkeleton.module.css';

/**
 * Header için skeleton bileşeni
 * Memoize edilmiş saf bileşen, sadece prop değiştiğinde render edilir
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

// React DevTools için komponent adı
HeaderSkeleton.displayName = 'HeaderSkeleton';

export default HeaderSkeleton;
