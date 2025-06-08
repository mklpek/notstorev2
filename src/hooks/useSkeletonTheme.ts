import { useMemo } from 'react';

/**
 * Skeleton teması için memoize edilmiş değerler döndüren custom hook
 * Uygulama genelinde tutarlı skeleton stilleri sağlar
 * useMemo kullanımıyla her render'da gereksiz hesaplamaları önler
 */
export const useSkeletonTheme = () => {
  // Theme değerlerini memoize et
  // Sadece bir kez hesaplanır ve asla yeniden hesaplanmaz
  const themeValues = useMemo(() => ({
    baseColor: 'var(--skeleton-base-color, rgba(255, 255, 255, 0.05))',
    highlightColor: 'var(--skeleton-highlight-color, rgba(255, 255, 255, 0.08))',
    borderRadius: 4,
    animationDuration: 1.5,
    enableAnimation: true,
  }), []);
  
  return themeValues;
}; 