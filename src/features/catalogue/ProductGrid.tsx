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

  // ItemPage'deki optimize edilmiş yapıya benzer şekilde filtrelenmiş ürünleri göster
  return (
    <div className={styles.productGrid}>
      {filteredProducts.map((product: Item) => (
        <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
      ))}
    </div>
  );
};

// Bileşeni memo ile sarmalayarak gereksiz render'ları önlüyoruz
export default React.memo(ProductGrid);
