import React from 'react';
import Icon from '../Icon';

interface StoreIconProps {
  className?: string | undefined;
}

const StoreIcon: React.FC<StoreIconProps> = ({ className }) => {
  return <Icon name="store-icon" size={24} label="Store" className={className} />;
};

export default StoreIcon;
