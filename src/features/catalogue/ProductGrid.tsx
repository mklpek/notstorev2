/******************************************************************************
 * File: ProductGrid.tsx
 * Layer: feature
 * Desc: Product grid component with search functionality and optimized rendering
 ******************************************************************************/

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

// Making 'count' parameter variable
const SKELETON_COUNT = 6;

/**
 * Product grid component with search and filtering capabilities
 * Displays products in a responsive grid layout with debounced search
 * @returns JSX element containing product grid with search functionality
 */
const ProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';

  // Debounce to prevent search on every keystroke,
  // search only after 300ms pause
  const debouncedQuery = useDebouncedValue(rawQuery.trim(), 300);

  // RTK Query usage - getting refetch function directly
  const { isLoading, error, data, refetch } = useGetCatalogueQuery();

  // Calculate filtered products
  const filteredProducts = useMemo(() => {
    if (!data) return [];

    // Get all products using adapter selector
    const allProducts = catalogSelectors.selectAll(data);

    // Return all products if no search query
    if (!debouncedQuery) {
      return allProducts;
    }

    // Filter by search term
    return allProducts.filter((p: Item) =>
      `${p.category} ${p.name}`.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [data, debouncedQuery]);

  // Optimize handleProductClick function with useMemo
  // Won't be recreated unless navigate function changes
  const handleProductClick = useMemo(() => {
    return (productId: number) => {
      navigate(`/product/${productId}`);
    };
  }, [navigate]);

  // Use memoized value for skeleton rendering
  // This section won't re-render unless isLoading changes
  const loadingContent = useMemo(
    () => (
      <div className={styles.productGrid} aria-busy="true" aria-label="Loading products">
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
        customMessage="An error occurred while loading products."
      />
    );
  }

  // No products found - show NoResultsFound only when searching and no results
  if (!filteredProducts || filteredProducts.length === 0) {
    // Show NoResultsFound only if there's a search query
    if (rawQuery.trim()) {
      return <NoResultsFound />;
    }
    // If no search query, show empty grid
    return <div className={styles.productGrid}></div>;
  }

  // Show filtered products similar to optimized structure in ItemPage
  return (
    <div className={styles.productGrid}>
      {filteredProducts.map((product: Item) => (
        <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
      ))}
    </div>
  );
};

// Wrap component with memo to prevent unnecessary renders
export default React.memo(ProductGrid);
