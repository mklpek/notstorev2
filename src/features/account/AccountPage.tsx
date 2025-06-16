/******************************************************************************
 * File: AccountPage.tsx
 * Layer: feature
 * Desc: User account page with purchase history and profile information
 ******************************************************************************/

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import styles from './AccountPage.module.css';
import {
  useGetHistoryQuery,
  useGetEmptyHistoryQuery,
  selectVisibleHistoryItems,
  selectRemainingHistoryCount,
} from './api';
import { useGetCatalogueQuery, catalogSelectors } from '../catalogue/api';
import type { Purchase } from './api';
import { AccountPageSkeleton } from '../../core/ui/Skeleton';
import { ApiErrorMessage } from '../../core/ui';
import { useSelector } from 'react-redux';
import type { RootState } from '../../core/store';
import { useSafeAreaContext } from '../../core/hooks/useSafeArea';

/**
 * Account page component
 * Displays user profile information and purchase history with infinite scroll
 * @returns JSX element containing account page with user info and history
 */
const AccountPage: React.FC = () => {
  // Get Telegram user information from Redux
  const userState = useSelector((state: RootState) => state.user);
  const user = userState.user;

  // Get safe area values for debugging
  const safeAreaInsets = useSafeAreaContext();

  // State to track number of visible items
  const [visibleCount, setVisibleCount] = useState(20);

  // State to determine which API to use
  const [useEmptyHistoryAPI, setUseEmptyHistoryAPI] = useState(false);

  // Ref for sentinel element
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Use RTK Query for history data - conditionally based on useEmptyHistoryAPI
  const standardHistoryResult = useGetHistoryQuery(undefined, {
    skip: useEmptyHistoryAPI,
  });

  const emptyHistoryResult = useGetEmptyHistoryQuery(undefined, {
    skip: !useEmptyHistoryAPI,
  });

  // Currently active history query
  const historyResult = useEmptyHistoryAPI ? emptyHistoryResult : standardHistoryResult;
  const { isLoading: historyLoading, error: historyError, refetch } = historyResult;

  // If normal API fails, switch to empty history API
  useEffect(() => {
    if (standardHistoryResult.error && !useEmptyHistoryAPI) {
      console.log('History API error, switching to empty history API', standardHistoryResult.error);
      setUseEmptyHistoryAPI(true);
    }
  }, [standardHistoryResult.error, useEmptyHistoryAPI]);

  // Optimization with EntityAdapter selectors
  const visibleHistory = selectVisibleHistoryItems(historyResult, visibleCount);
  const remainingItems = selectRemainingHistoryCount(historyResult, visibleCount);

  // Access product information with useGetCatalogueQuery - no longer using reduce
  const { data: catalogData } = useGetCatalogueQuery();

  // Get product information using EntityAdapter
  const getProductInfo = useCallback(
    (productId: number) => {
      // Return empty values if no data
      if (!catalogData) {
        return { name: '', category: '', image: '' };
      }

      // Get product directly from EntityAdapter using catalogSelectors.selectById - O(1) operation
      const product = catalogSelectors.selectById(catalogData, productId);

      return {
        name: product?.name || '',
        category: product?.category || '',
        image: product?.images?.[0] || '',
      };
    },
    [catalogData]
  );

  // Create a single Intl.DateTimeFormat object for date formatting
  // Create once on first render with useMemo, don't recreate
  const dateFormatter = useMemo(() => {
    // Separate formats for day and month
    const dayFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric' });
    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });

    // More performant and consistent date formatting function
    return {
      format: (timestamp: number) => {
        const date = new Date(timestamp);
        const day = dayFormatter.format(date);
        const month = monthFormatter.format(date);
        const year = date.getFullYear().toString().slice(2);
        return `${day} ${month} '${year}`;
      },
    };
  }, []);

  // Create callback for IntersectionObserver
  const intersectionCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    if (entry?.isIntersecting) {
      // Load new data
      setVisibleCount(prev => prev + 20);
    }
  }, []);

  // Automatic loading with IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current || remainingItems <= 0) return;

    const observer = new IntersectionObserver(intersectionCallback, {
      rootMargin: '200px', // Start loading 200px early
      threshold: 0.1, // Trigger when 10% visible
    });

    const currentRef = sentinelRef.current;
    observer.observe(currentRef);

    // Cleanup - sentinelRef.current might be null in this case
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [sentinelRef, remainingItems, intersectionCallback]);

  // Show skeleton during loading
  if (historyLoading) {
    return <AccountPageSkeleton showHistory={true} historyItemCount={6} />;
  }

  // If both APIs have errors, show error component
  if (historyError && useEmptyHistoryAPI && emptyHistoryResult.error) {
    return (
      <ApiErrorMessage
        error={historyError}
        onRetry={() => {
          // Start by trying normal API again
          setUseEmptyHistoryAPI(false);
          refetch();
        }}
      />
    );
  }

  // Create user's full name
  const fullName = user
    ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`
    : 'User';

  return (
    <div className={styles.accountPage}>
      {/* Safe Area Debug Info - 🔧 Enhanced Debug Panel */}
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.9)',
          color: 'white',
          padding: '12px',
          fontSize: '11px',
          borderRadius: '6px',
          zIndex: 9999,
          fontFamily: 'monospace',
          maxWidth: '200px',
          lineHeight: '1.3',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>🔧 Safe Area Debug:</div>
        <div>Hook Values:</div>
        <div>• Top: {safeAreaInsets.top}px</div>
        <div>• Bottom: {safeAreaInsets.bottom}px</div>
        <div>• Left: {safeAreaInsets.left}px</div>
        <div>• Right: {safeAreaInsets.right}px</div>
        <div style={{ marginTop: '6px' }}>CSS Variables:</div>
        <div>• --tg-viewport-safe-area-inset-top</div>
        <div>• --tg-viewport-safe-area-inset-bottom</div>
        <div style={{ marginTop: '6px', fontSize: '10px', opacity: '0.7' }}>
          Telegram v{window.Telegram?.WebApp ? 'Available' : 'N/A'}
        </div>
      </div>

      {/* Account Header */}
      <div className={styles.accountHeader}>
        <div className={styles.avatar}>
          <img
            src={
              user?.photoUrl && user.photoUrl !== 'none'
                ? user.photoUrl
                : '/images/profile-avatar.png'
            }
            alt={fullName}
            className={styles.avatarImage}
          />
        </div>
        <div className={styles.info}>
          <h1 className={styles.name}>{fullName}</h1>
        </div>
      </div>

      {/* Two different states: History exists/doesn't exist */}
      {visibleHistory && visibleHistory.length > 0 ? (
        // If history exists - New Figma design
        <div className={styles.historyContainer}>
          {/* History Header */}
          <div className={styles.historyHeader}>
            <div className={styles.historyTitle}>History</div>
          </div>

          {/* History Items */}
          <div className={styles.historyItems}>
            {visibleHistory.map((purchase: Purchase, index: number) => {
              const productInfo = getProductInfo(purchase.id);
              // Create unique key - combination of timestamp + product id + index
              const uniqueKey = `${purchase.timestamp}-${purchase.id}-${index}`;

              return (
                <div key={uniqueKey} className={styles.historyLine}>
                  <img
                    className={styles.historyAva}
                    src={productInfo.image}
                    alt={productInfo.name}
                    loading="lazy"
                  />
                  <div className={styles.historyInfo}>
                    <div className={styles.productInfo}>
                      <span className={styles.productCategory}>{productInfo.category}</span>
                      <div className={styles.productNameContainer}>
                        <span className={styles.productName}>{productInfo.name}</span>
                      </div>
                    </div>
                    <div className={styles.purchaseInfo}>
                      <span className={styles.purchaseDate}>
                        {dateFormatter.format(purchase.timestamp)}
                      </span>
                      <div className={styles.priceContainer}>
                        <span className={styles.price}>
                          {purchase.total} {purchase.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* "Loading" sentinel if there's more data to load */}
            {remainingItems > 0 && (
              <div ref={sentinelRef} className={styles.loadingMore}>
                Loading more items...
              </div>
            )}
          </div>
        </div>
      ) : (
        // If no history - Collections
        <div className={styles.collections}>
          <div className={styles.emojiPlaceholder}>
            <div className={styles.placeholderBody}>
              <img
                src="/images/hatching_chick.svg"
                alt="No history"
                className={styles.placeholderImage}
              />
              <div className={styles.textFrame}>
                <h2 className={styles.title}>No history yet</h2>
                <p className={styles.description}>
                  Your purchase history will appear here once you make your first order.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
