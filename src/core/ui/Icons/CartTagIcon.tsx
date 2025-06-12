/******************************************************************************
 * File: CartTagIcon.tsx
 * Layer: core
 * Desc: Cart tag icon component indicating item is in shopping cart
 ******************************************************************************/

import React from 'react';
import Icon from '../Icon';

interface CartTagIconProps {
  className?: string | undefined;
}

/**
 * Cart tag icon component
 * Displays a visual indicator when an item is added to the shopping cart
 * @param className - Optional CSS class for styling
 * @returns JSX element containing cart tag icon
 */
const CartTagIcon: React.FC<CartTagIconProps> = ({ className }) => {
  return <Icon name="cart-tag-icon" size={22} label="Cart Tag" className={className} />;
};

export default CartTagIcon;
