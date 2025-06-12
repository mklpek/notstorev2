/******************************************************************************
 * File: Icon.tsx
 * Layer: core
 * Desc: SVG icon component with accessibility support and Telegram theme integration
 ******************************************************************************/

import React from 'react';

interface IconProps {
  name: string;
  size?: number;
  label?: string; // for accessibility
  className?: string | undefined;
}

/**
 * SVG icon component using sprite system
 * Provides accessible icons with Telegram theme color support
 * @param name - Icon name from sprite
 * @param size - Icon size in pixels (default: 24)
 * @param label - Accessibility label for screen readers
 * @param className - Additional CSS classes
 * @returns JSX element containing SVG icon
 */
const Icon: React.FC<IconProps> = ({ name, size = 24, label, className }) => (
  <svg
    width={size}
    height={size}
    aria-hidden={label ? undefined : true}
    aria-label={label}
    role="img"
    className={className}
    style={{ fill: 'currentColor' }} // Telegram theme color
    focusable="false" // Prevent from entering tab order
  >
    <use xlinkHref={`#icon-${name}`} /> {/* symbol inside sprite */}
  </svg>
);

export default Icon;
