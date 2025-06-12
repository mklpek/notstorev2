/******************************************************************************
 * File: SkeletonElements.tsx
 * Layer: core
 * Desc: Reusable skeleton elements for loading states with memoized components
 ******************************************************************************/

import React from 'react';
import Skeleton from 'react-loading-skeleton';

// Memoized small skeleton components
// Won't re-render unless their props change

interface CircleSkeletonProps {
  size?: number;
  className?: string;
}

/**
 * Circular skeleton component for icons
 * @param size - Circle diameter in pixels
 * @param className - Additional CSS classes
 * @returns Circular skeleton element
 */
export const CircleSkeleton = React.memo(({ size = 24, className = '' }: CircleSkeletonProps) => (
  <Skeleton circle width={size} height={size} className={className} aria-hidden="true" />
));

interface TextSkeletonProps {
  width?: number | string;
  height?: number;
  className?: string;
}

/**
 * Text skeleton component
 * @param width - Skeleton width (default: 100%)
 * @param height - Skeleton height in pixels (default: 20)
 * @param className - Additional CSS classes
 * @returns Text skeleton element
 */
export const TextSkeleton = React.memo(
  ({ width = '100%', height = 20, className = '' }: TextSkeletonProps) => (
    <Skeleton width={width} height={height} className={className} aria-hidden="true" />
  )
);

interface ImageSkeletonProps {
  className?: string;
  borderRadius?: number;
}

/**
 * Image skeleton component
 * @param className - Additional CSS classes
 * @param borderRadius - Border radius in pixels (default: 12)
 * @returns Image skeleton element
 */
export const ImageSkeleton = React.memo(
  ({ className = '', borderRadius = 12 }: ImageSkeletonProps) => (
    <Skeleton
      style={{ borderRadius: `${borderRadius}px` }}
      className={className}
      aria-hidden="true"
    />
  )
);

/**
 * Pagination dots skeleton component
 * @returns Array of skeleton dots for pagination
 */
export const PaginationDotsSkeleton = React.memo(() => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton key={index} circle width={4} height={4} aria-hidden="true" />
    ))}
  </>
));

// Component names for React DevTools
CircleSkeleton.displayName = 'CircleSkeleton';
TextSkeleton.displayName = 'TextSkeleton';
ImageSkeleton.displayName = 'ImageSkeleton';
PaginationDotsSkeleton.displayName = 'PaginationDotsSkeleton';
