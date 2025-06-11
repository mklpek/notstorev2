import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import type { Item } from '../../../core/api/notApi';
import { useAppSelector } from '../../../core/store/hooks';
import { selectIsInCart } from '../../cart/selectors';
import ImageGallery from './ImageGallery';
import CartTagIcon from '../../../core/ui/Icons/CartTagIcon';
import styles from './ProductCard.module.css';
import ProgressiveImage from '../../../core/ui/ProgressiveImage';

interface ProductCardProps {
  product: Item;
  onProductClick?: ((productId: number) => void) | undefined;
  skipInView?: boolean; // IntersectionObserver'ı atlamak için
  loading?: 'lazy' | 'eager'; // Görsel yükleme stratejisi
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductClick,
  skipInView = false,
  loading = 'lazy',
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // skipInView true ise IntersectionObserver kullanma, doğrudan göster
  const inViewProps = skipInView
    ? { inView: true }
    : useInView({ triggerOnce: true, threshold: 0.1 });

  const { ref, inView } = inViewProps as { ref: React.RefObject<HTMLDivElement>; inView: boolean };

  // Ürünün sepette olup olmadığını kontrol et
  const isInCart = useAppSelector(selectIsInCart(product.id));

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    }
  };

  // Figma tasarımına göre kategori ve ismi birleştir
  const displayTitle = `${product.category} ${product.name}`;

  // Performans optimizasyonu: virtualization kullanılıyorsa sadece ilk resmi göster
  const shouldUseGallery = !skipInView;

  return (
    <div ref={ref} className={styles.productCard} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        {inView && (
          <>
            {shouldUseGallery ? (
              <ImageGallery
                images={product.images}
                currentIndex={currentImageIndex}
                onIndexChange={setCurrentImageIndex}
              />
            ) : (
              // Tek resimli basit versiyonu kullan (daha performanslı)
              <ProgressiveImage
                src={product.images[0] || ''}
                alt={displayTitle}
                className={styles.productImage}
                loading={loading}
              />
            )}
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
};

export default ProductCard;
