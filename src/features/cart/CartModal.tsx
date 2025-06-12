/******************************************************************************
 * File: CartModal.tsx
 * Layer: feature
 * Desc: Shopping cart modal with TON Connect integration and purchase functionality
 ******************************************************************************/

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../core/store/hooks';
import { removeItem, changeQty, clearCart } from './cartSlice';
import { selectCartItems, selectCartTotal } from './selectors';
import {
  useGetCatalogueQuery,
  addPurchaseToHistory,
  catalogSelectors,
} from '../../core/api/notApi';
import Modal from '../../core/ui/Modal';
import ProgressiveImage from '../../core/ui/ProgressiveImage';
import styles from './CartModal.module.css';
import { useTonConnect } from '../../features/tonConnect';
import { createCartTransaction, ensureWalletConnection } from '../../features/tonConnect/buyNow';
import { SuccessModal } from '../../features/tonConnect';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Shopping cart modal component with TON Connect integration
 * Displays cart items, handles quantity changes, and processes purchases
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback function when modal should be closed
 * @returns JSX element containing cart modal
 */
const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();

  // Use memoized selectors for performance
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);

  // TON Connect hook for blockchain transactions
  const { tonConnectUI, isConnected, sendTransaction } = useTonConnect();

  // Fetch product information from API - get entities directly
  const { data: catalogData } = useGetCatalogueQuery();

  // State for success payment modal
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  /**
   * Handles item removal by decreasing quantity
   * @param id - Product ID to remove
   */
  const handleRemove = (id: number) => {
    dispatch(changeQty({ id, delta: -1 }));
  };

  const isEmpty = cartItems.length === 0;

  /**
   * Handles purchase process with TON Connect integration
   * Manages wallet connection, transaction creation, and success handling
   */
  const handlePurchase = async () => {
    if (isEmpty || cartItems.length === 0) {
      onClose();
      return;
    }

    // Save payment information to local variables before modal closes
    const currentCartItems = [...cartItems];
    const currentCartTotal = cartTotal;

    try {
      // Show wallet connection modal if not connected
      // Close cart modal when TON Connect modal opens
      const connected = await ensureWalletConnection(tonConnectUI, onClose);

      if (!connected) {
        console.log('Wallet connection required');
        return;
      }

      // Create bulk payment transaction for cart - use saved information
      const transaction = createCartTransaction(currentCartItems, currentCartTotal);

      // Send transaction
      await sendTransaction(transaction);

      // Show success modal after successful transaction
      setSuccessModalOpen(true);

      // Clear cart
      dispatch(clearCart());
    } catch (error) {
      console.error('Transaction error:', error);
      // Don't clear cart or close modal on error
    }
  };

  /**
   * Expands cart items by quantity for display
   * Uses O(n) complexity instead of O(n²) for better performance
   */
  const expandedCartItems = React.useMemo(() => {
    // Early return if no catalog data
    if (!catalogData) return [];

    return cartItems.flatMap(item => {
      // Get product info using EntityAdapter selector in O(1) time
      const productFromApi = catalogSelectors.selectById(catalogData, item.id);
      const categoryToShow = item.category || productFromApi?.category || 'Product';

      // Create qty number of copies for each product
      return Array.from({ length: item.qty }, (_, index) => ({
        ...item,
        category: categoryToShow,
        uniqueKey: `${item.id}-${index}`,
      }));
    });
  }, [cartItems, catalogData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isEmpty={isEmpty}>
      <div
        className={`${styles.cartModal} ${isEmpty ? styles.emptyCartModal : styles.filledCartModal}`}
      >
        {/* Close Button - Always at top right of modal, independent of header */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          // Style will be like empty cart, adjust from CSS if needed
          style={
            isEmpty
              ? { position: 'absolute', top: '16px', right: '16px', zIndex: 10 }
              : {
                  /* Styles for filled cart will come from CSS */
                }
          }
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="16" fill="rgba(255, 255, 255, 0.08)" />
            <g opacity="0.2">
              <path
                d="M8.907 8.908L19.093 19.092"
                stroke="#B8CADF"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <path
                d="M19.093 8.908L8.907 19.092"
                stroke="#B8CADF"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </button>

        {isEmpty ? (
          <div className={styles.cartContent}>
            <div className={styles.emptyState}>
              <div className={styles.textSection}>
                <h2 className={styles.title}>Cart's cold</h2>
                <p className={styles.description}>No items yet</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header - Contains only title, centered */}
            <div className={styles.headerContainer}>
              <h2 className={styles.title}>Cart</h2>
            </div>

            {/* Lines - Following Figma Lines structure, extends from header to footer */}
            <div className={styles.lines}>
              {expandedCartItems.map(item => {
                return (
                  <div key={item.uniqueKey} className={styles.basketLine}>
                    <div className={styles.itemImage}>
                      <ProgressiveImage src={item.image} alt={item.name} loading="lazy" />
                    </div>
                    <div className={styles.itemDetails}>
                      <div className={styles.itemName}>
                        <span className={styles.itemNamePrimary}>{item.category}</span>
                        <span className={styles.itemNameSecondary}>{item.name}</span>
                      </div>
                      <div className={styles.itemPrice}>
                        {item.price} {item.currency}
                      </div>
                    </div>
                    <button className={styles.removeButton} onClick={() => handleRemove(item.id)}>
                      <svg
                        className={styles.removeIcon}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M1.25 8H14.75"
                          stroke="#B8CADF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Footer Button */}
        <div className={styles.cartFooter}>
          <button className={styles.okButton} onClick={isEmpty ? onClose : handlePurchase}>
            {isEmpty ? 'OK' : `Buy for ${cartTotal} NOT`}
          </button>
        </div>
      </div>

      {/* Success payment modal */}
      <SuccessModal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)} />
    </Modal>
  );
};

export default CartModal;
