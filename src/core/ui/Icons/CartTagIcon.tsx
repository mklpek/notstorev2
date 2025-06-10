import React from 'react';
import Icon from '../Icon';

interface CartTagIconProps {
  className?: string | undefined;
}

const CartTagIcon: React.FC<CartTagIconProps> = ({ className }) => {
  return <Icon name="cart-tag-icon" size={22} label="Cart Tag" className={className} />;
};

export default CartTagIcon;
