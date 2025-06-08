import React from 'react';
import { useGetCatalogueQuery, selectProductsByQuery } from '../../../api/notApi';
import type { Item } from '../../../api/notApi';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

const ProductGrid: React.FC = () => {
  const catalogueResult = useGetCatalogueQuery();
  const { error, isLoading } = catalogueResult;

  // EntityAdapter ile normalize edilmiş veriyi al
  const products = selectProductsByQuery(catalogueResult, '');

  if (isLoading) {
    return <div className={styles.loading}>Ürünler yükleniyor...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ürünler yüklenirken hata oluştu</div>;
  }

  if (!products || products.length === 0) {
    return <div className={styles.empty}>Henüz ürün bulunmuyor</div>;
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
