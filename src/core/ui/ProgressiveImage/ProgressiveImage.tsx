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
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Görsel URL güvenlik kontrolü
  const secureSrc = src || '';

  // LQIP URL'i al
  const lqipSrc = lqip(secureSrc, 16);

  // not-contest-cdn API'si için özel durum kontrolü
  const isNotContestCdn = secureSrc.includes('not-contest-cdn.openbuilders.xyz');
  const shouldUsePlaceholder = isNotContestCdn && lqipSrc === secureSrc;

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

  // Görsel yüklendiğinde placeholder'ı gizle
  const handleImageLoad = () => {
    setLoaded(true);
    // Kısa bir gecikme ile placeholder'ı gizle (smooth transition için)
    setTimeout(() => {
      setShowPlaceholder(false);
    }, 300);
  };

  // srcset oluştur - farklı çözünürlükler için
  const createSrcSet = () => {
    if (!secureSrc || isNotContestCdn) return '';

    try {
      // Temel URL ve querystring (? veya & ile başlamalı)
      const baseUrl = secureSrc.split('?')[0];
      const hasQuery = secureSrc.includes('?');
      const queryPrefix = hasQuery ? '&' : '?';

      // Farklı genişlikler için srcset değerleri
      return [
        `${baseUrl}${queryPrefix}${new URLSearchParams({ width: '320', format: 'webp' }).toString()} 320w`,
        `${baseUrl}${queryPrefix}${new URLSearchParams({ width: '640', format: 'webp' }).toString()} 640w`,
        `${baseUrl}${queryPrefix}${new URLSearchParams({ width: '960', format: 'webp' }).toString()} 960w`,
        `${baseUrl}${queryPrefix}${new URLSearchParams({ width: '1280', format: 'webp' }).toString()} 1280w`,
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
      {/* Placeholder - not-contest-cdn için özel durum */}
      {shouldUsePlaceholder && showPlaceholder && (
        <div
          className={`${styles.image} ${styles.placeholder} ${loaded ? styles.fadeOut : styles.fadeIn}`}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='rgba(255,255,255,0.1)'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {/* LQIP - sadece farklı URL varsa göster */}
      {!shouldUsePlaceholder && (
        <img
          src={lqipSrc}
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          className={`${styles.image} ${styles.placeholder} ${loaded ? styles.fadeOut : styles.fadeIn}`}
          alt=""
          width={width}
          height={height}
        />
      )}

      {/* Tam kaliteli görsel - lazy loading */}
      {isIntersecting && (
        <img
          src={secureSrc}
          srcSet={createSrcSet()}
          sizes={sizes}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={handleImageLoad}
          className={`${styles.image} ${loaded ? styles.fadeIn : styles.fadeOut}`}
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

export default React.memo(ProgressiveImage);
