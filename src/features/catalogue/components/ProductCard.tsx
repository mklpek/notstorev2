/******************************************************************************
 * File: ProductCard.tsx
 * Layer: feature
 * Desc: Product card component with image gallery, cart indicator, and click handling
 ******************************************************************************/

import React, { useState, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import type { Item } from '../../../core/api/notApi';
import { useAppSelector } from '../../../core/store/hooks';
import { selectIsInCart } from '../../cart/selectors';
import ImageGallery from './ImageGallery';
import CartTagIcon from '../../../core/ui/Icons/CartTagIcon';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Item;
  onProductClick?: ((productId: number) => void) | undefined;
}

/**
 * Product card component with image gallery and cart indicator
 * Displays product information with optimized rendering using intersection observer
 * @param product - Product item to display
 * @param onProductClick - Optional callback when product is clicked
 * @returns JSX element containing product card with image gallery
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // InView hook optimization - higher threshold and rootMargin
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '200px 0px', // Start loading 200px earlier for better UX
  });

  // Check if product is in cart
  const isInCart = useAppSelector(selectIsInCart(product.id));

  // Memoize click handler
  const handleCardClick = useMemo(() => {
    return () => {
      if (onProductClick) {
        onProductClick(product.id);
      }
    };
  }, [product.id, onProductClick]);

  // Combine category and name according to Figma design - calculate with useMemo
  const displayTitle = useMemo(
    () => `${product.category} ${product.name}`,
    [product.category, product.name]
  );

  // Memoize onIndexChange function
  const handleIndexChange = useMemo(() => {
    return (index: number) => {
      setCurrentImageIndex(index);
    };
  }, []);

  return (
    <div ref={ref} className={styles.productCard} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        {/* Render when inView - implement visibility detection */}
        {inView && (
          <>
            <ImageGallery
              images={product.images}
              currentIndex={currentImageIndex}
              onIndexChange={handleIndexChange}
            />
            {/* Tag element - visible only when product is in cart */}
            {isInCart && (
              <div className={styles.cartTag}>
                <CartTagIcon />
              </div>
            )}
          </>
        )}
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{displayTitle}</h3>
        <div className={styles.productPrice}>
          <span className={styles.priceMain}>{product.price}</span>
          <span className={styles.priceCurrency}>{product.currency}</span>
        </div>
      </div>
    </div>
  );
};

// Wrap component with memo to prevent unnecessary renders
export default React.memo(ProductCard);
