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

// Paylaşılan IntersectionObserver
// Tüm görüntüleri gözlemlemek için tek bir observer kullanıyoruz
const sharedObserver = (() => {
  // Browser ortamında değilsek (SSR) null döndür
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return null;
  }

  // Observer için Map - her DOM elementi için bir callback
  const callbacks = new Map<Element, (isIntersecting: boolean) => void>();

  // Ortak Observer instance
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        // Hedef element için kaydedilmiş callback varsa çağır
        const callback = callbacks.get(entry.target);
        if (callback) {
          callback(entry.isIntersecting);

          // Eğer intersect olduysa ve bir kere gözlemlemek istiyorsak, observe'u sonlandır
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            callbacks.delete(entry.target);
          }
        }
      });
    },
    { rootMargin: '200px', threshold: 0.01 } // 200px yukarıdan yüklemeye başla
  );

  return {
    // Element'i gözlemle
    observe: (element: Element, callback: (isIntersecting: boolean) => void) => {
      callbacks.set(element, callback);
      observer.observe(element);
    },

    // Gözlemlemeyi durdur
    unobserve: (element: Element) => {
      observer.unobserve(element);
      callbacks.delete(element);
    },
  };
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

    const currentContainer = containerRef.current;

    // Container varsa ve shared observer mevcutsa
    if (currentContainer && sharedObserver) {
      // Paylaşılan observer'a container'ı ekle
      sharedObserver.observe(currentContainer, isVisible => {
        setIsIntersecting(isVisible);
      });
    } else {
      // Fallback - sharedObserver yoksa veya container yoksa doğrudan görünür yap
      setIsIntersecting(true);
    }

    return () => {
      // Cleanup - observer'dan çıkar
      if (currentContainer && sharedObserver) {
        sharedObserver.unobserve(currentContainer);
      }
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
