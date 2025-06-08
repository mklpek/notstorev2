import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import styles from './AccountPage.module.css';
import {
  useGetHistoryQuery,
  useGetEmptyHistoryQuery,
  selectVisibleHistoryItems,
  selectRemainingHistoryCount,
} from './api';
import { useGetCatalogueQuery, catalogSelectors } from '../products/api';
import type { Purchase } from './api';
import { AccountPageSkeleton } from '../../components/Skeleton';
import { ApiErrorMessage } from '../../components';

const AccountPage: React.FC = () => {
  // Gösterilecek öğe sayısını tutan state
  const [visibleCount, setVisibleCount] = useState(20);

  // Hangi API'nin kullanılacağını belirleyen state
  const [useEmptyHistoryAPI, setUseEmptyHistoryAPI] = useState(false);

  // Sentinel için ref
  const sentinelRef = useRef<HTMLDivElement>(null);

  // History verisi için RTK Query kullan - koşullu olarak useEmptyHistoryAPI'ye göre
  const standardHistoryResult = useGetHistoryQuery(undefined, {
    skip: useEmptyHistoryAPI,
  });

  const emptyHistoryResult = useGetEmptyHistoryQuery(undefined, {
    skip: !useEmptyHistoryAPI,
  });

  // Aktif olarak kullanılan history sorgusu
  const historyResult = useEmptyHistoryAPI ? emptyHistoryResult : standardHistoryResult;
  const { isLoading: historyLoading, error: historyError, refetch } = historyResult;

  // Eğer normal API hata verirse, boş history API'sine geç
  useEffect(() => {
    if (standardHistoryResult.error && !useEmptyHistoryAPI) {
      console.log(
        "History API hatası, boş history API'sine geçiliyor",
        standardHistoryResult.error
      );
      setUseEmptyHistoryAPI(true);
    }
  }, [standardHistoryResult.error, useEmptyHistoryAPI]);

  // EntityAdapter selektörleriyle optimizasyon
  const visibleHistory = selectVisibleHistoryItems(historyResult, visibleCount);
  const remainingItems = selectRemainingHistoryCount(historyResult, visibleCount);

  // Ürün bilgilerine erişim için useGetCatalogueQuery - artık reduce kullanmıyoruz
  const { data: catalogData } = useGetCatalogueQuery();

  // Ürün bilgilerini EntityAdapter ile almak için
  const getProductInfo = useCallback(
    (productId: number) => {
      // Veri yoksa boş değerler döndür
      if (!catalogData) {
        return { name: '', category: '', image: '' };
      }

      // catalogSelectors.selectById kullanarak doğrudan EntityAdapter'dan ürünü al - O(1) operasyon
      const product = catalogSelectors.selectById(catalogData, productId);

      return {
        name: product?.name || '',
        category: product?.category || '',
        image: product?.images?.[0] || '',
      };
    },
    [catalogData]
  );

  // Tarih formatlamak için tek bir Intl.DateTimeFormat nesnesi oluştur
  // useMemo ile ilk render'da bir kez oluştur, sonra tekrar oluşturma
  const dateFormatter = useMemo(() => {
    // Gün ve ay için ayrı formatlar
    const dayFormatter = new Intl.DateTimeFormat('tr-TR', { day: 'numeric' });
    const monthFormatter = new Intl.DateTimeFormat('tr-TR', { month: 'short' });

    // Daha performanslı ve tutarlı tarih formatlama fonksiyonu
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

  // IntersectionObserver için callback oluştur
  const intersectionCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    if (entry?.isIntersecting) {
      // Yeni veri yükle
      setVisibleCount(prev => prev + 20);
    }
  }, []);

  // IntersectionObserver ile otomatik yükleme
  useEffect(() => {
    if (!sentinelRef.current || remainingItems <= 0) return;

    const observer = new IntersectionObserver(intersectionCallback, {
      rootMargin: '200px', // 200px önceden yüklemeye başla
      threshold: 0.1, // %10 görünür olduğunda tetikle
    });

    const currentRef = sentinelRef.current;
    observer.observe(currentRef);

    // Cleanup - sentinelRef.current null olabilir bu durumda
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [sentinelRef, remainingItems, intersectionCallback]);

  // Loading durumunda skeleton göster
  if (historyLoading) {
    return <AccountPageSkeleton showHistory={true} historyItemCount={6} />;
  }

  // Eğer iki API'de de hata varsa hata bileşenini göster
  if (historyError && useEmptyHistoryAPI && emptyHistoryResult.error) {
    return (
      <ApiErrorMessage
        error={historyError}
        onRetry={() => {
          // Tekrar normal API'yi deneyerek başla
          setUseEmptyHistoryAPI(false);
          refetch();
        }}
      />
    );
  }

  return (
    <div className={styles.accountPage}>
      {/* Account Header */}
      <div className={styles.accountHeader}>
        <div className={styles.avatar}>
          <img src="/images/profile-avatar.png" alt="Alex" className={styles.avatarImage} />
        </div>
        <div className={styles.info}>
          <h1 className={styles.name}>Alex</h1>
        </div>
      </div>

      {/* İki farklı durum: History var/yok */}
      {visibleHistory && visibleHistory.length > 0 ? (
        // History varsa - Figma'daki yeni tasarım
        <div className={styles.historyContainer}>
          {/* History Header */}
          <div className={styles.historyHeader}>
            <div className={styles.historyTitle}>History</div>
          </div>

          {/* History Items */}
          <div className={styles.historyItems}>
            {visibleHistory.map((purchase: Purchase, index: number) => {
              const productInfo = getProductInfo(purchase.id);
              // Benzersiz key oluştur - timestamp + product id + index kombinasyonu
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

            {/* Otomatik yükleme için görünmez sentinel element */}
            {remainingItems > 0 && (
              <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true">
                {/* Yükleme göstergesi */}
                <div className={styles.loadingIndicator}>Daha fazla yükleniyor...</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // History yoksa - Figma'daki boş durum tasarımı
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <div className={styles.emptyStateText}>
              <h2 className={styles.emptyStateTitle}>No history yet</h2>
              <p className={styles.emptyStateDescription}>Your purchase history will appear here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
