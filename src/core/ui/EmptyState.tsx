/******************************************************************************
 * File: EmptyState.tsx
 * Layer: core
 * Desc: Empty state component for displaying no-content scenarios with contextual messaging
 ******************************************************************************/

import React from 'react';
import styles from './EmptyState.module.css';
import hatchingChick from '../../assets/hatching_chick.svg';

interface EmptyStateProps {
  type: 'history' | 'cart' | 'search';
  query?: string;
  onAction?: () => void;
  actionText?: string;
}

/**
 * Empty state component for various no-content scenarios
 * Provides contextual messaging and optional action buttons based on state type
 * @param type - Type of empty state (history, cart, search)
 * @param query - Optional search query for search empty states
 * @param onAction - Optional callback function for action button
 * @param actionText - Optional custom text for action button
 * @returns JSX element containing empty state UI
 */
const EmptyState: React.FC<EmptyStateProps> = ({ type, query, onAction, actionText }) => {
  /**
   * Determines content based on empty state type
   * @returns Object containing icon, title, description, and action text
   */
  const getContent = () => {
    switch (type) {
      case 'history':
        return {
          icon: hatchingChick,
          title: 'No order history yet',
          description: 'Your orders will appear here when you make a purchase',
          action: actionText || 'Start Shopping',
        };
      case 'cart':
        return {
          icon: hatchingChick,
          title: 'Your cart is empty',
          description: 'Add products to your cart',
          action: actionText || 'Continue Shopping',
        };
      case 'search':
        return {
          icon: hatchingChick,
          title: 'No results found',
          description: query
            ? `No results found for "${query}"`
            : 'No products found in this style',
          action: actionText || 'Show All Products',
        };
      default:
        return {
          icon: hatchingChick,
          title: 'No content found',
          description: 'No content available yet',
          action: actionText || 'Go to Home',
        };
    }
  };

  const content = getContent();

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <img src={content.icon} alt={content.title} className={styles.icon} />
      </div>
      <div className={styles.textContainer}>
        <h2 className={styles.title}>{content.title}</h2>
        <p className={styles.description}>{content.description}</p>
      </div>
      {onAction && (
        <button className={styles.actionButton} onClick={onAction}>
          {content.action}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
