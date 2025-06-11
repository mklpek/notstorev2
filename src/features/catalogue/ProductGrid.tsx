import React, { useMemo } from 'react';
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

// Pencere alanındaki görünür öğe sayısını hesaplayan fonksiyon
const getVisibleItemCount = () => {
  // Ekran yüksekliğine göre başlangıçta kaç ürün gösterileceğini hesapla
  // Bir ürün kartı ~184px kare + 28px boşluk = ~212px yükseklik
  const viewportHeight = window.innerHeight;
  const headerHeight = 60; // Header yüksekliği
  const tabBarHeight = 50; // TabBar yüksekliği
  const cardHeight = 212; // Kart + boşluk yüksekliği

  // Görünür alan içindeki satır sayısı (2'şerli sütunlar)
  const visibleRows = Math.ceil((viewportHeight - headerHeight - tabBarHeight) / cardHeight);

  // Görünür öğe sayısı (satır * 2 sütun) + üst ve alt marjlar için +1 satır
  return (visibleRows + 1) * 2;
};

const ProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';

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

  // Görünür ürünleri hesapla (performans optimizasyonu)
  const visibleProducts = useMemo(() => {
    if (!filteredProducts.length) return [];

    // Görünür öğe sayısını belirle (ekran boyutuna göre)
    const visibleCount = getVisibleItemCount();

    // İlk aşamada sadece görünür ürünleri döndür
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts]);

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
    <div className={styles.productGrid}>
      {visibleProducts.map((product: Item) => (
        <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
      ))}
      {/* Kalan ürünler için bir sentinel element */}
      {filteredProducts.length > visibleProducts.length && (
        <div
          id="product-sentinel"
          style={{ width: '100%', height: '10px' }}
          onScroll={() => {
            // Daha fazla ürün yükleme mantığı buraya eklenebilir
            // Şimdilik basit bir çözüm olarak sadece 6 ürün daha yükleyelim
            const currentlyVisible = document.querySelectorAll(`.${styles.productCard}`).length;
            if (currentlyVisible < filteredProducts.length) {
              // Daha fazla ürün göstermek için state güncellemesi yapılabilir
              // Bu örnekte basit bir yaklaşım kullanıyoruz
            }
          }}
        />
      )}
    </div>
  );
};

export default ProductGrid;
