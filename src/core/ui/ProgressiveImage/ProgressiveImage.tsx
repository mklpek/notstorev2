/******************************************************************************
 * File: ProgressiveImage.tsx
 * Layer: core
 * Desc: Progressive image loading component with LQIP and lazy loading support
 ******************************************************************************/

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

  // Image URL security check
  const secureSrc = src || '';

  // Visibility detection with IntersectionObserver
  useEffect(() => {
    // If loading is eager, no need for visibility detection
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
      { rootMargin: '200px', threshold: 0.01 } // Start loading 200px before visible
    );

    // Observe containerRef.current
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  // Create srcset - for different resolutions
  const createSrcSet = () => {
    if (!secureSrc) return '';

    try {
      // Base URL and querystring (should start with ? or &)
      const baseUrl = secureSrc.split('?')[0];
      const hasQuery = secureSrc.includes('?');
      const queryPrefix = hasQuery ? '&' : '?';

      // srcset values for different widths
      return [
        `${baseUrl}${queryPrefix}${new URLSearchParams({ width: '320', format: 'webp' }).toString()} 320w`,
        `${baseUrl}${queryPrefix}${new URLSearchParams({ width: '640', format: 'webp' }).toString()} 640w`,
        `${baseUrl}${queryPrefix}${new URLSearchParams({ width: '960', format: 'webp' }).toString()} 960w`,
        `${baseUrl}${queryPrefix}${new URLSearchParams({ width: '1280', format: 'webp' }).toString()} 1280w`,
      ].join(', ');
    } catch (error) {
      console.warn('srcSet creation error:', error);
      return '';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className || ''}`}
      style={{ width, height, ...style }}
    >
      {/* Low quality LQIP - eager loading */}
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

      {/* Full quality image - lazy loading */}
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
