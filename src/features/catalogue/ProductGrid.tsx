import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from './components/ProductCard';
import { useGetCatalogueQuery, catalogSelectors } from '../../core/api/notApi';
import type { Item } from '../../core/api/notApi';
import styles from './ProductGrid.module.css';
import { useDebouncedValue } from '../../core/hooks/useDebounce';
import NoResultsFound from './components/NoResultsFound';
import ProductCardSkeleton from '../../core/ui/Skeleton/ProductCardSkeleton';
import { ApiErrorMessage } from '../../core/ui';

// 'count' parametresini değişken hale getiriyoruz
const SKELETON_COUNT = 6;
const COLUMN_COUNT = 2; // Her satırda 2 ürün
const CARD_GAP = 12; // px, tasarımdaki boşluk
const ITEM_BATCH_SIZE = 10; // Her seferde kaç ürün gösterileceği

// Sayfa geçişlerinde state'i korumak için global değişken (singleton pattern)
let cachedVisibleItems = ITEM_BATCH_SIZE;

const ProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const gridRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Kaç ürün gösterileceğini tutan state - cached değeri başlangıçta kullan
  const [visibleItems, setVisibleItems] = useState(cachedVisibleItems);

  // visibleItems değiştiğinde cache'i güncelle
  useEffect(() => {
    cachedVisibleItems = visibleItems;
  }, [visibleItems]);

  // IntersectionObserver için callback - useCallback ile memoize et
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    // Son element görünür olduğunda daha fazla ürün yükle
    if (entries[0]?.isIntersecting) {
      setVisibleItems(prev => prev + ITEM_BATCH_SIZE);
    }
  }, []);

  // Ref'i ve observer'ı temizleyen bağımsız bir useEffect
  useEffect(() => {
    // Observer'ı bir kez oluştur ve ref'te sakla
    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: '200px',
      threshold: 0.1,
    });

    return () => {
      // Component unmount olduğunda observer'ı temizle
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection]); // sadece callback değiştiğinde yeniden oluştur

  // Son element değiştiğinde observer'ı güncelle
  useEffect(() => {
    const observer = observerRef.current;
    if (!observer || !gridRef.current) return;

    // Önce tüm gözlemleri temizle
    observer.disconnect();

    // Son elemana observer ekle
    const lastElement = gridRef.current.lastElementChild;
    if (lastElement) {
      observer.observe(lastElement);
    }
  }); // dependency array yok - her render'da kontrol et ama observer'ı yeniden oluşturma

  // Debounce ederek, kullanıcı her tuşa bastığında değil,
  // 300ms duraklamadan sonra arama yapmasını sağlıyoruz
  const debouncedQuery = useDebouncedValue(rawQuery.trim(), 300);

  // RTK Query kullanımı - refetch fonksiyonunu doğrudan alıyoruz
  // staleTime ve cacheTime artırıldı - API önbelleğe alınıyor
  const { isLoading, error, data, refetch } = useGetCatalogueQuery(undefined, {
    // Sayfa geçişlerinde önbelleği koru
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: true,
  });

  // Filtrelenmiş ürünleri hesapla
  const filteredProducts = useMemo(() => {
    if (!data) return [];

    // Tüm ürünleri adapter selektörü ile al
    const allProducts = catalogSelectors.selectAll(data);

    // Arama yoksa tüm ürünleri döndür
    if (!debouncedQuery) {
      return allProducts;
    }

    // Arama terimine göre filtrele
    return allProducts.filter((p: Item) =>
      `${p.category} ${p.name}`.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [data, debouncedQuery]);

  // Görünür ürünler - visibleItems sayısı kadar ürün göster
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleItems);
  }, [filteredProducts, visibleItems]);

  // handleProductClick fonksiyonunu useCallback ile optimize ediyoruz
  // useCallback, useMemo'dan daha uygun bir seçimdir fonksiyonlar için
  const handleProductClick = useCallback(
    (productId: number) => {
      navigate(`/product/${productId}`);
    },
    [navigate]
  );

  // Skeleton render etme için memoize edilmiş bir değer kullanıyoruz
  // isLoading değişmediği sürece bu kısım yeniden render edilmeyecek
  const loadingContent = useMemo(
    () => (
      <div className={styles.productGrid} aria-busy="true" aria-label="Ürünler yükleniyor">
        <ProductCardSkeleton count={SKELETON_COUNT} />
      </div>
    ),
    []
  );

  // Aşağıya doğru kaydıkça daha fazla ürün yüklensin diye en altta bir yükleme göstergesi
  const renderLoadingIndicator = useCallback(() => {
    // Hala gösterilecek ürün varsa
    if (visibleProducts.length < filteredProducts.length) {
      return (
        <div className={styles.loadMoreIndicator} key="loading-more">
          <div className={styles.loadingDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      );
    }
    return null;
  }, [visibleProducts.length, filteredProducts.length]);

  if (isLoading) {
    return loadingContent;
  }

  if (error) {
    return (
      <ApiErrorMessage
        error={error}
        onRetry={() => refetch()}
        customMessage="Ürünleri yüklerken bir sorun oluştu."
      />
    );
  }

  // Ürün bulunamadı durumu - sadece arama yapıldığında ve sonuç bulunamadığında NoResultsFound göster
  if (!filteredProducts || filteredProducts.length === 0) {
    // Sadece arama sorgusu varsa NoResultsFound göster
    if (rawQuery.trim()) {
      return <NoResultsFound />;
    }
    // Arama sorgusu yoksa hiçbir şey gösterme (boş grid döndür)
    return <div className={styles.productGrid}></div>;
  }

  // Basit ve performanslı infinite scroll yapısı
  return (
    <div className={styles.productGrid} ref={gridRef}>
      {visibleProducts.map((product: Item) => (
        <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
      ))}
      {renderLoadingIndicator()}
    </div>
  );
};

export default React.memo(ProductGrid);
