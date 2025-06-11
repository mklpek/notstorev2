import React, { useState, useEffect, useRef } from 'react';
import { lqip } from '../../utils/lqip';
import styles from './ProgressiveImage.module.css';

interface ProgressiveImageProps {
  src: string;
  alt?: string;
  className?: string | undefined;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
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
  sizes = '100vw',
}) => {
  const [loaded, setLoaded] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      entries => {
        if (entries[0]?.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0.01 } // 200px yukarıdan yüklemeye başla
    );

    // containerRef.current'ı observe et
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  // srcset oluştur - daha az ve optimum çözünürlükler için
  const createSrcSet = () => {
    if (!secureSrc) return '';

    try {
      // Temel URL ve querystring (? veya & ile başlamalı)
      const baseUrl = secureSrc.split('?')[0];
      const hasQuery = secureSrc.includes('?');
      const queryPrefix = hasQuery ? '&' : '?';

      // Daha az ve optimum çözünürlükler için srcset değerleri
      // Mobil cihazlar için 320/480/640 değerleri yeterlidir - 960/1280 kaldırıldı
      return [
        `${baseUrl}${queryPrefix}${new URLSearchParams({ width: '320', format: 'webp' }).toString()} 320w`,
        `${baseUrl}${queryPrefix}${new URLSearchParams({ width: '480', format: 'webp' }).toString()} 480w`,
        `${baseUrl}${queryPrefix}${new URLSearchParams({ width: '640', format: 'webp' }).toString()} 640w`,
      ].join(', ');
    } catch (error) {
      console.warn('srcSet oluşturma hatası:', error);
      return '';
    }
  };

  return (
    <div
      ref={containerRef}
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
