import React, { useState, useEffect } from 'react';
import { lqip } from '../../utils/lqip';
import styles from './ProgressiveImage.module.css';

interface ProgressiveImageProps {
  src: string;
  alt?: string;
  className?: string | undefined;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
  sizes?: string;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt = '',
  className = '',
  width,
  height,
  style,
  loading = 'lazy',
  sizes = '100vw'
}) => {
  const [loaded, setLoaded] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  // Görsel URL güvenlik kontrolü
  const secureSrc = src || '';
  
  // IntersectionObserver ile görünürlük tespiti
  useEffect(() => {
    // Eğer loading eager ise görünürlük tespitine gerek yok
    if (loading === 'eager') {
      setIsIntersecting(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0.01 } // 200px yukarıdan yüklemeye başla
    );
    
    // Görüntülenebilir ekranda olmasa bile düşük kaliteli blur görsel yüklensin
    setIsIntersecting(true);
    
    return () => {
      observer.disconnect();
    };
  }, [loading]);

  // srcset oluştur - farklı çözünürlükler için
  const createSrcSet = () => {
    if (!secureSrc) return '';
    
    try {
      // Temel URL ve querystring (? veya & ile başlamalı)
      const baseUrl = secureSrc.split('?')[0];
      const hasQuery = secureSrc.includes('?');
      const queryPrefix = hasQuery ? '&' : '?';
      
      // Farklı genişlikler için srcset değerleri
      return [
        `${baseUrl}${queryPrefix}width=320&format=webp 320w`,
        `${baseUrl}${queryPrefix}width=640&format=webp 640w`, 
        `${baseUrl}${queryPrefix}width=960&format=webp 960w`,
        `${baseUrl}${queryPrefix}width=1280&format=webp 1280w`
      ].join(', ');
    } catch (error) {
      console.warn('srcSet oluşturma hatası:', error);
      return '';
    }
  };

  return (
    <div 
      className={`${styles.container} ${className || ''}`} 
      style={{ width, height, ...style }}
    >
      {/* Düşük kaliteli LQIP - eager loading */}
      <img
        src={lqip(secureSrc, 16)} 
        aria-hidden="true"
        loading="eager" 
        fetchPriority="high"
        className={`${styles.image} ${styles.placeholder} ${loaded ? styles.fadeOut : styles.fadeIn}`}
        alt=""
        width={width}
        height={height}
      />
      
      {/* Tam kaliteli görsel - lazy loading */}
      {isIntersecting && (
        <img
          src={secureSrc}
          srcSet={createSrcSet()}
          sizes={sizes}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`${styles.image} ${loaded ? styles.fadeIn : styles.fadeOut}`}
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

export default React.memo(ProgressiveImage); 