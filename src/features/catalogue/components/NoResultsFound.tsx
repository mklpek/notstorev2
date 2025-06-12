/******************************************************************************
 * File: NoResultsFound.tsx
 * Layer: feature
 * Desc: No search results component with illustration and message
 ******************************************************************************/

import React from 'react';
import styles from './NoResultsFound.module.css';
// Using SVG as <img> - more efficient for large illustrations to be cached via CDN
// For small icons, use import { ReactComponent as Icon } from '...svg'; for fewer HTTP requests
import hatchingChick from '../../../assets/hatching_chick.svg';

/**
 * No results found component
 * Displays when search query returns no products
 * @returns JSX element containing no results message with illustration
 */
const NoResultsFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <img src={hatchingChick} alt="No results found" className={styles.icon} />
      </div>
      <div className={styles.textContainer}>
        <h2 className={styles.title}>Not Found</h2>
        <p className={styles.description}>This style doesn't exist</p>
      </div>
    </div>
  );
};

export default NoResultsFound;
