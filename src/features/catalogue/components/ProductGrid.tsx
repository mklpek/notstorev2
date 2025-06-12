/******************************************************************************
 * File: ProductGrid.tsx
 * Layer: feature
 * Desc: Simple product grid component for displaying catalogue items
 ******************************************************************************/

import React from 'react';
import { useGetCatalogueQuery, selectProductsByQuery } from '../../../core/api/notApi';
import type { Item } from '../../../core/api/notApi';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

/**
 * Simple product grid component
 * Displays all products from catalogue in a grid layout
 * @returns JSX element containing product grid
 */
const ProductGrid: React.FC = () => {
  const catalogueResult = useGetCatalogueQuery();
  const { error, isLoading } = catalogueResult;

  // Get normalized data with EntityAdapter
  const products = selectProductsByQuery(catalogueResult, '');

  if (isLoading) {
    return <div className={styles.loading}>Loading products...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error occurred while loading products</div>;
  }

  if (!products || products.length === 0) {
    return <div className={styles.empty}>No products available yet</div>;
  }

  return (
    <div className={styles.grid}>
      {products.map((product: Item) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
