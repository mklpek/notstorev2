import React from 'react';
import styles from './EmptyState.module.css';
import hatchingChick from '../assets/hatching_chick.svg';

interface EmptyStateProps {
  type: 'history' | 'cart' | 'search';
  query?: string;
  onAction?: () => void;
  actionText?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  type, 
  query, 
  onAction, 
  actionText 
}) => {
  // Type'a göre mesaj ve icon belirleme
  const getContent = () => {
    switch (type) {
      case 'history':
        return {
          icon: hatchingChick,
          title: 'Henüz sipariş geçmişiniz yok',
          description: 'Sipariş verdiğinizde burada görünecek',
          action: actionText || 'Alışverişe Başla'
        };
      case 'cart':
        return {
          icon: hatchingChick,
          title: 'Sepetiniz boş',
          description: 'Sepetinize ürün ekleyin',
          action: actionText || 'Alışverişe Devam Et'
        };
      case 'search':
        return {
          icon: hatchingChick,
          title: 'Sonuç bulunamadı',
          description: query ? `"${query}" için sonuç bulunamadı` : 'Bu stilde ürün bulunamadı',
          action: actionText || 'Tüm Ürünleri Göster'
        };
      default:
        return {
          icon: hatchingChick,
          title: 'İçerik bulunamadı',
          description: 'Henüz içerik bulunmuyor',
          action: actionText || 'Ana Sayfaya Dön'
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
        <button 
          className={styles.actionButton} 
          onClick={onAction}
        >
          {content.action}
        </button>
      )}
    </div>
  );
};

export default EmptyState; 