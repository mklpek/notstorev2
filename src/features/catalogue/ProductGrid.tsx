import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from './components/ProductCard';
import { useGetCatalogueQuery, catalogSelectors } from '../../core/api/notApi';
import type { Item } from '../../core/api/notApi';
import styles from './ProductGrid.module.css';
import { useDebouncedValue } from '../../core/hooks/useDebounce';
import NoResultsFound from './components/NoResultsFound';
import ProductCardSkeleton from '../../core/ui/Skeleton/ProductCardSkeleton';
import { ApiErrorMessage } from '../../core/ui';

// Grid konfigürasyonu - Figma tasarımına uygun
const ITEMS_PER_ROW = 2;
const ITEM_HEIGHT = 264; // Kart yüksekliği + gap
const SKELETON_COUNT = 6;
const BUFFER_SIZE = 4; // Görünür alan dışında render edilecek ek item sayısı

const ProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const gridRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

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

  // Scroll event handler - virtualization için
  const handleScroll = useCallback(() => {
    if (!gridRef.current) return;

    // Window scroll pozisyonunu al
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    // Grid'in viewport içindeki konumunu al
    const gridRect = gridRef.current.getBoundingClientRect();
    const gridTop = gridRect.top + scrollTop;
    const gridVisibleTop = Math.max(0, scrollTop - gridTop);

    // Görünür alandaki item'ları hesapla
    const startRow = Math.floor(gridVisibleTop / ITEM_HEIGHT);
    const visibleRows = Math.ceil(windowHeight / ITEM_HEIGHT);
    const endRow = startRow + visibleRows;

    const startIndex = Math.max(0, (startRow - BUFFER_SIZE) * ITEMS_PER_ROW);
    const endIndex = Math.min(filteredProducts.length, (endRow + BUFFER_SIZE) * ITEMS_PER_ROW);

    setVisibleRange({ start: startIndex, end: endIndex });
  }, [filteredProducts.length]);

  // Window scroll listener ekle
  useEffect(() => {
    // İlk yükleme için görünür alanı hesapla
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  // handleProductClick fonksiyonunu useMemo ile optimize ediyoruz
  const handleProductClick = useMemo(() => {
    return (productId: number) => {
      navigate(`/product/${productId}`);
    };
  }, [navigate]);

  // Görünür ürünleri hesapla
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(visibleRange.start, visibleRange.end);
  }, [filteredProducts, visibleRange]);

  // Container yüksekliğini hesapla (tüm ürünler için)
  const totalHeight = Math.ceil(filteredProducts.length / ITEMS_PER_ROW) * ITEM_HEIGHT;

  // Offset hesapla (görünür alanın başlangıcı)
  const offsetY = Math.floor(visibleRange.start / ITEMS_PER_ROW) * ITEM_HEIGHT;

  if (isLoading) {
    return (
      <div className={styles.productGrid} aria-busy="true" aria-label="Ürünler yükleniyor">
        <ProductCardSkeleton count={SKELETON_COUNT} />
      </div>
    );
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

  // Ürün bulunamadı durumu
  if (!filteredProducts || filteredProducts.length === 0) {
    if (rawQuery.trim()) {
      return <NoResultsFound />;
    }
    return <div className={styles.productGrid}></div>;
  }

  // Virtualized grid render
  return (
    <div ref={gridRef} className={styles.productGrid}>
      {/* Toplam yükseklik için spacer */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Görünür ürünler */}
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            left: 0,
            right: 0,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'stretch',
            alignItems: 'stretch',
            columnGap: '12px',
            rowGap: '28px',
            padding: '0px 16px',
          }}
        >
          {visibleProducts.map((product: Item) => (
            <div
              key={product.id}
              style={{
                flex: '0 0 calc((100% - 12px) / 2)',
                minWidth: 0,
              }}
            >
              <ProductCard product={product} onProductClick={handleProductClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Bileşeni memo ile sarmalayarak gereksiz render'ları önlüyoruz
export default React.memo(ProductGrid);
