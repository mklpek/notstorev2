import React from 'react';
import styles from './ItemPageSkeleton.module.css';
import { TextSkeleton } from './SkeletonElements';

/**
 * ItemPage (Ürün Detay) skeleton bileşeni
 * Memo ile optimize edilmiştir
 */
const ItemPageSkeleton = React.memo(() => {
  // Slider küçük resimleri için bir dizi oluştur
  const sliderImagesCount = 5;

  return (
    <div className={styles.itemPage} aria-busy="true" aria-label="Ürün detayı yükleniyor">
      <div className={styles.body}>
        {/* Stickers Info */}
        <div className={styles.stickersInfo}>
          {/* Stickers Collections */}
          <div className={styles.stickersCollections}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.left}>
                <div className={styles.title}>
                  {/* Başlık skeleton - gerçek titleText ile aynı boyut */}
                  <TextSkeleton height={26} width="70%" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={styles.description}>
              {/* Description skeleton - gerçek descriptionText ile aynı */}
              <TextSkeleton height={17} width="100%" />
              <TextSkeleton height={17} width="85%" />
              <TextSkeleton height={17} width="60%" />
            </div>
          </div>

          {/* Tags */}
          <div className={styles.tags}>
            <div className={styles.tag}>
              <TextSkeleton width={40} height={12} />
            </div>
            <div className={styles.tag}>
              <TextSkeleton width={30} height={12} />
            </div>
            <div className={styles.tag}>
              <TextSkeleton width={45} height={12} />
            </div>
          </div>
        </div>

        {/* Big Sticker Container */}
        <div className={styles.bigStickerContainer}>
          <div className={styles.bigSticker}>{/* Büyük görsel için skeleton arka plan */}</div>
        </div>
      </div>

      {/* Fixed Bottom Content */}
      <div className={styles.fixedBottom}>
        {/* Stickers Slider */}
        <div className={styles.sliderContainer}>
          <div className={styles.stickersSlider}>
            {Array.from({ length: sliderImagesCount }).map((_, index) => (
              <div key={index} className={styles.sticker}>
                {/* Küçük görsel skeleton'ları için arka plan */}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.body}>
            {/* Add to Cart Button Skeleton */}
            <div className={styles.addToCartButton}></div>
            {/* Buy Now Button Skeleton */}
            <div className={styles.buyNowButton}></div>
          </div>
        </div>
      </div>
    </div>
  );
});

// React DevTools için komponent adı
ItemPageSkeleton.displayName = 'ItemPageSkeleton';

export default ItemPageSkeleton;
