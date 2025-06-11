import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from './components/ProductCard';
import { useGetCatalogueQuery, catalogSelectors } from '../../core/api/notApi';
import type { Item } from '../../core/api/notApi';
import styles from './ProductGrid.module.css';
import { useDebouncedValue } from '../../core/hooks/useDebounce';
import NoResultsFound from './components/NoResultsFound';
import ProductCardSkeleton from '../../core/ui/Skeleton/ProductCardSkeleton';
import { ApiErrorMessage } from '../../core/ui';

// Sabit değerler
const SKELETON_COUNT = 6;
const COLS = 2; // 2 sütunlu grid
const CARD_HEIGHT = 212; // Yaklaşık bir kart yüksekliği (kart + boşluk)
const INITIAL_VISIBLE_COUNT = 6; // İlk yükleme için görünür ürün sayısı

const ProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const gridRef = useRef<HTMLDivElement>(null);

  // Kaç ürün gösterildiğini izleyen state
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  // Debounce ederek, kullanıcı her tuşa bastığında değil,
  // 300ms duraklamadan sonra arama yapmasını sağlıyoruz
  const debouncedQuery = useDebouncedValue(rawQuery.trim(), 300);

  // RTK Query kullanımı - refetch fonksiyonunu doğrudan alıyoruz
  const { isLoading, error, data, refetch } = useGetCatalogueQuery();

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

  // Görünür ürünleri dilimle
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Scroll olayını işleyen intersection observer
  useEffect(() => {
    // Viewport'un alt kısmına yaklaştığında daha fazla ürün yükle
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && visibleCount < filteredProducts.length) {
        // Her seferinde 4 ürün daha ekle (2 sıra)
        setVisibleCount(prevCount => Math.min(prevCount + 4, filteredProducts.length));
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0.1,
      rootMargin: '200px', // 200px görünmeden önce tetikle
    });

    const sentinel = document.getElementById('products-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
      observer.disconnect();
    };
  }, [visibleCount, filteredProducts.length]);

  // handleProductClick fonksiyonunu optimize ediyoruz
  const handleProductClick = useCallback(
    (productId: number) => {
      navigate(`/product/${productId}`);
    },
    [navigate]
  );

  // Skeleton render etme için memoize edilmiş bir değer kullanıyoruz
  const loadingContent = useMemo(
    () => (
      <div className={styles.productGrid} aria-busy="true" aria-label="Ürünler yükleniyor">
        <ProductCardSkeleton count={SKELETON_COUNT} />
      </div>
    ),
    []
  );

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

  // Optimize edilmiş grid - sadece görünür ürünleri renderla
  return (
    <div className={styles.productGrid} ref={gridRef}>
      {visibleProducts.map((product: Item) => (
        <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
      ))}

      {/* Sonsuz scroll için sentinel element */}
      {visibleCount < filteredProducts.length && (
        <div
          id="products-sentinel"
          style={{
            width: '100%',
            height: '10px',
            gridColumn: '1 / -1', // Tüm grid genişliğini kapla
            visibility: 'hidden', // Görünmez ama algılanabilir
          }}
        />
      )}
    </div>
  );
};

export default React.memo(ProductGrid);
