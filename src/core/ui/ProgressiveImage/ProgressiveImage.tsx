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
  fetchPriority?: 'high' | 'low' | 'auto';
}

// Tüm bileşenler tarafından paylaşılan tek bir IntersectionObserver
const sharedObserver = (() => {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return null;
  }

  // Gözlemci callback'i
  const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Veri özelliğini al
      const target = entry.target as HTMLElement;
      const imageId = target.dataset.imageId;

      if (imageId) {
        // Durum değişimini tetikle
        const event = new CustomEvent('progressive-image:visible', {
          detail: { imageId },
        });
        document.dispatchEvent(event);

        // Görünen elemanı gözlemlemeyi bırak
        observer.unobserve(entry.target);
      }
    });
  };

  return new IntersectionObserver(callback, {
    rootMargin: '200px 0px',
    threshold: 0.01,
  });
})();

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt = '',
  className = '',
  width,
  height,
  style,
  loading = 'lazy',
  sizes = '100vw',
  fetchPriority = 'auto',
}) => {
  const [loaded, setLoaded] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(loading === 'eager');
  const containerRef = useRef<HTMLDivElement>(null);
  const imageId = useRef(`img-${Math.random().toString(36).substring(2, 10)}`);

  // Görsel URL güvenlik kontrolü
  const secureSrc = src || '';

  // IntersectionObserver ile görünürlük tespiti
  useEffect(() => {
    // Eğer loading eager ise görünürlük tespitine gerek yok
    if (loading === 'eager') {
      setIsIntersecting(true);
      return;
    }

    // Paylaşılan observer'ı kullan
    if (containerRef.current && sharedObserver) {
      // Veri özelliği ekle
      containerRef.current.dataset.imageId = imageId.current;
      sharedObserver.observe(containerRef.current);

      // Görünürlük olayını dinle
      const handleVisibility = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail.imageId === imageId.current) {
          setIsIntersecting(true);
        }
      };

      document.addEventListener('progressive-image:visible', handleVisibility as EventListener);

      return () => {
        if (containerRef.current && sharedObserver) {
          sharedObserver.unobserve(containerRef.current);
        }
        document.removeEventListener(
          'progressive-image:visible',
          handleVisibility as EventListener
        );
      };
    }
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
      {/* Düşük kaliteli LQIP - eager loading */}
      <img
        src={lqip(secureSrc, 16)}
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        decoding="sync"
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
          fetchPriority={loading === 'eager' ? 'high' : 'low'}
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
