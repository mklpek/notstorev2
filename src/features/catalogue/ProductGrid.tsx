import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FixedSizeGrid as Grid } from 'react-window';
import ProductCard from './components/ProductCard';
import { useGetCatalogueQuery, catalogSelectors } from '../../core/api/notApi';
import type { Item } from '../../core/api/notApi';
import styles from './ProductGrid.module.css';
import { useDebouncedValue } from '../../core/hooks/useDebounce';
import NoResultsFound from './components/NoResultsFound';
import ProductCardSkeleton from '../../core/ui/Skeleton/ProductCardSkeleton';
import { ApiErrorMessage } from '../../core/ui';

// Grid konfigürasyonu - ItemPage'den esinlenen optimizasyonlar
const GRID_CONFIG = {
  columnCount: 2,
  columnWidth: 176, // 160px card + 16px gap
  rowHeight: 236, // card height + gap
  containerWidth: 360, // max-width container
  skeletonCount: 6,
  overscanRowCount: 2, // Performans için 2 satır önceden render et
} as const;

// Virtualized grid cell bileşeni
interface GridCellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    products: Item[];
    onProductClick: (productId: number) => void;
  };
}

const GridCell: React.FC<GridCellProps> = ({ columnIndex, rowIndex, style, data }) => {
  const { products, onProductClick } = data;
  const productIndex = rowIndex * GRID_CONFIG.columnCount + columnIndex;
  const product = products[productIndex];

  // Ürün yoksa boş cell render et
  if (!product) {
    return <div style={style} />;
  }

  return (
    <div style={style} className={styles.gridCell}>
      <ProductCard product={product} onProductClick={onProductClick} />
    </div>
  );
};

const ProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const gridRef = useRef<Grid>(null);
  const [containerHeight, setContainerHeight] = useState(600); // Default height

  // Debounce ederek performans optimizasyonu
  const debouncedQuery = useDebouncedValue(rawQuery.trim(), 300);

  // RTK Query kullanımı
  const { isLoading, error, data, refetch } = useGetCatalogueQuery();

  // Container yüksekliğini dinamik olarak hesapla
  useEffect(() => {
    const updateHeight = () => {
      // Viewport height - header - tabbar - padding
      const availableHeight = window.innerHeight - 120; // Approximate header + tabbar
      setContainerHeight(Math.max(400, availableHeight));
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Filtrelenmiş ürünleri hesapla - memoized
  const filteredProducts = useMemo(() => {
    if (!data) return [];

    const allProducts = catalogSelectors.selectAll(data);

    if (!debouncedQuery) {
      return allProducts;
    }

    return allProducts.filter((p: Item) =>
      `${p.category} ${p.name}`.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [data, debouncedQuery]);

  // Product click handler - useCallback ile optimize edildi
  const handleProductClick = useCallback(
    (productId: number) => {
      navigate(`/product/${productId}`);
    },
    [navigate]
  );

  // Grid data - memoized
  const gridData = useMemo(
    () => ({
      products: filteredProducts,
      onProductClick: handleProductClick,
    }),
    [filteredProducts, handleProductClick]
  );

  // Row count hesaplama
  const rowCount = Math.ceil(filteredProducts.length / GRID_CONFIG.columnCount);

  // Loading state - skeleton grid
  if (isLoading) {
    return (
      <div
        className={`${styles.productGrid} tg-container`}
        aria-busy="true"
        aria-label="Ürünler yükleniyor"
      >
        <ProductCardSkeleton count={GRID_CONFIG.skeletonCount} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ApiErrorMessage
        error={error}
        onRetry={() => refetch()}
        customMessage="Ürünleri yüklerken bir sorun oluştu."
      />
    );
  }

  // No results state
  if (!filteredProducts || filteredProducts.length === 0) {
    if (rawQuery.trim()) {
      return <NoResultsFound />;
    }
    return <div className={`${styles.productGrid} tg-container`}></div>;
  }

  // Virtualized grid render
  return (
    <div className={`${styles.productGrid} tg-container`}>
      <Grid
        ref={gridRef}
        className={styles.virtualGrid}
        columnCount={GRID_CONFIG.columnCount}
        columnWidth={GRID_CONFIG.columnWidth}
        height={containerHeight}
        rowCount={rowCount}
        rowHeight={GRID_CONFIG.rowHeight}
        width={GRID_CONFIG.containerWidth}
        itemData={gridData}
        overscanRowCount={GRID_CONFIG.overscanRowCount}
      >
        {GridCell}
      </Grid>
    </div>
  );
};

export default ProductGrid;
