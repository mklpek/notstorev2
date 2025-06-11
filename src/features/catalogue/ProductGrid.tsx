import React from 'react';
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

  // Filtrelenmiş ürünleri hesapla - memoization kaldırıldı
  let filteredProducts: Item[] = [];

  if (data) {
    // Tüm ürünleri adapter selektörü ile al
    const allProducts = catalogSelectors.selectAll(data);

    // Arama yoksa tüm ürünleri döndür
    if (!debouncedQuery) {
      filteredProducts = allProducts;
    } else {
      // Arama terimine göre filtrele
      filteredProducts = allProducts.filter((p: Item) =>
        `${p.category} ${p.name}`.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }
  }

  // Basit click handler - memoization kaldırıldı
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // Basit loading içerik - memoization kaldırıldı
  const loadingContent = (
    <div className={styles.productGrid} aria-busy="true" aria-label="Ürünler yükleniyor">
      <ProductCardSkeleton count={SKELETON_COUNT} />
    </div>
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

  // Basit grid render - optimize edilmiş yapı kaldırıldı
  return (
    <div className={styles.productGrid}>
      {filteredProducts.map((product: Item) => (
        <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
      ))}
    </div>
  );
};

// React.memo kaldırıldı
export default ProductGrid;
