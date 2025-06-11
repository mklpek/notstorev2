import React, { useState, useMemo } from 'react';
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

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Ürünün sepette olup olmadığını kontrol et
  const isInCart = useAppSelector(selectIsInCart(product.id));

  // Click handler'ı memoize et
  const handleCardClick = useMemo(() => {
    return () => {
      if (onProductClick) {
        onProductClick(product.id);
      }
    };
  }, [product.id, onProductClick]);

  // Figma tasarımına göre kategori ve ismi birleştir - useMemo ile hesapla
  const displayTitle = useMemo(
    () => `${product.category} ${product.name}`,
    [product.category, product.name]
  );

  // onIndexChange fonksiyonunu memoize et
  const handleIndexChange = useMemo(() => {
    return (index: number) => {
      setCurrentImageIndex(index);
    };
  }, []);

  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <ImageGallery
          images={product.images}
          currentIndex={currentImageIndex}
          onIndexChange={handleIndexChange}
        />
        {/* Tag elementi - sadece ürün sepetteyse görünür */}
        {isInCart && (
          <div className={styles.cartTag}>
            <CartTagIcon />
          </div>
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

// Bileşeni memo ile sarmalayarak gereksiz render'ları önlüyoruz
export default React.memo(ProductCard);
