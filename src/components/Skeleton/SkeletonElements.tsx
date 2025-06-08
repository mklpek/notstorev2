import React from 'react';
import Skeleton from 'react-loading-skeleton';

// Memoize edilmiş küçük skeleton bileşenleri
// Props'ları değişmediği sürece yeniden render edilmezler

interface CircleSkeletonProps {
  size?: number;
  className?: string;
}

// Dairesel skeleton - ikonlar için
export const CircleSkeleton = React.memo(({ size = 24, className = '' }: CircleSkeletonProps) => (
  <Skeleton 
    circle 
    width={size} 
    height={size} 
    className={className} 
    aria-hidden="true" 
  />
));

interface TextSkeletonProps {
  width?: number | string;
  height?: number;
  className?: string;
}

// Metin skeleton
export const TextSkeleton = React.memo(({ width = '100%', height = 20, className = '' }: TextSkeletonProps) => (
  <Skeleton 
    width={width} 
    height={height} 
    className={className} 
    aria-hidden="true" 
  />
));

interface ImageSkeletonProps {
  className?: string;
  borderRadius?: number;
}

// Görsel skeleton
export const ImageSkeleton = React.memo(({ className = '', borderRadius = 12 }: ImageSkeletonProps) => (
  <Skeleton 
    style={{ borderRadius: `${borderRadius}px` }} 
    className={className} 
    aria-hidden="true" 
  />
));

// Pagination dots skeleton
export const PaginationDotsSkeleton = React.memo(() => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton key={index} circle width={4} height={4} aria-hidden="true" />
    ))}
  </>
));

// React DevTools için komponent adları
CircleSkeleton.displayName = 'CircleSkeleton';
TextSkeleton.displayName = 'TextSkeleton';
ImageSkeleton.displayName = 'ImageSkeleton';
PaginationDotsSkeleton.displayName = 'PaginationDotsSkeleton'; 