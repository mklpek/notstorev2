import React from 'react'
import styles from './ImageGallery.module.css'
import ProgressiveImage from '../../../components/ProgressiveImage'

interface ImageGalleryProps {
  images: string[]
  currentIndex: number
  onIndexChange: (index: number) => void
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  currentIndex, 
  onIndexChange 
}) => {
  // Figma tasarımına göre dot boyutlarını hesapla
  const getDotSizeClass = (index: number, totalDots: number, currentIndex: number) => {
    // Figma tasarımında aktif dot her zaman 5. pozisyonda (index 4)
    // Sağında 4, solunda 4 dot var
    const activePosition = 4; // 5. pozisyon (0-indexed)
    
    if (index === activePosition) {
      return styles.dotActive
    }
    
    // Aktif pozisyondan uzaklığa göre boyutları hesapla
    const distance = Math.abs(index - activePosition)
    
    // Figma tasarımına göre boyutlar:
    // Distance 4 (en dış): 2px
    // Distance 3 (ikinci): 3px  
    // Distance 2,1 (merkeze yakın): 4px
    if (distance === 4) {
      return styles.dotSize2px
    } else if (distance === 3) {
      return styles.dotSize3px
    } else {
      return styles.dotSize4px
    }
  }

  // Dinamik API görselini kullan
  const currentImageSrc = images[currentIndex] || '';
  // Güvenlik önlemi fallback (şimdilik yorum satırında)
  // const currentImageSrc = images[currentIndex] || '/images/product-1.png'

  return (
    <div className={styles.imageGallery}>
      <div className={styles.imageContainer}>
        <ProgressiveImage 
          src={currentImageSrc} 
          alt={`Ürün resmi ${currentIndex + 1}`}
          className={styles.image}
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
  )
}

export default ImageGallery 