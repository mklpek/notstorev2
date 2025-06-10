import React from 'react';
import styles from './ApiErrorMessage.module.css';

interface ApiErrorMessageProps {
  error: any;
  onRetry?: () => void;
  customMessage?: string;
}

const ApiErrorMessage: React.FC<ApiErrorMessageProps> = ({ error, onRetry, customMessage }) => {
  // HTTP hata koduna göre mesaj belirleme
  const getErrorMessage = () => {
    if (customMessage) return customMessage;

    if (!error) return 'Bilinmeyen bir hata oluştu';

    // Status koduna göre mesaj belirleme
    if (error.status === 404) {
      return 'İstenen kaynak bulunamadı';
    } else if (error.status >= 500) {
      return 'Sunucu hatası oluştu, lütfen daha sonra tekrar deneyin';
    } else if (error.status === 401 || error.status === 403) {
      return 'Bu işlem için yetkiniz bulunmuyor';
    }

    return 'Bir hata oluştu, lütfen tekrar deneyin';
  };

  return (
    <div className={styles.errorContainer}>
      <div className={styles.iconContainer}>
        <svg
          className={styles.icon}
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <line
            x1="12"
            y1="7"
            x2="12"
            y2="13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
      </div>
      <div className={styles.textContainer}>
        <h2 className={styles.title}>Hata Oluştu</h2>
        <p className={styles.description}>{getErrorMessage()}</p>
      </div>
      {onRetry && (
        <button className={styles.retryButton} onClick={onRetry}>
          Tekrar Dene
        </button>
      )}
    </div>
  );
};

export default ApiErrorMessage;
