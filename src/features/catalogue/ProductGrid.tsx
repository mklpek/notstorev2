import React, { useMemo, useState, useEffect, useRef } from 'react';
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

const ProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const gridRef = useRef<HTMLDivElement>(null);

  // Kaç ürün gösterileceğini tutan state
  const [visibleItems, setVisibleItems] = useState(ITEM_BATCH_SIZE);

  // Scroll eventi için useEffect
  useEffect(() => {
    // İntersection Observer kurulumu - viewport'a yaklaşan ürünleri tespit etmek için
    const observer = new IntersectionObserver(
      entries => {
        // Son element görünür olduğunda daha fazla ürün yükle
        if (entries[0]?.isIntersecting) {
          setVisibleItems(prev => prev + ITEM_BATCH_SIZE);
        }
      },
      { rootMargin: '200px' } // 200px aşağıdan yüklemeye başla
    );

    // Son elemana observer ekle
    const lastElement = gridRef.current?.lastElementChild;
    if (lastElement) {
      observer.observe(lastElement);
    }

    return () => observer.disconnect();
  }, [visibleItems]); // visibleItems değiştiğinde observer'ı yeniden kur

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

  // Görünür ürünler - visibleItems sayısı kadar ürün göster
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleItems);
  }, [filteredProducts, visibleItems]);

  // handleProductClick fonksiyonunu useMemo ile optimize ediyoruz
  // navigate fonksiyonu değişmediği sürece yeniden oluşturulmayacak
  const handleProductClick = useMemo(() => {
    return (productId: number) => {
      navigate(`/product/${productId}`);
    };
  }, [navigate]);

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
  const renderLoadingIndicator = () => {
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
  };

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
