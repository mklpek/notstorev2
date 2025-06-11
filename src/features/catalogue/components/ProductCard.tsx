import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Item } from '../../../core/api/notApi';
import { useAppSelector } from '../../../core/store/hooks';
import { selectIsInCart } from '../../cart/selectors';
import CartTagIcon from '../../../core/ui/Icons/CartTagIcon';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Item;
  onProductClick?: ((productId: number) => void) | undefined;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
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

  // İlk görseli al - ürün sayfasında tüm galeri görüntülenecek
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '';

  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        {/* Sadece ilk görseli göster - standart img kullanarak */}
        <img src={mainImage} alt={displayTitle} className={styles.productImage} loading="lazy" />

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
