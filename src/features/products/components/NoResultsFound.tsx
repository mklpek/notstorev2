import React from 'react';
import styles from './NoResultsFound.module.css';
// SVG'yi <img> olarak kullanıyoruz - büyük illüstrasyonlar için CDN üzerinden cache edilmesi daha verimli
// Küçük ikonlarda import { ReactComponent as Icon } from '...svg'; şeklinde kullanım daha az HTTP isteği yapar
import hatchingChick from '../../../assets/hatching_chick.svg';

const NoResultsFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <img src={hatchingChick} alt="Sonuç bulunamadı" className={styles.icon} />
      </div>
      <div className={styles.textContainer}>
        <h2 className={styles.title}>Not Found</h2>
        <p className={styles.description}>
          This style doesn't exist
        </p>
      </div>
    </div>
  );
};

export default NoResultsFound; 