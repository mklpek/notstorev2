import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from './components/ProductCard';
import { useGetCatalogueQuery, catalogSelectors } from '../../core/api/notApi';
import type { Item } from '../../core/api/notApi';
import styles from './ProductGrid.module.css';
import { useDebouncedValue } from '../../core/hooks/useDebounce';
import NoResultsFound from './components/NoResultsFound';
import ProductCardSkeleton from '../../core/ui/Skeleton/ProductCardSkeleton';
import { ApiErrorMessage } from '../../core/ui';
import AutoSizer from 'react-virtualized-auto-sizer';

// Virtualization için basit bir alternatif yaklaşım
// React-window type hatalarını çözmek için şimdilik normal liste kullanıyoruz
// Temel virtualization prensiplerini uygulayacağız
const ITEMS_PER_PAGE = 6;

// 'count' parametresini değişken hale getiriyoruz
const SKELETON_COUNT = 6;

// 2 sütun için sabit değerler
const COLUMN_COUNT = 2;
const COLUMN_WIDTH = 176; // 160px + 16px gap
const ROW_HEIGHT = 236; // Ürün kartı + gap
const GRID_GAP = 12; // Grid boşluğu

const ProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const [page, setPage] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Ekran boyutunu takip et
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: Math.min(window.innerWidth, 390), // 390px max-width
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll olayını takip et - temel bir lazy loading yaklaşımı
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      // Sayfa sonuna yaklaşıldıysa bir sonraki sayfayı yükle
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Sayfalanmış ürünler - Virtualization yerine temel bir sayfalama yaklaşımı
  const paginatedProducts = useMemo(() => {
    const endIndex = Math.min((page + 1) * ITEMS_PER_PAGE, filteredProducts.length);
    return filteredProducts.slice(0, endIndex);
  }, [filteredProducts, page]);

  // handleProductClick fonksiyonunu useCallback ile optimize ediyoruz
  const handleProductClick = useCallback(
    (productId: number) => {
      navigate(`/product/${productId}`);
    },
    [navigate]
  );

  // Loading state için ProductCardSkeleton kullan
  if (isLoading) {
    return (
      <div
        className={`${styles.productGrid} tg-container`}
        aria-busy="true"
        aria-label="Ürünler yükleniyor"
      >
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

  // Ürün bulunamadı durumu - sadece arama yapıldığında ve sonuç bulunamadığında NoResultsFound göster
  if (!filteredProducts || filteredProducts.length === 0) {
    // Sadece arama sorgusu varsa NoResultsFound göster
    if (rawQuery.trim()) {
      return <NoResultsFound />;
    }
    // Arama sorgusu yoksa hiçbir şey gösterme (boş grid döndür)
    return <div className={`${styles.productGrid} tg-container`}></div>;
  }

  // Optimize edilmiş liste görünümü - sadece görünür ürünleri yükle
  return (
    <div className={`${styles.productGrid} tg-container`}>
      {paginatedProducts.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          onProductClick={handleProductClick}
          skipInView={index < 4} // İlk 4 ürün için eager loading
          loading={index < 4 ? 'eager' : 'lazy'} // İlk 4 ürün için eager loading
        />
      ))}
      {/* Yükleme göstergesi - Eğer daha fazla ürün varsa */}
      {paginatedProducts.length < filteredProducts.length && (
        <div className={styles.loading}>Daha fazla yükleniyor...</div>
      )}
    </div>
  );
};

export default ProductGrid;
