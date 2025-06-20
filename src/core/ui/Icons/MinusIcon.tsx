/******************************************************************************
 * File: MinusIcon.tsx
 * Layer: core
 * Desc: Minus icon component for quantity decrease operations with click handling
 ******************************************************************************/

import React from 'react';

interface MinusIconProps {
  className?: string | undefined;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Minus icon component for decrementing quantities
 * Provides interactive minus symbol with click handling and accessibility
 * @param className - Additional CSS classes for styling
 * @param onClick - Click event handler for decrement operations
 * @returns JSX element containing minus icon SVG
 */
const MinusIcon: React.FC<MinusIconProps> = ({ className, onClick }) => {
  return (
    <svg
      width="15"
      height="4"
      viewBox="0 0 15 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role={onClick ? 'button' : 'img'}
      aria-label={onClick ? 'Decrease quantity' : 'Minus icon'}
    >
      <path
        d="M2.04004 3.08594C1.85742 3.08594 1.68587 3.0389 1.52539 2.94482C1.36491 2.84521 1.23486 2.71517 1.13525 2.55469C1.03564 2.38867 0.98584 2.20882 0.98584 2.01514C0.98584 1.82145 1.03564 1.64437 1.13525 1.48389C1.23486 1.3234 1.36491 1.19613 1.52539 1.10205C1.68587 1.00244 1.85742 0.952637 2.04004 0.952637H13.9517C14.1398 0.952637 14.3141 1.00244 14.4746 1.10205C14.6351 1.19613 14.7624 1.3234 14.8564 1.48389C14.9561 1.64437 15.0059 1.82145 15.0059 2.01514C15.0059 2.20882 14.9561 2.38867 14.8564 2.55469C14.7624 2.71517 14.6351 2.84521 14.4746 2.94482C14.3141 3.0389 14.1398 3.08594 13.9517 3.08594H2.04004Z"
        fill="white"
      />
    </svg>
  );
};

export default MinusIcon;
