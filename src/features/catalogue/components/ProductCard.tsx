import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Item } from '../../../core/api/notApi';
import { useAppSelector } from '../../../core/store/hooks';
import { selectIsInCart } from '../../cart/selectors';
import ImageGallery from './ImageGallery';
import CartTagIcon from '../../../core/ui/Icons/CartTagIcon';
import styles from './ProductCard.module.css';
import { observeElement, unobserveElement } from '../../../core/observer';

interface ProductCardProps {
  product: Item;
  onProductClick?: ((productId: number) => void) | undefined;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onProductClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Ürünün sepette olup olmadığını kontrol et
  const isInCart = useAppSelector(selectIsInCart(product.id));

  // Global IntersectionObserver kullanımı - performans optimizasyonu
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Global observer'ı kullan
    observeElement(element, isVisible => {
      if (isVisible) {
        setInView(true);
      }
    });

    // Cleanup
    return () => {
      if (element) {
        unobserveElement(element);
      }
    };
  }, []);

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    }
  };

  // Figma tasarımına göre kategori ve ismi birleştir
  const displayTitle = `${product.category} ${product.name}`;

  return (
    <div ref={ref} className={styles.productCard} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        {inView && (
          <>
            <ImageGallery
              images={product.images}
              currentIndex={currentImageIndex}
              onIndexChange={setCurrentImageIndex}
            />
            {/* Tag elementi - sadece ürün sepetteyse görünür */}
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
});

// React DevTools için komponent adı
ProductCard.displayName = 'ProductCard';

export default ProductCard;
