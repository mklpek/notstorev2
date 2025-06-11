import React, { useMemo } from 'react';
import styles from './ImageGallery.module.css';
import ProgressiveImage from '../../../core/ui/ProgressiveImage';

interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, currentIndex, onIndexChange }) => {
  // Figma tasarımına göre dot boyutlarını hesapla - useMemo ile hesaplamayı optimize ediyoruz
  const getDotSizeClass = useMemo(() => {
    return (index: number, totalDots: number, activeIndex: number) => {
      // Figma tasarımında aktif dot her zaman 5. pozisyonda (index 4)
      // Sağında 4, solunda 4 dot var
      const activePosition = 4; // 5. pozisyon (0-indexed)

      if (index === activePosition) {
        return styles.dotActive;
      }

      // Aktif pozisyondan uzaklığa göre boyutları hesapla
      const distance = Math.abs(index - activePosition);

      // Figma tasarımına göre boyutlar:
      // Distance 4 (en dış): 2px
      // Distance 3 (ikinci): 3px
      // Distance 2,1 (merkeze yakın): 4px
      if (distance === 4) {
        return styles.dotSize2px;
      } else if (distance === 3) {
        return styles.dotSize3px;
      } else {
        return styles.dotSize4px;
      }
    };
  }, []);

  return (
    <div className={styles.imageGallery}>
      <div className={styles.imageContainer}>
        {/* 
          TÜM GÖRSELLERİ RENDER ET, SADECE AKTİF OLANI GÖSTER.
          Bu yöntem, `src` değiştirmekten daha güvenilirdir ve tarayıcının
          görselleri tekrar indirmesini engeller.
        */}
        {images.map((image, index) => (
          <div
            key={image}
            style={{
              display: index === currentIndex ? 'block' : 'none',
              width: '100%',
              height: '100%',
            }}
          >
            <ProgressiveImage
              src={image}
              alt={`Ürün resmi ${index + 1}`}
              className={styles.image || ''}
              loading={index === currentIndex ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        {images.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${getDotSizeClass(index, images.length, currentIndex)}`}
            onClick={() => onIndexChange(index)}
            aria-label={`Resim ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Bileşeni memo ile sarmalayarak gereksiz render'ları önlüyoruz
export default React.memo(ImageGallery);
