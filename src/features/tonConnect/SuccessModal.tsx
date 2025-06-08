import React from 'react';
import styles from './SuccessModal.module.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.fullScreenModal}>
      <div className={styles.modalBody}>
        <div className={styles.successImage} aria-label="Success image"></div>
        <div className={styles.textContainer}>
          <h1 className={styles.successTitle}>You Got It!</h1>
          <p className={styles.successMessage}>Your purchase is on the way</p>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.mainButton} onClick={onClose}>
          <div className={styles.shine}></div>
          <span className={styles.buttonLabel}>Awesome</span>
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
