import React from 'react';
import styles from './ImageGallery.module.css';
import ProgressiveImage from '../../../core/ui/ProgressiveImage';

interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, currentIndex, onIndexChange }) => {
  // useMemo optimizasyonunu kaldırdım
  const getDotSizeClass = (index: number, totalDots: number, activeIndex: number) => {
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

  return (
    <div className={styles.imageGallery}>
      <div className={styles.imageContainer}>
        {/* 
          TÜM GÖRSELLERİ RENDER ETMEK YERİNE SADECE AKTİF OLANI GÖSTER.
          Basitleştirilmiş ve daha az bellek kullanan versiyon.
        */}
        <ProgressiveImage
          src={images && images.length > 0 ? images[currentIndex] || '' : ''}
          alt={`Ürün resmi ${currentIndex + 1}`}
          className=""
          loading="eager"
        />
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

// React.memo optimizasyonunu kaldırdım
export default ImageGallery;
