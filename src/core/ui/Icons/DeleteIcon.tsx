/******************************************************************************
 * File: DeleteIcon.tsx
 * Layer: core
 * Desc: Delete icon component for removing items from cart or lists
 ******************************************************************************/

import React from 'react';
import Icon from '../Icon';

/**
 * Delete icon component
 * Used for removing items from cart, lists, or other deletion actions
 * @returns JSX element containing delete icon
 */
const DeleteIcon: React.FC = () => {
  return <Icon name="delete-icon" size={16} label="Delete" />;
};

export default DeleteIcon;
