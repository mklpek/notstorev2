/******************************************************************************
 * File: Modal.tsx
 * Layer: core
 * Desc: Reusable modal component with backdrop and click-outside-to-close functionality
 ******************************************************************************/

import React from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isEmpty?: boolean;
}

/**
 * Modal component with backdrop and overlay functionality
 * Supports click-outside-to-close and conditional styling based on content
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback function when modal should be closed
 * @param children - Modal content to be rendered
 * @param isEmpty - Optional flag for empty state styling
 * @returns JSX element containing modal or null if closed
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, isEmpty = false }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${isEmpty ? styles.emptyModal : styles.filledModal}`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
