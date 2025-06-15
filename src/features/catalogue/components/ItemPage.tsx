/******************************************************************************
 * File: ItemPage.tsx
 * Layer: feature
 * Desc: Product detail page with image gallery, product info, and sharing functionality
 ******************************************************************************/

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../../../layouts/Footer';
import ShareIcon from '../../../core/ui/Icons/ShareIcon';
import { useGetCatalogueQuery, catalogSelectors } from '../../../core/api/notApi';
import styles from './ItemPage.module.css';
import ItemPageSkeleton from '../../../core/ui/Skeleton/ItemPageSkeleton';
import ProgressiveImage from '../../../core/ui/ProgressiveImage';
import { shareProduct } from '../../../utils/telegramHelpers';

/**
 * Product detail page component
 * Displays product information, image gallery, and sharing functionality
 * @returns JSX element containing product detail page
 */
const ItemPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch product data from API - use selectFromResult to get product directly
  const { product, isLoading, error } = useGetCatalogueQuery(undefined, {
    selectFromResult: ({ data, isLoading, error }) => {
      // Return early if no data
      if (!data || isLoading) {
        return { product: undefined, isLoading, error };
      }

      // Get product directly with catalogSelectors.selectById - O(1) operation
      const foundProduct = catalogSelectors.selectById(data, Number(productId));

      return {
        product: foundProduct,
        isLoading,
        error,
      };
    },
  });

  // Handle back button
  const handleBack = () => {
    navigate('/');
  };

  // Handle slider image click
  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
  };

  // Show ItemPageSkeleton during loading
  if (isLoading) {
    return <ItemPageSkeleton />;
  }

  if (error || !product) {
    return <div className={styles.error}>Product not found</div>;
  }

  // Combine category and name according to Figma design
  const displayTitle = `${product.category} ${product.name}`;

  // Parse fabric information
  const parseFabricInfo = (fabricText: string) => {
    // Parse string like "100% cotton"
    const match = fabricText.match(/^(\d+%)\s*(.+)$/i);
    if (match && match[2]) {
      return {
        percentage: match[1], // "100%"
        material: match[2].toUpperCase(), // "COTTON"
      };
    }
    // If parsing fails, return original value
    return {
      percentage: fabricText,
      material: 'FABRIC',
    };
  };

  const fabricInfo = parseFabricInfo(product.tags.fabric);

  return (
    <div className={styles.itemPage}>
      <div className={styles.body}>
        {/* Stickers Info */}
        <div className={styles.stickersInfo}>
          {/* Stickers Collections */}
          <div className={styles.stickersCollections}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.left}>
                <div className={styles.title}>
                  <h1 className={styles.titleText}>{displayTitle}</h1>
                </div>
              </div>
              <div className={styles.buttons}>
                <button className={styles.shareButton} onClick={() => shareProduct(product)}>
                  <ShareIcon className={styles.shareIcon} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className={styles.description}>
              <p className={styles.descriptionText}>{product.description}</p>
            </div>
          </div>

          {/* Tags */}
          <div className={styles.tags}>
            <div className={styles.tag}>
              <span className={styles.tagNumber}>{product.price}</span>
              <span className={styles.tagCurrency}>{product.currency}</span>
            </div>
            <div className={styles.tag}>
              <span className={styles.tagNumber}>{product.left}</span>
              <span className={styles.tagText}>LEFT</span>
            </div>
            <div className={styles.tag}>
              <span className={styles.tagNumber}>{fabricInfo.percentage}</span>
              <span className={styles.tagText}>{fabricInfo.material}</span>
            </div>
          </div>
        </div>

        {/* Big Sticker Container */}
        <div className={styles.bigStickerContainer}>
          <div className={styles.bigSticker}>
            {/* 
              RENDER ALL IMAGES, SHOW ONLY THE ACTIVE ONE.
              This method is more reliable than changing `src` and prevents
              the browser from re-downloading images.
            */}
            {product.images.map((image, index) => (
              <div
                key={image}
                style={{
                  display: index === activeImageIndex ? 'block' : 'none',
                  width: '100%',
                  height: '100%',
                }}
              >
                <ProgressiveImage
                  src={image}
                  alt={`${displayTitle} - ${index + 1}`}
                  className={styles.bigStickerImage || ''}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Content */}
      <div className={styles.fixedBottom}>
        {/* Stickers Slider */}
        <div className={styles.sliderContainer}>
          <div className={`${styles.stickersSlider} hide-scrollbar`} ref={sliderRef}>
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`${styles.sticker} ${index === activeImageIndex ? styles.stickerActive : ''}`}
                onClick={() => handleImageClick(index)}
              >
                {/* Use ProgressiveImage for all slider images */}
                <ProgressiveImage
                  src={image}
                  alt={`${displayTitle} - thumb ${index + 1}`}
                  className={styles.stickerFill || ''}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Render Footer as portal in document.body */}
      {createPortal(<Footer product={product} />, document.body)}
    </div>
  );
};

export default ItemPage;
