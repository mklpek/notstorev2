import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../../../components/Footer';
import ShareIcon from '../../../components/Icons/ShareIcon';
import { useGetCatalogueQuery, catalogSelectors } from '../../../api/notApi';
import styles from './ItemPage.module.css';
import ItemPageSkeleton from '../../../components/Skeleton/ItemPageSkeleton';
import ProgressiveImage from '../../../components/ProgressiveImage';

const ItemPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // API'den ürün verilerini çek - selectFromResult kullanarak doğrudan ürünü alalım
  const { product, isLoading, error } = useGetCatalogueQuery(undefined, {
    selectFromResult: ({ data, isLoading, error }) => {
      // Veri yoksa erken dön
      if (!data || isLoading) {
        return { product: undefined, isLoading, error };
      }

      // catalogSelectors.selectById ile doğrudan ürünü al - O(1) işlem
      const foundProduct = catalogSelectors.selectById(data, Number(productId));

      return {
        product: foundProduct,
        isLoading,
        error,
      };
    },
  });

  // Back butonunu ele almak için
  const handleBack = () => {
    navigate('/');
  };

  // Slider image'e tıklama
  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
  };

  // Yükleme durumunda ItemPageSkeleton göster
  if (isLoading) {
    return <ItemPageSkeleton />;
  }

  if (error || !product) {
    return <div className={styles.error}>Ürün bulunamadı</div>;
  }

  // Figma tasarımına göre kategori ve ismi birleştir
  const displayTitle = `${product.category} ${product.name}`;

  // Fabric bilgisini parse et
  const parseFabricInfo = (fabricText: string) => {
    // "100% cotton" gibi bir string'i parse et
    const match = fabricText.match(/^(\d+%)\s*(.+)$/i);
    if (match && match[2]) {
      return {
        percentage: match[1], // "100%"
        material: match[2].toUpperCase(), // "COTTON"
      };
    }
    // Eğer parse edilemezse, orijinal değeri döndür
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
                <button className={styles.shareButton}>
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
              TÜM GÖRSELLERİ RENDER ET, SADECE AKTİF OLANI GÖSTER.
              Bu yöntem, `src` değiştirmekten daha güvenilirdir ve tarayıcının
              görselleri tekrar indirmesini engeller.
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
          <div className={styles.stickersSlider} ref={sliderRef}>
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`${styles.sticker} ${index === activeImageIndex ? styles.stickerActive : ''}`}
                onClick={() => handleImageClick(index)}
              >
                {/* Tüm slider görselleri için ProgressiveImage kullan */}
                <ProgressiveImage
                  src={image}
                  alt={`${displayTitle} - thumb ${index + 1}`}
                  className={styles.stickerFill || ''}
                />
              </div>
            ))}
          </div>
        </div>

        <Footer product={product} />
      </div>
    </div>
  );
};

export default ItemPage;
