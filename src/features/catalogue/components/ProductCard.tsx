import React, { useState } from 'react';
// import { useInView } from 'react-intersection-observer'; // Lazy loading özelliğini kaldırıyorum
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

  // InView hook kaldırıldı - her zaman görünür kabul edeceğiz
  // const { ref, inView } = useInView({
  //   triggerOnce: true,
  //   threshold: 0.1,
  //   rootMargin: '200px 0px', // Daha erken yükleme için 200px yukarıdan başlat
  // });

  // Ürünün sepette olup olmadığını kontrol et
  const isInCart = useAppSelector(selectIsInCart(product.id));

  // Click handler basitleştirildi - memoization kaldırıldı
  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    }
  };

  // Basitleştirilmiş görüntüleme ismi - memoization kaldırıldı
  const displayTitle = `${product.category} ${product.name}`;

  // Basit fonksiyon - memoization kaldırıldı
  const handleIndexChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        {/* Her zaman render et - inView kontrolü kaldırıldı */}
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

// React.memo kaldırıldı - normal export
export default ProductCard;
