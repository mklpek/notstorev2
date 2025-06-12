/******************************************************************************
 * File: StoreIcon.tsx
 * Layer: core
 * Desc: Store icon component for navigation and store-related UI elements
 ******************************************************************************/

import React from 'react';
import Icon from '../Icon';

interface StoreIconProps {
  className?: string | undefined;
}

/**
 * Store icon component
 * Used in navigation TabBar and store-related UI elements
 * @param className - Optional CSS class for styling
 * @returns JSX element containing store icon
 */
const StoreIcon: React.FC<StoreIconProps> = ({ className }) => {
  return <Icon name="store-icon" size={24} label="Store" className={className} />;
};

export default StoreIcon;
