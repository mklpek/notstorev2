/******************************************************************************
 * File: useSkeletonTheme.ts
 * Layer: core
 * Desc: Skeleton theme hook providing memoized theme values for consistent loading states
 ******************************************************************************/

import { useMemo } from 'react';

/**
 * Custom hook that returns memoized skeleton theme values
 * Provides consistent skeleton styles across the application
 * Uses useMemo to prevent unnecessary recalculations on each render
 * @returns Memoized skeleton theme configuration object
 * @example
 * const skeletonTheme = useSkeletonTheme();
 * <SkeletonTheme {...skeletonTheme}>
 */
export const useSkeletonTheme = () => {
  // Memoize theme values for performance
  // Calculated only once and never recalculated
  const themeValues = useMemo(
    () => ({
      baseColor: 'var(--skeleton-base-color, rgba(255, 255, 255, 0.05))',
      highlightColor: 'var(--skeleton-highlight-color, rgba(255, 255, 255, 0.08))',
      borderRadius: 4,
      animationDuration: 1.5,
      enableAnimation: true,
    }),
    []
  );

  return themeValues;
};
